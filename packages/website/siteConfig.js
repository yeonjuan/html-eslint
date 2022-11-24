/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.
const siteConfig = {
  title: "HTML ESLint",
  tagline: "ESLint plugin for HTML",
  url: "https://yeonjuan.github.io",
  baseUrl: "/html-eslint/",
  projectName: "html-eslint",
  organizationName: "yeonjuan",
  headerLinks: [
    { label: "Docs", doc: "getting-started" },
    {
      href: "https://github.com/yeonjuan/html-eslint",
      label: "GitHub",
      external: true,
    },
    { label: "PlayGround", page: "playground" },
  ],
  headerIcon: "img/symbol.svg",
  footerIcon: "img/symbol.svg",
  favicon: "img/favicon.png",
  colors: {
    primaryColor: "#202020",
    secondaryColor: "#404040",
  },
  copyright: `Built with Docusaurus`,
  highlight: {
    theme: "default",
  },
  scripts: ["https://buttons.github.io/buttons.js"],
  onPageNav: "separate",
  cleanUrl: true,
  ogImage: "img/textlogo.svg",
  twitterImage: "img/textlogo.svg",
  repoUrl: "https://github.com/yeonjuan/html-eslint",
};

module.exports = siteConfig;
