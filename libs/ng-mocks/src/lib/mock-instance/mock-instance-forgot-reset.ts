import ngMocksUniverse from '../common/ng-mocks-universe';

export default (checkReset: Array<[any, any]>) => {
  const showError: string[] = [];

  // istanbul ignore next: because of the installed global scope switcher we cannot test this part
  while (checkReset.length) {
    const [declaration, config] = checkReset.pop() || /* istanbul ignore next */ [];
    if (config === ngMocksUniverse.configInstance.get(declaration)) {
      showError.push(typeof declaration === 'function' ? declaration.name : declaration);
    }
  }

  // istanbul ignore if: because of the installed global scope switcher we cannot test this part
  if (showError.length) {
    const globalFlags = ngMocksUniverse.global.get('flags');
    const errorMessage = [
      `MockInstance: side effects have been detected (${showError.join(', ')}).`,
      `Forgot to add MockInstance.scope() or to call MockInstance.restore()?`,
    ].join(' ');
    if (globalFlags.onMockInstanceRestoreNeed === 'warn') {
      // tslint:disable-next-line no-console
      console.warn(errorMessage);
    } else if (globalFlags.onMockInstanceRestoreNeed === 'throw') {
      throw new Error(errorMessage);
    }
  }
};
