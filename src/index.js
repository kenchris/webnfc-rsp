import { LitElement, html, css } from "../web_modules/lit-element.js";
import "../web_modules/@material/mwc-drawer.js";
import "../web_modules/@material/mwc-top-app-bar.js";
import "../web_modules/@material/mwc-icon-button.js";
import "../web_modules/@material/mwc-textfield.js";

import * as asn1 from "../web_modules/@pkijs/asn1js/asn1.js";

import Certificate from "../web_modules/@pkijs/pkijs/Certificate.js";
import AttributeTypeAndValue from "../web_modules/@pkijs/pkijs/AttributeTypeAndValue.js";
import Extension from "../web_modules/@pkijs/pkijs/Extension.js";
import BasicConstraints from "../web_modules/@pkijs/pkijs/BasicConstraints.js";

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
  `;


  firstUpdated() {
    const drawer = this.shadowRoot.querySelector("mwc-drawer");
    const container = drawer.parentNode;
    container.addEventListener('MDCTopAppBar:nav', _ => {
      drawer.open = !drawer.open;
    });

    console.log(asn1);

    const certificate = new Certificate();

    //region Creation of a new X.509 certificate
    certificate.serialNumber = new asn1.Integer({ value: 1 });
    certificate.issuer.typesAndValues.push(new AttributeTypeAndValue({
        type: "2.5.4.6", // Country name
        value: new asn1.PrintableString({ value: "RU" })
    }));
    certificate.issuer.typesAndValues.push(new AttributeTypeAndValue({
        type: "2.5.4.3", // Common name
        value: new asn1.PrintableString({ value: "Test" })
    }));
    certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
        type: "2.5.4.6", // Country name
        value: new asn1.PrintableString({ value: "RU" })
    }));
    certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
        type: "2.5.4.3", // Common name
        value: new asn1.PrintableString({ value: "Test" })
    }));

    certificate.notBefore.value = new Date(2013, 1, 1);
    certificate.notAfter.value = new Date(2016, 1, 1);

    certificate.extensions = []; // Extensions are not a part of certificate by default, it's an optional array

    //region "BasicConstraints" extension
    const basicConstr = new BasicConstraints({
        cA: true,
        pathLenConstraint: 3
    });

    certificate.extensions.push(new Extension({
        extnID: "2.5.29.19",
        critical: false,
        extnValue: basicConstr.toSchema().toBER(false),
        parsedValue: basicConstr // Parsed value for well-known extensions
    }));
    //endregion

    //region "KeyUsage" extension
    const bitArray = new ArrayBuffer(1);
    const bitView = new Uint8Array(bitArray);

    bitView[0] |= 0x02; // Key usage "cRLSign" flag
    bitView[0] |= 0x04; // Key usage "keyCertSign" flag

    const keyUsage = new asn1.BitString({ valueHex: bitArray });

    certificate.extensions.push(new Extension({
        extnID: "2.5.29.15",
        critical: false,
        extnValue: keyUsage.toBER(false),
        parsedValue: keyUsage // Parsed value for well-known extensions
    }));
    //endregion
    //endregion

    const keyhash = this.shadowRoot.querySelector('#keyhash');
    certificate.getKeyHash().then(hash => {
      const str = String.fromCharCode.apply(null, new Uint16Array(hash));
      keyhash.innerHTML = str;
    });
  }

  render() {
    return html`
      <mwc-drawer hasHeader type=modal>
        <span slot="title">RSP Proviosioning app</span>
        <span slot="subtitle">Configure your NFC tags today</span>
        <div class="drawer-content">
          <p><a href="https://w3c.github.io/web-nfc/">Web NFC API specification</a></p>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button slot="navigationIcon" icon="menu"></mwc-icon-button>
            <div slot="title">Intel RSP</div>
          </mwc-top-app-bar>
          <div class="main-content">
            <mwc-textfield outlined required
              id="product"
              label="Enter product...">
            </mwc-textfield>
            <div id="keyhash">KEYHASH</div>
          </div>
        </div>
      </mwc-drawer>
    `;
  }
}

customElements.define("main-app", MainApplication);
