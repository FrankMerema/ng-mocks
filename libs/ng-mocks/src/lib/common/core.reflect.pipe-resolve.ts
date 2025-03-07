import { Pipe } from '@angular/core';

import collectDeclarations from '../resolve/collect-declarations';

import coreReflectBodyCatch from './core.reflect.body-catch';
import { isStandalone } from './func.is-standalone';

export default (def: any): Pipe & { standalone?: boolean } =>
  coreReflectBodyCatch((arg: any) => {
    const declaration = collectDeclarations(arg);
    if (declaration.Pipe) {
      if (declaration.Pipe.standalone === undefined) {
        declaration.Pipe.standalone = isStandalone(def);
      }

      return declaration.Pipe;
    }

    throw new Error('Cannot resolve declarations');
  })(def);
