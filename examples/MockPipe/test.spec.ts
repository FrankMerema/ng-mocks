import {
  Component,
  NgModule,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

@Pipe({
  name: 'dependency',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]:
    false,
})
class DependencyPipe implements PipeTransform {
  public transform(name: string): string {
    return `hi ${name}`;
  }
}

@Component({
  selector: 'target',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]:
    false,
  template: '{{ "foo" | dependency }}',
})
class TargetComponent {
  public targetMockPipe() {}
}

@NgModule({
  declarations: [TargetComponent, DependencyPipe],
})
class ItsModule {}

// A fake transform function.
const fakeTransform = (...args: string[]) => JSON.stringify(args);

describe('MockPipe', () => {
  // A spy, just in case if we want to verify
  // how the pipe has been called.
  const spy =
    typeof jest === 'undefined'
      ? jasmine.createSpy().and.callFake(fakeTransform)
      : jest.fn(fakeTransform);
  // in case of jest
  // const spy = jest.fn().mockImplementation(fakeTransform);

  beforeEach(() => {
    return (
      MockBuilder(TargetComponent, ItsModule)
        // DependencyPipe is a declaration in ItsModule
        .mock(DependencyPipe, spy)
    );
  });

  it('transforms values to json', () => {
    const fixture = MockRender(TargetComponent);

    expect(fixture.nativeElement.innerHTML).toEqual(
      '<target>["foo"]</target>',
    );

    // Also we can find an instance of the pipe in
    // the fixture if it is needed.
    const pipe = ngMocks.findInstance(DependencyPipe);
    expect(pipe.transform).toHaveBeenCalledWith('foo');
    expect(pipe.transform).toHaveBeenCalledTimes(1);
  });
});
