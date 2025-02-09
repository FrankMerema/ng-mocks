import { Component, NgModule } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockBuilder, ngMocks } from 'ng-mocks';

@Component({
  selector: 'header',
  standalone: false,
  template: 'header',
})
class HeaderComponent {
  public headerComponentSpectator() {}
}

@Component({
  selector: 'target',
  standalone: false,
  template: '<header></header>',
})
class TargetComponent {
  public targetComponentSpectator() {}
}

@NgModule({
  declarations: [TargetComponent, HeaderComponent],
})
class TargetModule {}

describe('spectator:classic', () => {
  describe('TestBed', () => {
    let spectator: Spectator<TargetComponent>;

    const createComponent = createComponentFactory({
      component: TargetComponent,
      declarations: [HeaderComponent],
    });

    beforeEach(() => (spectator = createComponent()));

    it('keeps header', () => {
      expect(ngMocks.formatHtml(spectator.fixture)).toEqual(
        '<header>header</header>',
      );
    });
  });

  describe('ngMocks.guts', () => {
    let spectator: Spectator<TargetComponent>;

    const dependencies = ngMocks.guts(TargetComponent, TargetModule);
    const createComponent = createComponentFactory({
      component: TargetComponent,
      ...dependencies,
    });

    beforeEach(() => (spectator = createComponent()));

    it('mocks header', () => {
      expect(ngMocks.formatHtml(spectator.fixture)).toEqual(
        '<header></header>',
      );
    });
  });

  describe('MockBuilder', () => {
    let spectator: Spectator<TargetComponent>;

    const dependencies = MockBuilder(
      TargetComponent,
      TargetModule,
    ).build();
    const createComponent = createComponentFactory({
      component: TargetComponent,
      ...dependencies,
    });

    beforeEach(() => (spectator = createComponent()));

    it('mocks header', () => {
      expect(ngMocks.formatHtml(spectator.fixture)).toEqual(
        '<header></header>',
      );
    });
  });
});
