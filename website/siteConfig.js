/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.
const siteConfig = {
  title: 'HTML ESLint',
  tagline: 'ESLint plugin for HTML',
  url: 'https://yeonjuan.github.io',
  baseUrl: '/html-eslint/',
  projectName: 'html-eslint',
  organizationName: 'yeonjuan',
  headerLinks: [
    {label: 'Docs', doc: 'getting-started'},
    {
      href: 'https://github.com/yeonjuan/html-eslint',
      label: 'GitHub',
      external: true,
    }
  ],
  headerIcon: 'img/favicon.ico',
  footerIcon: 'img/favicon.ico',
  favicon: 'img/favicon.ico',
  colors: {
    primaryColor: '#692d6d',
    secondaryColor: '#491f4c',
  },
  copyright: `Built with Docusaurus`,
  highlight: {
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  onPageNav: 'separate',
  cleanUrl: true,
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',
  repoUrl: 'https://github.com/yeonjuan/html-eslint',
};

module.exports = siteConfig;
