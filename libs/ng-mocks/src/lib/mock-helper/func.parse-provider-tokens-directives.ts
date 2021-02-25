import { DebugNode, Directive } from '@angular/core';

import coreInjector from '../common/core.injector';
import coreReflectDirectiveResolve from '../common/core.reflect.directive-resolve';
import funcGetProvider from '../common/func.get-provider';

const getMeta = (token: any): Directive | undefined => {
  try {
    return coreReflectDirectiveResolve(token);
  } catch (e) {
    // Looks like it is a token.
  }

  return undefined;
};

export default (el: DebugNode | null | undefined, token: any): Directive | undefined => {
  // istanbul ignore if
  if (!el) {
    return undefined;
  }

  try {
    const provider = funcGetProvider(token);
    const instance = coreInjector(provider, el.injector);

    return getMeta(instance.constructor);
  } catch (e) {
    return undefined;
  }
};
