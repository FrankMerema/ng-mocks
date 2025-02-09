import {
  CdkFixedSizeVirtualScroll,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { Component, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  MockBuilder,
  MockModule,
  MockRender,
  ngMocks,
} from 'ng-mocks';

@Component({
  selector: 'dependency',
  standalone: false,
  template:
    '<cdk-virtual-scroll-viewport [itemSize]="15"></cdk-virtual-scroll-viewport>',
})
class DependencyComponent {
  public dependencyComponent4344() {}
}

@NgModule({
  imports: [ScrollingModule],
  declarations: [DependencyComponent],
  exports: [DependencyComponent, ScrollingModule],
})
class DependencyModule {}

@Component({
  selector: 'target',
  standalone: false,
  template:
    '<dependency></dependency><cdk-virtual-scroll-viewport [itemSize]="15"></cdk-virtual-scroll-viewport>',
})
class TargetComponent {
  public targetComponent4344() {}
}

@NgModule({
  imports: [DependencyModule],
  declarations: [TargetComponent],
  exports: [TargetComponent],
})
class TargetModule {}

// @see https://github.com/help-me-mom/ng-mocks/issues/4344
// Type CdkFixedSizeVirtualScroll is part of the declarations of 2 modules:
// MockOfScrollingModule and ScrollingModule!
// Please consider moving CdkFixedSizeVirtualScroll to a higher module
// that imports MockOfScrollingModule and ScrollingModule.
describe('issue-4344', () => {
  beforeAll(() => ngMocks.globalKeep(CdkFixedSizeVirtualScroll));
  afterAll(() => ngMocks.globalWipe(CdkFixedSizeVirtualScroll));

  describe('TestBed', () => {
    beforeEach(() =>
      TestBed.configureTestingModule({
        imports: [MockModule(DependencyModule), TargetModule],
      }).compileComponents(),
    );

    it('creates TargetComponent', () => {
      expect(() => MockRender(TargetComponent)).not.toThrow();
    });
  });

  describe('MockBuilder', () => {
    beforeEach(() => MockBuilder(TargetModule, DependencyModule));

    it('creates TargetComponent', () => {
      expect(() => MockRender(TargetComponent)).not.toThrow();
    });
  });
});
