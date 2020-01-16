import { LitElement, html, css } from "../web_modules/lit-element.js";
import "../web_modules/@material/mwc-drawer.js";
import "../web_modules/@material/mwc-top-app-bar.js";
import "../web_modules/@material/mwc-icon-button.js";
import "../web_modules/@material/mwc-button.js";
import "../web_modules/@material/mwc-dialog.js";

import { Certificate } from "../web_modules/@pkijs/pkijs/pkijs.js";
import { fromBER } from "../web_modules/@pkijs/asn1js/asn1.js";

import { style as listStyle } from './mwc-list-item-css.js';
import './dismissable-item.js';
import './file-storage.js';
import { FileStorage } from "./file-storage.js";

export class WriteDialog extends LitElement {
  static styles = css`
    #dialog {
      --mdc-dialog-max-width: 350px;
    }
    #container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      height: 150px;
    }
    #bg-nfc {
      width: 100px;
      height: 100px;
      fill: lightgray;
    }
  `;

  firstUpdated() {
    this.dialog = this.shadowRoot.querySelector("#dialog");
    this.dialog.addEventListener('closed', async ev => {
      if (ev.detail.action !== "write") return;

      const replacer = (key, value) => {
        if (key === 'fingerprint') {
          return toReadableFingerprint(value);
        }
        return value;
      }

      const ndef = {
        records: [{
          recordType: "text",
          data: this.data
        }]
      };

      console.log(`${JSON.stringify(ndef, replacer, '  ')}`);

      if ('NDEFWriter' in window) {
        const writer = new NDEFWriter();
        if (!('write' in writer)) {
          writer.write = writer.push;
        }

        try {
          await writer.write(ndef);
        } catch(err) {
          console.error(err);
        }
      } else {
        console.error("NFC isn't supported by this device.");
      }
    });
  }

  async open(data) {
    await this.updateComplete;
    this.data = data;
    this.dialog.open = true;
  }

  render() {
    return html`
      <mwc-dialog id="dialog">
        <div id="container">
          <svg id="bg-nfc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"/>
            <path d="M20,2L4,2c-1.1,0 -2,0.9 -2,2v16c0,1.1 0.9,2 2,2h16c1.1,0
            2,-0.9 2,-2L22,4c0,-1.1 -0.9,-2 -2,-2zM20,20L4,20L4,4h16v16zM18,6h-5c-1.1,0
            -2,0.9 -2,2v2.28c-0.6,0.35 -1,0.98 -1,1.72 0,1.1 0.9,2 2,2s2,-0.9 2,-2c0,-0.74
            -0.4,-1.38 -1,-1.72L13,8h3v8L8,16L8,8h2L10,6L6,6v12h12L18,6z"/>
          </svg>
        </div>
        Write to NFC device
        <mwc-button
        dialogAction="write"
        slot="primaryAction">
          write
        </mwc-button>
        <mwc-button
          dialogAction="close"
          slot="secondaryAction">
          close
        </mwc-button>
      </mwc-dialog>
    `;
  }
}

customElements.define("write-dialog", WriteDialog);

export class TokenItem extends LitElement {
  static styles = [
    listStyle,
    css`
      :host {
        width: 100%;
        height: 100%;
      }
      mwc-icon-button {
        display: none;
      }
      @media(hover: hover) {
        dismissable-item:hover mwc-icon-button {
          display: block;
        }
      }
      .mdc-list-item {
        height: 64px;
      }
      mwc-checkbox {
        padding-right: 14px;
      }
      dismissable-item {
        width: 100%;
        height: 100%;
        --item-bg-color: white;
        padding: 0px ! important;
        user-select: none;
      }
      div {
        background-color: #E53935;
      }
    `
  ];

  static get properties() {
    return {
      token: { type: String },
      expiration: { type: String }
    };
  }

  onremove(ev) {
    ev.stopPropagation();
    this.dispatchEvent(new CustomEvent('remove', {
      detail: { token: this.token }, bubbles: true
    }));
  }

  render() {
    return html`
        <dismissable-item @remove=${this.onremove} role="listitem" class="mdc-list-item">
          <span class="mdc-list-item__text">
            ${this.token.substr(0, 8)}
            <span class="mdc-list-item__secondary-text">${new Date(+this.expiration)}</span>
          </span>
          <mwc-icon-button class="mdc-list-item__meta"
            aria-label="Delete item" title="Delete" icon="delete"
            @click=${this.onremove} tabindex="-1">
          </mwc-icon-button>
        </dismissable-item>
    `
  }
}

customElements.define('token-item', TokenItem);

function toReadableFingerprint(arrayBuffer) {
  return Array.prototype.map.call(new Uint8Array(arrayBuffer),
    x => ('00' + x.toString(16)).slice(-2)
  ).join('');
}

class MainApplication extends LitElement {
  static styles = css`
  .drawer-content {
    padding: 0px 16px 0 16px;
  }
  .main-content {
    width: 100vw;
    min-height: 300px;
    padding: 48px 0 0 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: stretch;
  }

  #tokens {
    width: 100%;
  }

  hr {
    width: 100%;
  }
  `;

  tokens = [];
  fingerprint = null;

  constructor() {
    super();
    this.fileStorage = new FileStorage();
  }

  async uploadTokens() {
    await this.fileStorage.chooseTokens();
    this.tokens = await this.fileStorage.tokens();
    this.requestUpdate();
  }

  async removeToken(token) {
    await this.fileStorage.removeToken(token);
    this.tokens = await this.fileStorage.tokens();
    this.requestUpdate();
  }

  async uploadCertificate(ev) {
    await this.fileStorage.chooseCertificate();
    this.fingerprint = toReadableFingerprint(await this.certificateFingerprint());
  }

  async certificateFingerprint() {
    let fingerprint = null;
    const certificateBuffer = await this.fileStorage.certificate();
    if (certificateBuffer) {
      const asn1src = fromBER(certificateBuffer);
      const certificate = new Certificate({ schema: asn1src.result });
      fingerprint = await certificate.getKeyHash();
    }
    return fingerprint;
  }

  async updateInfo(token) {
    const data = {
      token: token.token,
      fingerprint: this.fingerprint,
      gateway: "rsp-software-toolkit-gateway"
    };

    const dialog = this.shadowRoot.querySelector("write-dialog");
    dialog.open(data);
  }

  async firstUpdated() {
    const drawer = this.shadowRoot.querySelector("mwc-drawer");
    const container = drawer.parentNode;
    container.addEventListener('MDCTopAppBar:nav', _ => {
      drawer.open = !drawer.open;
    });

    this.tokens = await this.fileStorage.tokens();
    this.fingerprint = await this.certificateFingerprint();

    this.requestUpdate();
  }

  render() {
    return html`
      <mwc-drawer hasHeader type=modal>
        <span slot="title">Intel RSP Sensor NFC</span>
        <span slot="subtitle">Configure your NFC tags today</span>
        <div class="drawer-content">
          <p><a href="https://w3c.github.io/web-nfc/">Web NFC API specification</a></p>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button slot="navigationIcon" icon="menu"></mwc-icon-button>
            <div slot="title">Intel RSP Sensor NFC</div>
          </mwc-top-app-bar>
          <div class="main-content">
            <mwc-button @click="${ev => this.uploadCertificate(ev)}">
              Upload Certificate
            </mwc-button>
            <mwc-button @click="${ev => this.uploadTokens(ev)}">
              Upload Tokens
            </mwc-button>
            <hr>
            Certificate (hash): <span>${toReadableFingerprint(this.fingerprint)}</span>
            <hr>
            <div id="tokens" role="list" class="mdc-list mdc-list--two-line">
              ${this.tokens.map(token => html`
                <token-item token=${token.token} expiration=${token.expirationTimestamp}
                  @click=${_ => this.updateInfo(token)}
                  @remove=${ev => this.removeToken(ev.detail.token)}></token-item>
              `)}
            </div>
          </div>
        </div>
      </mwc-drawer>
      <write-dialog></write-dialog>
    `;
  }
}

customElements.define("main-app", MainApplication);
