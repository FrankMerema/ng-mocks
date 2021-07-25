import coreConfig from '../common/core.config';
import ngMocksUniverse from '../common/ng-mocks-universe';

import mockHelperCrawl from './crawl/mock-helper.crawl';
import mockHelperReveal from './crawl/mock-helper.reveal';
import mockHelperRevealAll from './crawl/mock-helper.reveal-all';
import mockHelperChange from './cva/mock-helper.change';
import mockHelperTouch from './cva/mock-helper.touch';
import mockHelperClick from './events/mock-helper.click';
import mockHelperEvent from './events/mock-helper.event';
import mockHelperTrigger from './events/mock-helper.trigger';
import mockHelperFindInstance from './find-instance/mock-helper.find-instance';
import mockHelperFindInstances from './find-instance/mock-helper.find-instances';
import mockHelperFind from './find/mock-helper.find';
import mockHelperFindAll from './find/mock-helper.find-all';
import mockHelperFormatHtml from './format/mock-helper.format-html';
import mockHelperFormatText from './format/mock-helper.format-text';
import mockHelperAutoSpy from './mock-helper.auto-spy';
import mockHelperDefaultMock from './mock-helper.default-mock';
import mockHelperFaster from './mock-helper.faster';
import mockHelperFlushTestBed from './mock-helper.flush-test-bed';
import mockHelperGet from './mock-helper.get';
import mockHelperGlobalExclude from './mock-helper.global-exclude';
import mockHelperGlobalKeep from './mock-helper.global-keep';
import mockHelperGlobalMock from './mock-helper.global-mock';
import mockHelperGlobalReplace from './mock-helper.global-replace';
import mockHelperGlobalWipe from './mock-helper.global-wipe';
import mockHelperGuts from './mock-helper.guts';
import mockHelperIgnoreOnConsole from './mock-helper.ignore-on-console';
import mockHelperInput from './mock-helper.input';
import mockHelperOutput from './mock-helper.output';
import mockHelperReset from './mock-helper.reset';
import mockHelperStub from './mock-helper.stub';
import mockHelperStubMember from './mock-helper.stub-member';
import mockHelperThrowOnConsole from './mock-helper.throw-on-console';
import mockHelperHide from './render/mock-helper.hide';
import mockHelperRender from './render/mock-helper.render';
import mockHelperFindTemplateRef from './template-ref/mock-helper.find-template-ref';
import mockHelperFindTemplateRefs from './template-ref/mock-helper.find-template-refs';

export default {
  autoSpy: mockHelperAutoSpy,
  change: mockHelperChange,
  click: mockHelperClick,
  config: (config: {
    mockRenderCacheSize?: number | null;
    onMockInstanceRestoreNeed?: 'throw' | 'warn' | 'i-know-but-disable' | null;
    onTestBedFlushNeed?: 'throw' | 'warn' | 'i-know-but-disable' | null;
  }) => {
    const flags = ngMocksUniverse.global.get('flags');
    for (const flag of ['onTestBedFlushNeed', 'onMockInstanceRestoreNeed'] as const) {
      if (config[flag] === null) {
        flags[flag] = coreConfig[flag];
      } else if (config[flag] !== undefined) {
        flags[flag] = config[flag];
      }
    }
    if (config.mockRenderCacheSize === null) {
      ngMocksUniverse.global.delete('mockRenderCacheSize');
    } else if (config.mockRenderCacheSize !== undefined) {
      ngMocksUniverse.global.set('mockRenderCacheSize', config.mockRenderCacheSize);
    }
  },
  crawl: mockHelperCrawl,
  defaultMock: mockHelperDefaultMock,
  event: mockHelperEvent,
  faster: mockHelperFaster,
  find: mockHelperFind,
  findAll: mockHelperFindAll,
  findInstance: mockHelperFindInstance,
  findInstances: mockHelperFindInstances,
  findTemplateRef: mockHelperFindTemplateRef,
  findTemplateRefs: mockHelperFindTemplateRefs,
  flushTestBed: mockHelperFlushTestBed,
  formatHtml: mockHelperFormatHtml,
  formatText: mockHelperFormatText,
  get: mockHelperGet,
  globalExclude: mockHelperGlobalExclude,
  globalKeep: mockHelperGlobalKeep,
  globalMock: mockHelperGlobalMock,
  globalReplace: mockHelperGlobalReplace,
  globalWipe: mockHelperGlobalWipe,
  guts: mockHelperGuts,
  hide: mockHelperHide,
  ignoreOnConsole: mockHelperIgnoreOnConsole,
  input: mockHelperInput,
  output: mockHelperOutput,
  render: mockHelperRender,
  reset: mockHelperReset,
  reveal: mockHelperReveal,
  revealAll: mockHelperRevealAll,
  stub: mockHelperStub,
  stubMember: mockHelperStubMember,
  throwOnConsole: mockHelperThrowOnConsole,
  touch: mockHelperTouch,
  trigger: mockHelperTrigger,
};
