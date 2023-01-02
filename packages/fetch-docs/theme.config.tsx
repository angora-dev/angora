import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>🔥 Angora Fetch</span>,
  project: {
    link: 'https://github.com/angora-dev/angora/tree/main/packages/fetch',
  },
  docsRepositoryBase: 'https://github.com/angora-dev/angora/tree/main/packages/fetch-docs',
  footer: {
    text: <p className="text-xs">MIT {new Date().getFullYear()} &copy; The Angora Project.</p>,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s | Angora Fetch',
    };
  },
};

export default config;
