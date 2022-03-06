import { Component, Directive, NgModule, Pipe, Provider } from '@angular/core';

import { flatten } from '../common/core.helpers';
import { Type } from '../common/core.types';
import { isNgModuleDefWithProviders } from '../common/func.is-ng-module-def-with-providers';
import ngMocksUniverse from '../common/ng-mocks-universe';

import createResolvers from './create-resolvers';
import markProviders from './mark-providers';

const flatToExisting = <T, R>(data: T | T[], callback: (arg: T) => R | undefined): R[] =>
  flatten(data)
    .map(callback)
    .filter((item): item is R => !!item);

type processMeta =
  | 'declarations'
  | 'entryComponents'
  | 'bootstrap'
  | 'providers'
  | 'viewProviders'
  | 'imports'
  | 'exports';

const configureProcessMetaKeys = (
  resolve: (def: any) => any,
  resolveProvider: (def: Provider) => any,
): Array<[processMeta, (def: any) => any]> => [
  ['declarations', resolve],
  ['entryComponents', resolve],
  ['bootstrap', resolve],
  ['providers', resolveProvider],
  ['viewProviders', resolveProvider],
  ['imports', resolve],
  ['exports', resolve],
];

const processMeta = (
  ngModule: Partial<NgModule & Component & Directive & Pipe>,
  resolve: (def: any) => any,
  resolveProvider: (def: Provider) => any,
): NgModule => {
  const mockModuleDef: Partial<NgModule & Component & Directive & Pipe> = {};
  const keys = configureProcessMetaKeys(resolve, resolveProvider);

  const cachePipe = ngMocksUniverse.flags.has('cachePipe');
  if (!cachePipe) {
    ngMocksUniverse.flags.add('cachePipe');
  }
  for (const [key, callback] of keys) {
    if (ngModule[key]?.length) {
      mockModuleDef[key] = flatToExisting(ngModule[key], callback);
    }
  }
  markProviders(mockModuleDef.providers);
  markProviders(mockModuleDef.viewProviders);

  if (!cachePipe) {
    ngMocksUniverse.flags.delete('cachePipe');
  }

  return mockModuleDef;
};

const resolveDefForExport = (
  def: any,
  resolve: (def: any) => any,
  correctExports: boolean,
  ngModule?: Type<any>,
): Type<any> | undefined => {
  const moduleConfig = ngMocksUniverse.config.get(ngModule) || {};
  const instance = isNgModuleDefWithProviders(def) ? def.ngModule : def;
  const mockDef = resolve(instance);
  if (!mockDef) {
    return undefined;
  }

  // If we export a declaration, then we have to export its module too.
  const config = ngMocksUniverse.config.get(instance);
  if (config?.export && ngModule) {
    if (!moduleConfig.export) {
      ngMocksUniverse.config.set(ngModule, {
        ...moduleConfig,
        export: true,
      });
    }
  }

  if (correctExports && !moduleConfig.exportAll && !config?.export) {
    return undefined;
  }

  return mockDef;
};

const skipAddExports = (mockDef: any, mockModuleDef: NgModule): mockDef is undefined =>
  !mockDef || (!!mockModuleDef.exports && mockModuleDef.exports.indexOf(mockDef) !== -1);

// if we are in the skipMock mode we need to export only the default exports.
// if we are in the correctModuleExports mode we need to export only default exports.
const addExports = (
  resolve: (def: any) => any,
  change: () => void,
  ngModuleDef: NgModule,
  mockModuleDef: NgModule,
  ngModule?: Type<any>,
): void => {
  const correctExports = ngMocksUniverse.flags.has('skipMock') || ngMocksUniverse.flags.has('correctModuleExports');
  for (const def of flatten([ngModuleDef.imports || [], ngModuleDef.declarations || []])) {
    const mockDef = resolveDefForExport(def, resolve, correctExports, ngModule);
    if (skipAddExports(mockDef, mockModuleDef)) {
      continue;
    }

    change();
    mockModuleDef.exports = mockModuleDef.exports || [];
    mockModuleDef.exports.push(mockDef);
  }
};

export default (ngModuleDef: NgModule, ngModule?: Type<any>): [boolean, NgModule] => {
  const hasResolver = ngMocksUniverse.config.has('mockNgDefResolver');
  if (!hasResolver) {
    ngMocksUniverse.config.set('mockNgDefResolver', new Map());
  }
  let changed = !ngMocksUniverse.flags.has('skipMock');
  const change = (flag = true) => {
    changed = changed || flag;
  };
  const { resolve, resolveProvider } = createResolvers(change, ngMocksUniverse.config.get('mockNgDefResolver'));
  const mockModuleDef = processMeta(ngModuleDef, resolve, resolveProvider);
  addExports(resolve, change, ngModuleDef, mockModuleDef, ngModule);

  if (!hasResolver) {
    ngMocksUniverse.config.delete('mockNgDefResolver');
  }

  return [changed, mockModuleDef];
};
