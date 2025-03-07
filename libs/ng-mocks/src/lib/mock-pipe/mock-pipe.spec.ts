import {
  Component,
  NgModule,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { isMockedNgDefOf } from '../common/func.is-mocked-ng-def-of';
import { MockModule } from '../mock-module/mock-module';

import { MockPipe, MockPipes } from './mock-pipe';

@Pipe({ name: 'mockPipe', standalone: false })
export class ExamplePipe implements PipeTransform {
  public transform = (args: string): string => (args ? 'hi' : 'hi');
}

@Pipe({ name: 'anotherMockPipe', standalone: true })
export class AnotherExamplePipe implements PipeTransform {
  public transform = (args: string): string => (args ? 'hi' : 'hi');
}

@Component({
  selector: 'example-component',
  standalone: false,
  template: `
    <span id="examplePipe">{{ someStuff | mockPipe: 'foo' }}</span>
    <span id="anotherExamplePipe">{{
      someStuff | anotherMockPipe: 'fighters'
    }}</span>
  `,
})
export class ExampleComponent {
  public someStuff = 'bah';
}

@NgModule({
  declarations: [ExamplePipe],
  exports: [ExamplePipe],
})
class TestModule {}

@Component({
  selector: 'example-component',
  standalone: true,
  imports: [TestModule, AnotherExamplePipe],
  template: `
    <span id="examplePipe">{{ someStuff | mockPipe: 'foo' }}</span>
    <span id="anotherExamplePipe">{{
      someStuff | anotherMockPipe: 'fighters'
    }}</span>
  `,
})
export class ExampleStandaloneComponent {
  public someStuff = 'bah';
}

describe('MockPipe', () => {
  let fixture: ComponentFixture<ExampleComponent>;

  it('mocks several pipes', () => {
    const mocks = MockPipes(ExamplePipe, AnotherExamplePipe);
    expect(mocks.length).toEqual(2);
    expect(isMockedNgDefOf(mocks[0], ExamplePipe, 'p')).toBeTruthy();
    expect(
      isMockedNgDefOf(mocks[1], AnotherExamplePipe, 'p'),
    ).toBeTruthy();
  });

  it('used default transform', () => {
    const mock = MockPipe(ExamplePipe);
    const instance = new mock();
    expect(instance.transform('default')).toBeUndefined();
  });

  describe('Base tests-jasmine', () => {
    beforeEach(async () => {
      return TestBed.configureTestingModule({
        declarations: [
          ExampleComponent,
          MockPipe(ExamplePipe, () => 'foo'),
          MockPipe(AnotherExamplePipe),
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ExampleComponent);
      fixture.detectChanges();
    });

    it('should not display the word hi that is printed by the pipe, because it is replaced with its mock copy', () => {
      expect(
        fixture.debugElement.query(By.css('#anotherExamplePipe'))
          .nativeElement.innerHTML,
      ).toEqual('');
    });

    describe('with transform override', () => {
      it('should return the result of the provided transform function', () => {
        expect(
          fixture.debugElement.query(By.css('#examplePipe'))
            .nativeElement.innerHTML,
        ).toEqual('foo');
      });
    });
  });

  describe('Base tests-jasmine - standalone', () => {
    beforeEach(async () => {
      return TestBed.configureTestingModule({
        imports: [
          ExampleStandaloneComponent,
          MockPipe(AnotherExamplePipe),
          MockModule(TestModule),
        ],
        declarations: [MockPipe(ExamplePipe, () => 'bla')],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ExampleStandaloneComponent);
      fixture.detectChanges();
    });

    it('should not display the word hi that is printed by the pipe, because it is replaced with its mock copy', () => {
      expect(
        fixture.debugElement.query(By.css('#anotherExamplePipe'))
          .nativeElement.innerHTML,
      ).toEqual('');
    });

    describe('with transform override', () => {
      it('should return the result of the provided transform function', () => {
        expect(
          fixture.debugElement.query(By.css('#examplePipe'))
            .nativeElement.innerHTML,
        ).toEqual('bla');
      });
    });
  });

  describe('Cache check', () => {
    beforeEach(async () => {
      return TestBed.configureTestingModule({
        declarations: [
          ExampleComponent,
          MockPipe(ExamplePipe, () => 'bar'),
          MockPipe(AnotherExamplePipe),
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ExampleComponent);
      fixture.detectChanges();
    });

    it('should return the result of the new provided transform function', () => {
      expect(
        fixture.debugElement.query(By.css('#examplePipe'))
          .nativeElement.innerHTML,
      ).toEqual('bar');
    });

    it('returns cached version', () => {
      const mock = MockPipe(ExamplePipe);
      expect(isMockedNgDefOf(mock, ExamplePipe)).toBeTruthy();
    });
  });
});
