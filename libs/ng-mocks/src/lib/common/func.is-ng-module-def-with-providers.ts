import { Provider } from '@angular/core';

import { Type } from './core.types';

/**
 * NgModuleWithProviders helps to support ModuleWithProviders in all angular versions.
 * In A5 it was without the generic type.
 *
 * @internal remove after removal of A5 support
 */
export interface NgModuleWithProviders<T = any> {
  ngModule: Type<T>;
  providers?: Array<Provider>;
}

/**
 * NgModuleWithProviders which supports A15
 *
 * @internal remove after removal of A5 support and switch to NgModuleWithProviders
 */
export interface NgModuleWithProvidersA15<T = any> {
  ngModule: Type<T>;
  providers?: Array<Provider | { ɵbrand: string }>;
}

/**
 * isNgModuleDefWithProviders checks if an object implements ModuleWithProviders.
 *
 * @internal
 */
export const isNgModuleDefWithProviders = (declaration: any): declaration is NgModuleWithProviders =>
  declaration && typeof declaration === 'object' && typeof declaration.ngModule === 'function';
