// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Thaumiel Map Editor',
  tagline: 'Documentation for the Thaumiel Map Editor plugin',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Your Cloudflare Pages URL — change this once deployed
  url: 'https://thaumielmapeditordocs.thaumiel-servers.workers.dev/',
  baseUrl: '/',

  organizationName: 'Mr-Baguetter',   // your GitHub username
  projectName: 'ThaumielMapEditorDocs',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',   // serve docs at the root instead of /docs/
        },
        blog: false,            // disable the blog entirely
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Thaumiel Map Editor',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'API Docs',
          },
          {
            href: 'https://github.com/Mr-Baguetter/ThaumielMapEditorDocs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'API Reference',
                to: '/',
              },
            ],
          },
          {
            title: 'Links',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Mr-Baguetter/ThaumielMapEditorDocs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Thaumiel Map Editor. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['csharp'],
      },
    }),
};

export default config;