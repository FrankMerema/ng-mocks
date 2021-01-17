---
title: ngMocks.globalMock
description: Documentation about ngMocks.globalMock from ng-mocks library
---

`ngMocks.globalMock` marks declarations, services and tokens to be mocked if they appear in kept modules during creating mock modules.

The best place to do that is in `src/test.ts` for `jasmine` or in `src/setupJest.ts` for `jest`.

Let's mark the `APP_URL` token in order to be mocked in its kept modules.

```ts
// test.ts
ngMocks.globalKeep(AppModule);
ngMocks.globalMock(APP_URL);
ngMocks.defaultMock(APP_URL, () => 'mock');
```

```ts
// test.spec.ts
// ...
MockModule(AppModule);
// ...
const url = TestBed.inject(APP_URL);
// ...
```

The `url` is `mock`.
