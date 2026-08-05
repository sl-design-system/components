# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: website/tests/website_a11y.spec.ts >> Limited to <main> test on other pages >> A11y test on categories/getting-started/developers/
- Location: website/tests/website_a11y.spec.ts:76:7

# Error details

```
Error: Accessibility violations found, see details above

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - menu "Main menu" [ref=e2]:
        - navigation [ref=e3]:
            - link "Go to homepage" [ref=e5] [cursor=pointer]:
                - /url: /
            - group [ref=e6]:
                - listitem [ref=e7]:
                    - menuitem "Getting Started" [ref=e8] [cursor=pointer]: Getting Started
                - group [ref=e10]:
                    - listitem [ref=e11]:
                        - menuitem "Designers" [ref=e12] [cursor=pointer]
                    - listitem [ref=e13]:
                        - menuitem "Developers" [ref=e14] [cursor=pointer]
                - listitem [ref=e15]:
                    - menuitem "What's new" [ref=e16] [cursor=pointer]
                - listitem [ref=e17]:
                    - menuitem "Guidelines" [ref=e18] [cursor=pointer]: Guidelines
                - listitem [ref=e20]:
                    - menuitem "Patterns" [ref=e21] [cursor=pointer]: Patterns
                - listitem [ref=e23]:
                    - menuitem "Design Tokens" [ref=e24] [cursor=pointer]: Design Tokens
                - listitem [ref=e26]:
                    - menuitem "Components" [ref=e27] [cursor=pointer]: Components
                - listitem [ref=e29]:
                    - menuitem "Utilities" [ref=e30] [cursor=pointer]: Utilities
        - link "Help and feedback" [ref=e32] [cursor=pointer]:
            - /url: https://sanoma.slack.com/archives/C03SA9HUUA3
    - main [ref=e33]:
        - generic [ref=e35]:
            - heading "Developers" [level=1] [ref=e36]
            - paragraph [ref=e37]: This guide will walk you through the process of gaining access to the private GitHub NPM repository, installing the SL Design System packages and using them in your application.
        - generic [ref=e38]:
            - generic [ref=e39]:
                - generic [ref=e40]:
                    - heading "Steps" [level=2] [ref=e41]:
                        - link "Steps" [ref=e42] [cursor=pointer]:
                            - /url: '#steps'
                    - paragraph [ref=e43]: 'Please follow the steps below when first getting started:'
                    - list [ref=e44]:
                        - listitem [ref=e45]:
                            - link "Make sure you have access" [ref=e46] [cursor=pointer]:
                                - /url: '#make-sure-you-have-access'
                        - listitem [ref=e47]:
                            - link "Installing the SL Design System package(s)" [ref=e48] [cursor=pointer]:
                                - /url: '#installing-the-sl-design-system-package(s)'
                        - listitem [ref=e49]:
                            - link "Setup a theme" [ref=e50] [cursor=pointer]:
                                - /url: '#setup-a-theme'
                        - listitem [ref=e51]:
                            - link "Add polyfills" [ref=e52] [cursor=pointer]:
                                - /url: '#add-polyfills'
                        - listitem [ref=e53]:
                            - link "Start using components" [ref=e54] [cursor=pointer]:
                                - /url: '#start-using-components'
                - generic [ref=e55]:
                    - heading "Make sure you have access" [level=2] [ref=e56]:
                        - link "Make sure you have access" [ref=e57] [cursor=pointer]:
                            - /url: '#make-sure-you-have-access'
                    - paragraph [ref=e58]: Even though the SL Design System is open source, the packages are not publicly available. That is why you need to get access to the npm packages in order to install them locally. For use in a Sanoma Learning product it is possible to load the SLDS packages (and Font Awesome), via the company provided Nexus server. If you don't have access to that it is also possible to access the packages via GitHub.
                    - heading "Nexus" [level=3] [ref=e59]:
                        - link "Nexus" [ref=e60] [cursor=pointer]:
                            - /url: '#nexus'
                    - paragraph [ref=e61]: A lot of products are getting their packages from nexus already, so you can check your team's documentation for the url and how to set up access. For technical questions about access to nexus you can contact TechOps. If you have access to the correct server but encounter a problem specific to the Design System packages you can contact us of course.
                    - heading "GitHub" [level=3] [ref=e62]:
                        - link "GitHub" [ref=e63] [cursor=pointer]:
                            - /url: '#github'
                    - paragraph [ref=e64]:
                        - text: First the SL Design System team needs to add you to the list of users who can access the packages. To be added, you need to provide your @sanoma.com (or other company) email address to us in
                        - link "our Slack channel" [ref=e65] [cursor=pointer]:
                            - /url: https://sanoma.slack.com/archives/C03SA9HUUA3
                        - text: or you can
                        - link "send us an email" [ref=e66] [cursor=pointer]:
                            - /url: mailto:designsystem@sanoma.com
                        - text: . Please mention which product you are working on so we can put you in the right team. For our admin it's also really helpful if you have a recognizable username, or use your actual name, so we can trace an account back to you if we ever need to contact you. You don't have to create a new, separate GitHub account with your Sanoma Learning email address if you have an existing GitHub account and want to use that. Just add your @sanoma.com email address to the list of email addresses in GitHub.
                    - paragraph [ref=e67]:
                        - text: Once you are added you need to
                        - link "create a classic personal access token on GitHub" [ref=e68] [cursor=pointer]:
                            - /url: https://docs.GitHub.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic
                            - text: create a
                            - emphasis [ref=e69]: classic
                            - text: personal access token on GitHub
                        - text: . Make sure that this token has at least the
                        - code [ref=e70]: read_packages
                        - text: privilege. This newly created token needs to be added to the
                        - code [ref=e71]: .npmrc
                        - text: file in your home directory, along with a reference to where the
                        - code [ref=e72]: '@sl-design-system'
                        - text: 'packages can be found:'
                    - generic [ref=e73]:
                        - code [ref=e75]: //npm.pkg.github.com/:_authToken=<token you just generated> @sl-design-system:registry=https://npm.pkg.github.com
                        - button "Copy the code" [ref=e77] [cursor=pointer]:
                            - generic:
                                - generic:
                                    - img
                    - paragraph [ref=e78]:
                        - text: Make sure you add the token to
                        - code [ref=e79]: ~/.npmrc
                        - text: ", the file in your home directory, not in a project folder. That way you don't run the risk of accidentally committing and pushing your secret token."
                - generic [ref=e80]:
                    - heading "Installing the SL Design System package(s)" [level=2] [ref=e81]:
                        - link "Installing the SL Design System package(s)" [ref=e82] [cursor=pointer]:
                            - /url: '#installing-the-sl-design-system-package(s)'
                    - paragraph [ref=e83]: To get started using the SL Design System, you can install it via npm. Each component and theme has its own package.
                    - paragraph [ref=e84]:
                        - text: Some packages have 3rd party dependencies that need to be installed as well. Some of these dependencies may already be used in your own application. To make sure that those dependencies are not installed twice, they are marked as
                        - code [ref=e85]: peerDependencies
                        - text: in the
                        - code [ref=e86]: package.json
                        - text: of the SLDS packages. This means that you need to install them yourself. For example, the
                        - code [ref=e87]: '@sl-design-system/badge'
                        - text: package has
                        - code [ref=e88]: lit
                        - text: as a peer dependency. If you are using
                        - code [ref=e89]: lit
                        - text: in your application, you don't need to install it again. If you are not using
                        - code [ref=e90]: lit
                        - text: yet, you need to install it. Your package manager will warn you if you haven't installed these peer dependencies yet.
                    - paragraph [ref=e91]:
                        - text: So if you want to use a
                        - code [ref=e92]: button
                        - text: 'component with the Sanoma Learning theme, you do:'
                    - generic [ref=e93]:
                        - code [ref=e95]: npm add @sl-design-system/button
                        - button "Copy the code" [ref=e97] [cursor=pointer]:
                            - generic:
                                - generic:
                                    - img
                    - paragraph [ref=e98]:
                        - text: Or if you use
                        - code [ref=e99]: yarn
                        - text: ':'
                    - generic [ref=e100]:
                        - code [ref=e102]: yarn add @sl-design-system/button
                        - button "Copy the code" [ref=e104] [cursor=pointer]:
                            - generic:
                                - generic:
                                    - img
                - generic [ref=e105]:
                    - heading "Setup a theme" [level=2] [ref=e106]:
                        - link "Setup a theme" [ref=e107] [cursor=pointer]:
                            - /url: '#setup-a-theme'
                    - paragraph [ref=e108]: To start using the SL Design System, you need to setup a theme for your application. The theme determines how your application looks. There is a theme for every major product within Sanoma Learning.
                    - paragraph [ref=e109]: Please note that the (web)fonts of your application are not a part of the theme. There are different ways of loading the fonts an application uses. If is up to you to load the (web)fonts in your application.
                    - paragraph [ref=e110]:
                        - text: You can install a theme as by installing the NPM package, in this example we use the
                        - code [ref=e111]: sanoma-learning
                        - text: theme.
                    - generic [ref=e112]:
                        - code [ref=e114]: npm add @sl-design-system/sanoma-learning
                        - button "Copy the code" [ref=e116] [cursor=pointer]:
                            - generic:
                                - generic:
                                    - img
                    - paragraph [ref=e117]:
                        - text: Or if you use
                        - code [ref=e118]: yarn
                        - text: ':'
                    - generic [ref=e119]:
                        - code [ref=e121]: yarn add @sl-design-system/sanoma-learning
                        - button "Copy the code" [ref=e123] [cursor=pointer]:
                            - generic:
                                - generic:
                                    - img
                    - paragraph [ref=e124]: After installing the theme, you need to import the theme in your application. How you do this depends on the framework you are using.
                    - paragraph [ref=e125]: 'The simplest way to include the theme is by including the theme stylesheet in your HTML:'
                    - generic [ref=e126]:
                        - code [ref=e128]:
                            - generic [ref=e129]:
                                - generic [ref=e130]: <link
                                - text: href
                                - generic [ref=e131]: ="./node_modules/@sl-design-system/sanoma-learning/theme.css"
                                - text: rel
                                - generic [ref=e132]: ="stylesheet"
                                - text: '>'
                        - button "Copy the code" [ref=e134] [cursor=pointer]:
                            - generic:
                                - generic:
                                    - img
                    - paragraph [ref=e135]: 'The theme packages also support package exports, meaning you can import the stylesheet directly from the package (if your build system supports it):'
                    - code [ref=e137]: "@import '@sl-design-system/sanoma-learning/theme.css';"
                    - paragraph [ref=e138]:
                        - text: If your theme has a dark mode version both the tokens for light and dark mode are in this file. You can switch the mode based on the user preference (this is by default). Or you can set
                        - code [ref=e139]: 'style="--color-scheme: light;"'
                        - text: or
                        - code [ref=e140]: 'style="--color-scheme: dark;"'
                        - text: on the HTML tag of your page to force a certain color mode.
                    - paragraph [ref=e141]:
                        - text: If you are working in an Angular application you can do this by adding the theme stylesheet in your
                        - code [ref=e142]: angular.json
                        - text: ', as explained'
                        - link "in the official Angular documentation" [ref=e143] [cursor=pointer]:
                            - /url: https://angular.io/guide/workspace-config#styles-and-scripts-configuration
                        - text: .
                    - paragraph [ref=e144]:
                        - text: To initialize the theme you need to run theme's
                        - code [ref=e145]: setup
                        - text: 'function in a global JS file:'
                    - generic [ref=e146]:
                        - code [ref=e148]: "import { setup } from '@sl-design-system/sanoma-learning'; setup();"
                        - button "Copy the code" [ref=e150] [cursor=pointer]:
                            - generic:
                                - generic:
                                    - img
                    - paragraph [ref=e151]:
                        - text: When you're using Angular this can be done in
                        - code [ref=e152]: main.ts
                        - text: in the root folder of your application for example.
                    - heading "Deprecated tokens" [level=3] [ref=e153]:
                        - link "Deprecated tokens" [ref=e154] [cursor=pointer]:
                            - /url: '#deprecated-tokens'
                    - paragraph [ref=e155]: Sometimes new insights or techniques cause us to no longer use a certain token. To keep things clean and maintainable we will remove this after a deprecation period of at least a year. The latest version of a component is, at the time of release, always compatible with the (at that time) latest version of a theme.
                    - paragraph [ref=e156]:
                        - text: If one of the tokens we deprecated is still being used, either directly in your application or in a component you cannot update yet, you can find the deprecated tokens in separate files;
                        - code [ref=e157]: light-deprecated.css
                        - text: and
                        - code [ref=e158]: dark-deprecated.css
                        - text: (or
                        - code [ref=e159]: '*.scss'
                        - text: ). You can include these in the same places and way as the original (s)css files.
                - generic [ref=e160]:
                    - heading "Add polyfills" [level=2] [ref=e161]:
                        - link "Add polyfills" [ref=e162] [cursor=pointer]:
                            - /url: '#add-polyfills'
                    - paragraph [ref=e163]: The SL Design System tries to use modern web standards as much as possible. This means that some of the components might not work in older browsers. To make sure the components work in older browsers you need to add polyfills.
                    - paragraph [ref=e164]: Make sure you include the polyfills before you include the SLDS components. This is because the polyfills need to be loaded before the components are loaded.
                    - paragraph [ref=e165]: 'The following web standards require polyfills at this time:'
                    - list [ref=e166]:
                        - listitem [ref=e167]:
                            - link "Scoped Custom Element Registry" [ref=e168] [cursor=pointer]:
                                - /url: https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md
                        - listitem [ref=e169]:
                            - link "Invoker Commands API" [ref=e170] [cursor=pointer]:
                                - /url: https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
                    - paragraph [ref=e171]: 'To use these polyfills, you need to install the following packages:'
                    - list [ref=e172]:
                        - listitem [ref=e173]:
                            - code [ref=e174]: '@webcomponents/scoped-custom-element-registry'
                        - listitem [ref=e175]:
                            - code [ref=e176]: invokers-polyfill
                            - text: (version >= 1.0.2, earlier versions do not work properly with custom elements)
                    - paragraph [ref=e177]: 'Once installed you need to import the polyfills in your application. You can do this by importing the polyfills in your main JS file:'
                    - code [ref=e179]: import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js'; import 'invokers-polyfill';
                    - paragraph [ref=e180]: 'Another option is to include them in your HTML:'
                    - code [ref=e182]:
                        - generic [ref=e183]:
                            - generic [ref=e184]: <script
                            - text: src
                            - generic [ref=e185]: ="./node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"
                            - text: '>'
                        - generic [ref=e186]:
                            - generic [ref=e187]: </script
                            - text: '>'
                        - generic [ref=e188]:
                            - generic [ref=e189]: <script
                            - text: src
                            - generic [ref=e190]: ="./node_modules/invokers-polyfill/invokers-polyfill.min.js"
                            - text: '>'
                        - generic [ref=e191]:
                            - generic [ref=e192]: </script
                            - text: '>'
                    - heading "No longer needed" [level=3] [ref=e193]:
                        - link "No longer needed" [ref=e194] [cursor=pointer]:
                            - /url: '#no-longer-needed'
                    - paragraph [ref=e195]: 'The following polyfills were previously required but are no longer needed since all major browsers now support these features:'
                    - list [ref=e196]:
                        - listitem [ref=e197]:
                            - link "Element Internals" [ref=e198] [cursor=pointer]:
                                - /url: https://caniuse.com/mdn-api_elementinternals
                - generic [ref=e199]:
                    - heading "Start using components" [level=2] [ref=e200]:
                        - link "Start using components" [ref=e201] [cursor=pointer]:
                            - /url: '#start-using-components'
                    - paragraph [ref=e202]: 'To start using the button in our example, you need to import the button component in your application. You can do this by importing the button component in your main JS file:'
                    - code [ref=e204]: import '@sl-design-system/button/register.js';
                    - paragraph [ref=e205]:
                        - text: This will load the button component and register it as
                        - code [ref=e206]: <sl-button>
                        - text: '. After that you can start using the button in your application:'
                    - code [ref=e208]:
                        - generic [ref=e209]:
                            - generic [ref=e210]: <sl-button
                            - text: '>'
                        - text: Hello world!
                        - generic [ref=e211]:
                            - generic [ref=e212]: </sl-button
                            - text: '>'
                    - paragraph [ref=e213]:
                        - text: If you encounter errors compiling because Angular doesn't recognize the SLDS components as valid tags you can add
                        - code [ref=e214]: CUSTOM_ELEMENTS_SCHEMA
                        - text: . We are still thinking about a solution to wrap our components with an Angular shell so this step is no longer necessary.
                - generic [ref=e215]:
                    - heading "Example project" [level=2] [ref=e216]:
                        - link "Example project" [ref=e217] [cursor=pointer]:
                            - /url: '#example-project'
                    - paragraph [ref=e218]: To serve as an inspiration (or just something to copy-paste from) we've made some example projects that uses several Design System components so you can study how they interact or have something to compare your code to if something doesn't work as expected.
                    - paragraph [ref=e219]:
                        - text: You can find the
                        - link "Angular example project repository on GitHub" [ref=e220] [cursor=pointer]:
                            - /url: https://GitHub.com/sl-design-system/angular-demo
                    - paragraph [ref=e221]:
                        - text: You can find the
                        - link "Lit example project repository on GitHub" [ref=e222] [cursor=pointer]:
                            - /url: https://GitHub.com/sl-design-system/example-design-system-lit-app
                - generic [ref=e223]:
                    - heading "Troubleshooting and FAQ" [level=2] [ref=e224]:
                        - link "Troubleshooting and FAQ" [ref=e225] [cursor=pointer]:
                            - /url: '#troubleshooting-and-faq'
                    - heading "The font in the components doesn't match the rest of my application." [level=3] [ref=e226]:
                        - link "The font in the components doesn't match the rest of my application." [ref=e227] [cursor=pointer]:
                            - /url: '#the-font-in-the-components-doesnt-match-the-rest-of-my-application.'
                    - paragraph [ref=e228]: Make sure the font you use in the application has the exact same name as the font used in the theme tokens. We took a survey on which themes use which font, so in theory it should work out of the box. If that is not the case change the name of your font family name in your app. Because the font name in the token needs to match the name of the font used in Figma we are a little less flexible. If the names match but the font still doesn't load check if the font is actually loaded. The components use the font available in the app, so if you need to add fonts do this like you normally would. When you still encounter problems with the loading and using of your fonts you can reach out to us.
                    - heading "The icons in my components are broken." [level=3] [ref=e229]:
                        - link "The icons in my components are broken." [ref=e230] [cursor=pointer]:
                            - /url: '#the-icons-in-my-components-are-broken.'
                    - paragraph [ref=e231]:
                        - text: Please make sure you have added the
                        - code [ref=e232]: setup()
                        - text: method as described in the
                        - link "Setup a theme" [ref=e233] [cursor=pointer]:
                            - /url: '#setup-a-theme'
                        - text: section. This method also initializes the icon set.
                    - heading "How do I use the dark mode of the theme?" [level=3] [ref=e234]:
                        - link "How do I use the dark mode of the theme?" [ref=e235] [cursor=pointer]:
                            - /url: '#how-do-i-use-the-dark-mode-of-the-theme'
                    - paragraph [ref=e236]:
                        - text: This only applies to themes that support dark mode. When you include the
                        - code [ref=e237]: all.css
                        - text: file both light and dark mode are included and triggered by the system or browser preference (using
                        - code [ref=e238]: '@media (prefers-color-scheme: dark)'
                        - text: ). If you want to control the use of the light and dark mode you can load the
                        - code [ref=e239]: light.css
                        - text: and
                        - code [ref=e240]: dark.css
                        - text: based on the condition you want. Don't forget to also include
                        - code [ref=e241]: base.css
                        - text: in addition to the light and dark file. You won't need
                        - code [ref=e242]: all.css
                        - text: when using the separate files.
                    - paragraph [ref=e243]:
                        - text: 'Another option is not to directly include the css files, but use the SCSS mixins we provide:'
                        - code [ref=e244]: '@mixin sl-theme-base'
                        - text: ','
                        - code [ref=e245]: '@mixin sl-theme-light'
                        - text: and
                        - code [ref=e246]: '@mixin sl-theme-dark'
                        - text: in their respective
                        - code [ref=e247]: .scss
                        - text: files in the theme. Those mixins print the list of tokens so you can wrap the tokens with whatever selector you want to achieve the theme switching.
                    - heading "How do I setup my Bitbucket pipeline to work with the SLDS packages?" [level=3] [ref=e248]:
                        - link "How do I setup my Bitbucket pipeline to work with the SLDS packages?" [ref=e249] [cursor=pointer]:
                            - /url: '#how-do-i-setup-my-bitbucket-pipeline-to-work-with-the-slds-packages'
                    - paragraph [ref=e250]:
                        - text: For the Sanoma Learning Bitbucket pipelines, there is a common token that you can use to authenticate with the GitHub NPM registry. For your projects'
                        - code [ref=e251]: .npmrc
                        - text: 'you can use the following line to authenticate with the GitHub NPM registry:'
                    - code [ref=e253]: '//npm.pkg.github.com/:_authToken=${SLDESIGNSYSTEMS_GITHUB_NPM_AUTH_TOKEN}'
                    - heading "Which browsers are supported?" [level=3] [ref=e254]:
                        - link "Which browsers are supported?" [ref=e255] [cursor=pointer]:
                            - /url: '#which-browsers-are-supported'
                    - paragraph [ref=e256]: We support the 2 latest versions of the major browsers Chrome, Edge, Firefox and Safari. For example if the latest version is Chrome 100, we support Chrome 100 and 99.
                    - heading "Which versions of Angular are supported?" [level=3] [ref=e257]:
                        - link "Which versions of Angular are supported?" [ref=e258] [cursor=pointer]:
                            - /url: '#which-versions-of-angular-are-supported'
                    - paragraph [ref=e259]:
                        - text: We support the 2 latest versions of Angular. You can find these version in
                        - link "the documentation on Angular.io" [ref=e260] [cursor=pointer]:
                            - /url: https://angular.io/guide/releases#actively-supported-versions
                        - text: .
                    - heading "Do you support SSR?" [level=3] [ref=e261]:
                        - link "Do you support SSR?" [ref=e262] [cursor=pointer]:
                            - /url: '#do-you-support-ssr'
                    - paragraph [ref=e263]: Server-side rendered web components is a hard problem and the web standards related to this continue to evolve. At the moment we do not support this, but we may look at this again in the future.
            - navigation "Contents" [ref=e267]:
                - text: CONTENTS
                - link "Steps" [ref=e268] [cursor=pointer]:
                    - /url: '#steps'
                - link "Make sure you have access" [ref=e269] [cursor=pointer]:
                    - /url: '#make-sure-you-have-access'
                - link "Installing the SL Design System package(s)" [ref=e270] [cursor=pointer]:
                    - /url: '#installing-the-sl-design-system-package(s)'
                - link "Setup a theme" [ref=e271] [cursor=pointer]:
                    - /url: '#setup-a-theme'
                - link "Add polyfills" [ref=e272] [cursor=pointer]:
                    - /url: '#add-polyfills'
                - link "Start using components" [ref=e273] [cursor=pointer]:
                    - /url: '#start-using-components'
                - link "Example project" [ref=e274] [cursor=pointer]:
                    - /url: '#example-project'
                - link "Troubleshooting and FAQ" [ref=e275] [cursor=pointer]:
                    - /url: '#troubleshooting-and-faq'
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | import { AxeResults } from 'axe-core';
  4  | import { createHtmlReport } from 'axe-html-reporter';
  5  | import { readFileSync } from 'node:fs';
  6  |
  7  | let axe: AxeBuilder;
  8  | let results: AxeResults;
  9  | const homePageUrl = '/';
  10 | const domainName = 'http://localhost:8000/';
  11 |
  12 | function getArgumentValue(name: string): string | undefined {
  13 |   const arg = process.argv.find(arg => arg.startsWith(`--${name}=`));
  14 |   return arg ? arg.split('=')[1] : undefined;
  15 | }
  16 |
  17 | const cliUrl = getArgumentValue('url');
  18 | let urls: string[];
  19 |
  20 | if (cliUrl) {
  21 |   urls = cliUrl.split(',');
  22 | } else {
  23 |   urls = JSON.parse(readFileSync(new URL('../../changed-urls.json', import.meta.url), 'utf-8')) as string[];
  24 | }
  25 |
  26 | function createNumberedList<T>(items: T[]): string {
  27 |   return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  28 | }
  29 |
  30 | test.beforeEach(async ({ page }) => {
  31 |   axe = new AxeBuilder({ page });
  32 | });
  33 |
  34 | test.afterEach(async ({ page }) => {
  35 |   if (!results || !results.violations) {
  36 |     return;
  37 |   }
  38 |
  39 |   if (results.violations.length > 0) {
  40 |     const violationDetails = results.violations
  41 |       .map(violation => {
  42 |         const nodeDetails = createNumberedList(violation.nodes.flatMap(node => node.target));
  43 |         return `${violation.id} (${violation.impact}) \n${violation.description}\n${nodeDetails} \n`;
  44 |       })
  45 |       .join('\n\n');
  46 |     console.error(`Accessibility violations found for ${page.url()}:\n\n${violationDetails}`);
  47 |
  48 |     createHtmlReport({
  49 |       results: {
  50 |         violations: results.violations
  51 |       },
  52 |       options: {
  53 |         outputDir: 'reports/website',
  54 |         reportFileName: `${page.url().replace(domainName, '').replaceAll('/', '_')}a11y_report.html`
  55 |       }
  56 |     });
  57 |   }
  58 | });
  59 |
  60 | // Test only the homepage scanning the full page including <header> and <nav>
  61 | test.describe('Full test for homepage', () => {
  62 |   if (urls.includes(homePageUrl)) {
  63 |     test('A11y test on home page', async ({ page }) => {
  64 |       await page.goto(homePageUrl, { waitUntil: 'load' });
  65 |       results = await axe.analyze();
  66 |       expect(results.violations.length, 'Accessibility violations found, see details above').toBe(0);
  67 |     });
  68 |   }
  69 | });
  70 |
  71 | // Test all other pages scanning only <main> content
  72 | test.describe('Limited to <main> test on other pages', () => {
  73 |   urls
  74 |     .filter(url => url !== homePageUrl)
  75 |     .forEach(url => {
  76 |       test(`A11y test on ${url}`, async ({ page }) => {
  77 |         await page.goto(url, { waitUntil: 'load' });
  78 |         results = await axe
  79 |           .include('main')
  80 |           // Exclude known Axe violation(s) in DS tab group tabs; keep this scoped and remove when fixed.
  81 |           .exclude('sl-tab-group.ds-tab-group > sl-tab')
  82 |           .analyze();
> 83 |         expect(results.violations.length, 'Accessibility violations found, see details above').toBe(0);
     |                                                                                                ^ Error: Accessibility violations found, see details above
  84 |       });
  85 |     });
  86 | });
  87 |
```
