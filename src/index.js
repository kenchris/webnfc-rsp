import { LitElement, html, css } from "../web_modules/lit-element.js";
import "../web_modules/@material/mwc-drawer.js";
import "../web_modules/@material/mwc-top-app-bar.js";
import "../web_modules/@material/mwc-icon-button.js";
import "../web_modules/@material/mwc-button.js";

import { Certificate } from "../web_modules/@pkijs/pkijs/pkijs.js";
import { fromBER } from "../web_modules/@pkijs/asn1js/asn1.js";
import { bufferToHexCodes } from "../web_modules/@pkijs/pvutils/utils.js";

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

  #keyhash {
    font-size: 8px; 
  }
  `;

  tokens = [];

  async uploadTokens(ev) {
    const opts = {type: 'openDirectory'};
    const handle = await window.chooseFileSystemEntries(opts);
    const entries = await handle.getEntries();
    const re = new RegExp('^token_[0-9_]+\.json$');

    this.tokens = [];

    for await (const entry of entries) {
      if (entry.isFile && re.test(entry.name)) {
        const file = await entry.getFile();
        const text = await file.text();
        const json = JSON.parse(text);
        this.tokens.push(json);
      }
    }
    this.requestUpdate();

    this.updateInfo();
  } 

  async uploadCertificate(ev) {
    const fileHandle = await window.chooseFileSystemEntries();
    const file = await fileHandle.getFile();
    const contents = await file.arrayBuffer();
    this.loadCertificate(contents);
  } 

  async loadCertificate(certificateBuffer) {
    const asn1src = fromBER(certificateBuffer);
    this.certificate = new Certificate({ schema: asn1src.result });
  }

  // Kind of a layout hack
  async updateInfo() {
    const records = [{
      recordType: "text",
      data: {
        token: this.tokens[this.tokens.length - 1].token,
        fingerprint: await this.certificate.getKeyHash(),
        gateway: "rsp-software-toolkit-gateway"
      }
    }];

    const replacer = (key, value) => {
      if (key === 'fingerprint') {
        return Array.prototype.map.call(new Uint8Array(value),
            x => ('00' + x.toString(16)).slice(-2)
          ).join('');
      }
      return value;
    }

    const info = this.shadowRoot.querySelector('#info');
    info.innerHTML = `
      <pre>records: ${JSON.stringify(records, replacer, '  ')}</pre>
    `;
  }

  async firstUpdated() {
    const drawer = this.shadowRoot.querySelector("mwc-drawer");
    const container = drawer.parentNode;
    container.addEventListener('MDCTopAppBar:nav', _ => {
      drawer.open = !drawer.open;
    });

    const tres = await fetch("files/token_20181111_130018.json");
    const json = await tres.json();
    this.tokens = [json];

    const res = await fetch("files/rsp.der");
    const certificateBuffer = await res.arrayBuffer();
    this.loadCertificate(certificateBuffer)
    this.updateInfo();
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
            <br>
            <div id="tokens">
              <pre>${this.tokens.map(token => html`${JSON.stringify(token, null, ' ')}`)}</pre>
            </div>
            <br>
            <div id="info">Information</div>
          </div>
        </div>
      </mwc-drawer>
    `;
  }
}

customElements.define("main-app", MainApplication);
