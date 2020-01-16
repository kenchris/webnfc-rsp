# Web NFC RSP

Web NFC RSP is a web port of the [Sensor NFC Application for Android](https://github.com/intel/rsp-sw-toolkit-nfc). It allows you to program security credentials into the Intel® RFID Sensor Platform (Intel® RSP) using web browser.

:warning: **_WEB NFC RSP IS EXPERIMENTAL AND UNSUPPORTED SOFTWARE. FOR PRODUCTION USE, PLEASE REFER TO THE [ANDROID APPLICATION](https://github.com/intel/rsp-sw-toolkit-nfc)._**

#### Demo

Go to https://kenchris.github.io/webnfc-rsp/ ([source](https://github.com/kenchris/webnfc-rsp/tree/master))

#### Browser support

This web app requires Chrome for Android 81 ([download](https://play.google.com/store/apps/details?id=com.chrome.canary&hl=en_US)) or later with Web NFC API enabled to function properly. To enable Web NFC API, type `chrome://flags` in the browser address bar and toggle `enable-webnfc` flag.

For experimental deployments, [register for Web NFC Origin Trial](https://developers.chrome.com/origintrials/#/view_trial/236438980436951041) ([what is an Origin Trial?](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)).

#### Development

This project makes use of ECMAScript Modules (ESM) and runs them directly in the browser using [Snowpack](snowpack.dev). If you install new dependencies using `npm` like `npm install --save @material/mwc-button`, then please run `npx snowpack` afterwards to generate the new modules in `web_modules` folder. Also, the `web_modules` folder should be committed.

To install app dependencies and but any further steps, run

```sh
$ npm install
```

ESM compatible modules can be found using [pika.dev](pika.de). Material design web components can be found by searching for `@material/mwc-`. You can try out the demo page here: [Material Web Components demo](https://mwc-demos.glitch.me/)

To optimize deployment modules, run

```sh
$ npx snowpack --optimize
```

To test in the browser, run

```sh
$ npm run deploy
```

This project makes use of [PKI.js](pkijs.org) which is kind of written as ESM modules, but requires some post-processing in order to actually work. This is done by [rollup](rollupjs.org) using the `rollup.config.js` - any modification to this requires a rebuild.

To rebuild the PKI.js modules, run

```sh
$ rollup -c rollup.config.js
```

#### Reporting a security issue

If you have information about a security issue or vulnerability with an Intel-maintained open source project on https://github.com/intel, please send an e-mail to secure@intel.com. Encrypt sensitive information using our PGP public key. For issues related to Intel products, please visit https://security-center.intel.com.