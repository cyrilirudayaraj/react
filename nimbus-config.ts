/**
 * This file is needed to support Webpack's code splitting. It must be
 * the first thing imported in your package's main entry file. You should
 * not need to change this file.
 *
 * In order to support webpack code splitting, webpack needs to know
 * the URL from which the module is being served. In the case of the CDN,
 * this URL can change and is not predictable at build time.
 *
 * The token below will be substituted at build time with a JS expression
 * that fetches the URL from the Bundle Loader. Webpack will then look
 * for other chunks from this relative URL.
 *
 * In order for this to work, this file must be imported before all other
 * ES6 modules. This means it should be the first thing imported inside
 * this application's main entry file.
 *
 * For more information, see: https://webpack.js.org/guides/public-path/
 *
 */

declare let __webpack_public_path__: string; /* eslint-disable-line @typescript-eslint/camelcase */
declare const NIMBUS_BUNDLE_PUBLIC_PATH: string; /* eslint-disable-line @typescript-eslint/camelcase */
__webpack_public_path__ = NIMBUS_BUNDLE_PUBLIC_PATH; /* eslint-disable-line @typescript-eslint/camelcase */

/**
 * Variable NIMBUS_BUNDLE_CSS_NAMESPACE will be dynamically replaced
 * by a webpack define plugin (https://webpack.js.org/plugins/define-plugin/)
 * that will be populated with the CSS namespace for your application.
 * This is all determined automatically by the Nimbus build system.
 *
 * In order for this to work correctly, constant NIMBUS_BUNDLE_CSS_NAMESPACE
 * needs to be listed as one of the root classes for your application.
 *
 * These root classes are applied by forge using the React Context API,
 * but in order for this to work you must include a forge Root element
 * as the root of your application hierarchy with the theme prop set to
 * the theme export of this file.
 */

declare const NIMBUS_BUNDLE_CSS_NAMESPACE: string;

const rootClasses = [NIMBUS_BUNDLE_CSS_NAMESPACE];

export const forgeTheme = {
  rootClasses,
};
