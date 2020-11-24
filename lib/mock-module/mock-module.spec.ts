import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ApplicationModule,
  APP_INITIALIZER,
  Component,
  FactoryProvider,
  InjectionToken,
  Injector,
  NgModule,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ngModuleResolver } from '../common/core.reflect';
import ngMocksUniverse from '../common/ng-mocks-universe';
import { MockComponent } from '../mock-component/mock-component';
import { MockRender } from '../mock-render/mock-render';
import mockProvider from '../mock-service/mock-provider';

import { MockModule } from './mock-module';
import {
  AppRoutingModule,
  CustomWithServiceComponent,
  ExampleComponent,
  ExampleConsumerComponent,
  LogicNestedModule,
  LogicRootModule,
  ModuleWithProvidersModule,
  ParentModule,
  SameImports1Module,
  SameImports2Module,
  WithServiceModule,
} from './mock-module.spec.fixtures';

@Component({
  selector: 'component-subject',
  template: `
    <example-component></example-component>
    <span example-directive></span>
    {{ test | examplePipe }}
  `,
})
class ComponentSubject {
  public test = 'test';
}

@Component({
  selector: 'same-imports',
  template: `same imports`,
})
class SameImportsComponent {}

describe('MockModule', () => {
  let fixture: ComponentFixture<ComponentSubject>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentSubject],
      imports: [MockModule(ParentModule), MockModule(ModuleWithProvidersModule)],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ComponentSubject);
        fixture.detectChanges();
      });
  }));

  it('should do stuff', () => {
    const mockComponent = fixture.debugElement.query(By.directive(MockComponent(ExampleComponent)))
      .componentInstance as ExampleComponent;
    expect(mockComponent).not.toBeNull();
  });
});

describe('SameImportsModules', () => {
  let fixture: ComponentFixture<SameImportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SameImportsComponent],
      imports: [MockModule(SameImports1Module), MockModule(SameImports2Module)],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SameImportsComponent);
        fixture.detectChanges();
      });
  }));

  it('should be imported correctly', () => {
    expect(fixture.componentInstance).toEqual(jasmine.any(SameImportsComponent));
    expect(fixture.nativeElement.innerText).toEqual('same imports');
  });
});

describe('NeverMockModules', () => {
  let fixture: ComponentFixture<SameImportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SameImportsComponent],
      imports: [
        MockModule(ApplicationModule),
        MockModule(BrowserAnimationsModule),
        MockModule(BrowserModule),
        MockModule(CommonModule),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SameImportsComponent);
        fixture.detectChanges();
      });
  }));

  it('should not fail when we pass them to MockModule', () => {
    expect(fixture.componentInstance).toEqual(jasmine.any(SameImportsComponent));
    expect(fixture.nativeElement.innerText).toEqual('same imports');
  });
});

describe('RouterModule', () => {
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleComponent],
      imports: [MockModule(AppRoutingModule)],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ExampleComponent);
        fixture.detectChanges();
      });
  }));

  it('should not fail when we pass RouterModule to MockModule', () => {
    expect(fixture.componentInstance).toEqual(jasmine.any(ExampleComponent));
    expect(fixture.nativeElement.innerText).toEqual('My Example');
  });
});

// What we mock should always export own private imports and declarations to allow us to use it in TestBed.
// In this test we check that nested module from cache still provides own private things.
// See https://github.com/ike18t/ng-mocks/pull/35
describe('Usage of cached nested module', () => {
  let fixture: ComponentFixture<ExampleConsumerComponent>;

  describe('1st test for root', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ExampleConsumerComponent],
        imports: [MockModule(LogicRootModule)],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ExampleConsumerComponent);
          fixture.detectChanges();
        });
    }));

    it('should be able to find component', () => {
      expect(fixture.componentInstance).toEqual(jasmine.any(ExampleConsumerComponent));
    });
  });

  describe('2nd test for nested', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ExampleConsumerComponent],
        imports: [MockModule(LogicNestedModule)],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ExampleConsumerComponent);
          fixture.detectChanges();
        });
    }));

    it('should be able to find component', () => {
      expect(fixture.componentInstance).toEqual(jasmine.any(ExampleConsumerComponent));
    });
  });
});

describe('WithServiceModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomWithServiceComponent],
      imports: [MockModule(WithServiceModule)],
    });
  }));

  it('should not throw an error of service method', () => {
    const fixture = MockRender('<custom-service></custom-service>');
    expect(fixture).toBeDefined();
  });
});

describe('mockProvider', () => {
  const CUSTOM_TOKEN = new InjectionToken('TOKEN');

  @NgModule({
    providers: [
      {
        multi: true,
        provide: HTTP_INTERCEPTORS,
        useValue: 'MY_CUSTOM_VALUE',
      },
      {
        provide: CUSTOM_TOKEN,
        useValue: 'MY_CUSTOM_VALUE',
      },
    ],
  })
  class CustomTokenModule {}

  it('should skip multi tokens in a mock module', () => {
    const mock = MockModule(CustomTokenModule);
    const def = ngModuleResolver.resolve(mock);
    expect(def.providers).toEqual([
      {
        provide: CUSTOM_TOKEN,
        useValue: '',
      },
    ]);
  });

  it('should return undefined on any token', () => {
    expect(mockProvider(CUSTOM_TOKEN)).toBeUndefined();
    expect(mockProvider(HTTP_INTERCEPTORS)).toBeUndefined();
    expect(mockProvider(APP_INITIALIZER)).toBeUndefined();
  });

  it('should return default value on primitives', () => {
    expect(mockProvider({ provide: CUSTOM_TOKEN, useValue: undefined })).toEqual({
      provide: CUSTOM_TOKEN,
      useValue: undefined,
    });
    expect(mockProvider({ provide: CUSTOM_TOKEN, useValue: 123 })).toEqual({
      provide: CUSTOM_TOKEN,
      useValue: 0,
    });
    expect(mockProvider({ provide: CUSTOM_TOKEN, useValue: true })).toEqual({
      provide: CUSTOM_TOKEN,
      useValue: false,
    });
    expect(mockProvider({ provide: CUSTOM_TOKEN, useValue: 'true' })).toEqual({
      provide: CUSTOM_TOKEN,
      useValue: '',
    });
    expect(mockProvider({ provide: CUSTOM_TOKEN, useValue: null })).toEqual({
      provide: CUSTOM_TOKEN,
      useValue: null,
    });
    const mock: FactoryProvider = mockProvider({
      provide: CUSTOM_TOKEN,
      useValue: {
        func: () => undefined,
        test: 123,
      },
    }) as any;
    expect(mock).toEqual({
      deps: [Injector],
      provide: CUSTOM_TOKEN,
      useFactory: jasmine.anything(),
    });
    expect(mock.useFactory(null)).toEqual({
      func: jasmine.anything(),
    });
  });
});

describe('MockModuleWithProviders', () => {
  const TARGET_TOKEN = new InjectionToken('TOKEN');

  @NgModule()
  class TargetModule {}

  it('returns the same object on zero change', () => {
    const def = {
      ngModule: TargetModule,
      providers: [
        {
          provide: TARGET_TOKEN,
          useValue: 1,
        },
      ],
    };

    ngMocksUniverse.flags.add('skipMock');
    const actual = MockModule(def);
    ngMocksUniverse.flags.delete('skipMock');
    expect(actual).toBe(def);
  });

  it('returns a mock ngModule with undefined providers', () => {
    const def = {
      ngModule: TargetModule,
    };

    const actual = MockModule(def);
    expect(actual.ngModule).toBeDefined();
  });
});
