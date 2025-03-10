import coreDefineProperty from './core.define-property';
import { AnyType } from './core.types';
import funcGetName from './func.get-name';
import { ngMocksMockConfig } from './mock';
import ngMocksUniverse from './ng-mocks-universe';

export default (mock: AnyType<any>, source: AnyType<any>, configInput: ngMocksMockConfig = {}): void => {
  coreDefineProperty(mock, 'mockOf', source);
  coreDefineProperty(mock, 'nameConstructor', funcGetName(mock));
  coreDefineProperty(mock, 'name', `MockOf${funcGetName(source)}`, true);
  const config = ngMocksUniverse.getConfigMock().has(source)
    ? {
        ...configInput,
        config: {
          ...ngMocksUniverse.getConfigMock().get(source),
          ...configInput.config,
        },
      }
    : configInput;
  coreDefineProperty(mock.prototype, '__ngMocksConfig', config);

  if ((mock as any).ɵmod?.declarations) {
    for (const declaration of (mock as any).ɵmod.declarations) {
      if (declaration?.decorators?.[0]?.args?.[0] && declaration?.decorators?.[0]?.args?.[0].standalone === undefined) {
        declaration.decorators[0].args[0].standalone = false;
      }
    }
  }
};
