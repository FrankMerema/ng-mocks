module.exports = {
  title: 'ng-mocks',
  tagline:
    'An Angular testing library for creating mock services, components, directives, pipes and modules in unit tests, which includes shallow rendering, precise stubs to dump child dependencies, supports Angular 5 6 7 8 9 10 11, jasmine and jest.',
  url: 'https://ng-mocks.sudo.eu',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'throw',
  baseUrlIssueBanner: false,
  favicon: 'img/favicon.ico',
  organizationName: 'ike18t',
  projectName: 'ng-mocks',
  themeConfig: {
    hideableSidebar: true,
    gtag: {
      trackingID: 'G-EBEPX2CVNW',
    },
    announcementBar: {
      id: 'give-a-start',
      content:
        'If you like ng-mocks, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/ike18t/ng-mocks">GitHub</a>!️',
    },
    navbar: {
      title: 'ng-mocks',
      items: [
        {
          to: '/guides',
          label: 'Test examples',
          position: 'left',
        },
        {
          label: 'Try on StackBlitz',
          href: 'https://stackblitz.com/github/ng-mocks/examples?file=src/test.spec.ts',
          position: 'left',
        },
        {
          to: 'https://codesandbox.io/s/github/ng-mocks/examples?file=/src/test.spec.ts',
          label: 'Try on CodeSandbox',
          position: 'left',
        },
        {
          label: 'Run tests on CI',
          href: 'https://satantime.github.io/puppeteer-node/',
        },
        {
          href: 'https://github.com/ike18t/ng-mocks',
          label: 'GitHub repo',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/ng-mocks',
          label: 'NPM package',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Content',
          items: [
            {
              label: 'Documentation',
              to: '/',
            },
            {
              label: 'Test examples',
              to: '/guides',
            },
            {
              href: 'https://stackblitz.com/github/ng-mocks/examples?file=src/test.spec.ts',
              label: 'Try on StackBlitz',
            },
            {
              label: 'Try on CodeSandbox',
              to: 'https://codesandbox.io/s/github/ng-mocks/examples?file=/src/test.spec.ts',
            },
            {
              label: 'Execute tests on CI',
              href: 'https://satantime.github.io/puppeteer-node/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Chat on gitter',
              href: 'https://gitter.im/ng-mocks/community',
            },
            {
              label: 'Ask a question on Stackoverflow',
              href: 'https://stackoverflow.com/questions/ask?tags=ng-mocks%20angular%20testing%20mocking',
            },
            {
              label: 'Report an issue on GitHub',
              href: 'https://github.com/ike18t/ng-mocks/issues/new',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              href: 'https://github.com/ike18t/ng-mocks',
              label: 'GitHub repo',
            },
            {
              href: 'https://www.npmjs.com/package/ng-mocks',
              label: 'NPM package',
            },
          ],
        },
      ],
      copyright: `Copyright &copy; ${new Date().getFullYear()}. Built with Docusaurus.`,
    },
  },
  themes: [
    [
      '@docusaurus/theme-classic',
      {
        customCss: require.resolve('./src/css/custom.css'),
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        path: 'articles',
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        editUrl: 'https://github.com/ike18t/ng-mocks/tree/master/docs/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
      },
    ],
    '@docusaurus/plugin-sitemap',
    '@docusaurus/plugin-google-gtag',
  ],
};
