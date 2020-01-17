/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "images/128.png",
    "revision": "ce25e0c14fc06ed9b012f7c0dd49e472"
  },
  {
    "url": "images/144.png",
    "revision": "a5fe00a74b8a3dda47bdba3068eca870"
  },
  {
    "url": "images/152.png",
    "revision": "8d7743bdf668292bbad5c7f2797bca24"
  },
  {
    "url": "images/192.png",
    "revision": "2d0c41bced10c3ecd029b817c96afeeb"
  },
  {
    "url": "images/384.png",
    "revision": "ca39513f9ecc019e7c40c4eccfe76355"
  },
  {
    "url": "images/48.png",
    "revision": "7eb284a0ef9cb14c05f562bec76d13c0"
  },
  {
    "url": "images/512.png",
    "revision": "524270b2f6963d1bda9341f3b8558520"
  },
  {
    "url": "images/72.png",
    "revision": "6d358f12f721ab9d9e3827c268b83e6f"
  },
  {
    "url": "images/96.png",
    "revision": "72e2fce4aa2ede53c1d2d55bc30e6857"
  },
  {
    "url": "index.html",
    "revision": "69844808325a104c2d2fc260dc452b28"
  },
  {
    "url": "src/dismissable-item.js",
    "revision": "2bb2005412532775fe699ffc452d58c8"
  },
  {
    "url": "src/file-storage.js",
    "revision": "ed8cd820634d5bb5d93637f53b04bb86"
  },
  {
    "url": "src/index.js",
    "revision": "ca95ebea114442969cf0ae5f0a559a7f"
  },
  {
    "url": "src/mwc-list-item-css.js",
    "revision": "b4f2384c6d571814abf9c6836013eab4"
  },
  {
    "url": "web_modules/@material/mwc-button.js",
    "revision": "ebf86c1d9e3827aa1209b0b2d5257d76"
  },
  {
    "url": "web_modules/@material/mwc-dialog.js",
    "revision": "31bf095cbc7ab0541b2075aa4652d8f5"
  },
  {
    "url": "web_modules/@material/mwc-drawer.js",
    "revision": "843e7527169d57cbb688f9c024ee967e"
  },
  {
    "url": "web_modules/@material/mwc-icon-button.js",
    "revision": "dc799135b727ead08e9e218a82f6eb48"
  },
  {
    "url": "web_modules/@material/mwc-snackbar.js",
    "revision": "eaa6b6eb9013c480173a95616918d3d6"
  },
  {
    "url": "web_modules/@material/mwc-textfield.js",
    "revision": "ada1554ecd412885998d9ed1f5fce814"
  },
  {
    "url": "web_modules/@material/mwc-top-app-bar.js",
    "revision": "6fda69171b06ccf503380020b1ddbc77"
  },
  {
    "url": "web_modules/@pkijs/asn1js/asn1.js",
    "revision": "dd33731b12f69c106b08e52d0045e1b7"
  },
  {
    "url": "web_modules/@pkijs/bytestreamjs/bytestream.js",
    "revision": "14a63f32e71e81d621601e71bc521367"
  },
  {
    "url": "web_modules/@pkijs/pkijs/pkijs.js",
    "revision": "13d45e6a3640fba07c5c25d6baf64f62"
  },
  {
    "url": "web_modules/@pkijs/pvutils/utils.js",
    "revision": "7ae4c12f9af7bf4b40c853d5c870b0a5"
  },
  {
    "url": "web_modules/common/_rollupPluginBabelHelpers-8ca5e321.js",
    "revision": "f13f4af3adffdb3e0c7ee95c36bc4ce9"
  },
  {
    "url": "web_modules/common/base-element-a53d96c4.js",
    "revision": "3a041b23a3a4751fb1145dda99521093"
  },
  {
    "url": "web_modules/common/class-map-6ab3b156.js",
    "revision": "65c64d8cf967c22581eb122a3bd794c9"
  },
  {
    "url": "web_modules/common/events-bc34a64f.js",
    "revision": "7dee21ee817d855a38548523a46876cb"
  },
  {
    "url": "web_modules/common/foundation-61737bd0.js",
    "revision": "075fc05ae3ddcd1901044cd4376ea3db"
  },
  {
    "url": "web_modules/common/inert-48a324d7.js",
    "revision": "6f5e4460ef04f4c1ad7d48c54c97def9"
  },
  {
    "url": "web_modules/common/lit-html-e3979997.js",
    "revision": "5d836ee2497804f5452a4403ea287b2d"
  },
  {
    "url": "web_modules/common/ripple-directive-69ae1cd3.js",
    "revision": "8865848205360b3f7ba4daac735e821e"
  },
  {
    "url": "web_modules/idb.js",
    "revision": "a3ea54c219190630c34a408d537ae56d"
  },
  {
    "url": "web_modules/lit-element.js",
    "revision": "89272c4c5f317257acf0e3cb64b645ad"
  },
  {
    "url": "web_modules/lit-html.js",
    "revision": "2a0b847cf0d9162a02c0c9e256150b64"
  },
  {
    "url": "manifest.json",
    "revision": "724761f3d7a3a9a9becb3498020e8f51"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/https:\/\/fonts./, new workbox.strategies.CacheFirst({ "cacheName":"fonts", plugins: [] }), 'GET');
