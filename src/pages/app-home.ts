import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import countries from '../utils/countries';
import timezones from '../utils/timezones';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        .container {
          height: 100vh;
          height: 100dvh;
          box-sizing: border-box;
          padding: 16px;
          max-width: 460px;
          margin: 0 auto;
          background-color: #fff;
          position: relative;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 500;
          margin-top: 3rem;
        }

        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: absolute;
          inset: 0;
          margin: auto;
          padding: 16px;
        }

        sl-card::part(footer) {
          display: flex;
          justify-content: flex-end;
        }

        sl-button {
          margin-top: 32px;
          display: flex;
          column-gap: 8px;
        }

        .whatsapp-icon {
          margin-bottom: -2px;
          margin-left: 4px;
        }

        @media (min-width: 461px) {
          .container {
            margin-top: 32px;
            margin-bottom: 32px;
            height: calc(100vh - 64px);
            height: calc(100dvh - 64px);
            border-radius: 8px;
            padding: 32px;
          }
          main {
            padding: 32px;
          }
        }

        @media (prefers-color-scheme: dark) {
          .container {
            background-color: #333;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    const url = new URL(window.location.href);
    const phoneNumber = url.searchParams.get('phoneNumber');

    if (phoneNumber) {
      // remove white spaces and leading zero from phone number
      const trimmedPhoneNumber = phoneNumber
        ?.replace(/\s/g, '')
        .replace(/^0+/, '');

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // if phone number is more than 9 digits or we couldn't get their timezone,
      // open whatsapp with phone number as-is
      if (trimmedPhoneNumber.length > 9 || timezone === '' || !timezone) {
        window.open(`https://wa.me/${trimmedPhoneNumber}`, '_blank');
      } else {
        const countryCode = (timezones as any)[timezone]?.c[0];
        const countryData = countries.find(
          (c) => c.countryCode === countryCode
        );
        const countryCallingCode = countryData?.countryCallingCode;

        window.open(
          `https://wa.me/${countryCallingCode}${trimmedPhoneNumber}`,
          '_blank'
        );
      }
    }
  }

  onChat = () => {
    const phone = this.shadowRoot?.querySelector(
      'sl-input[name="phone"]'
    ) as HTMLInputElement;

    window.open(`https://wa.me/${phone.value}`, '_blank');
  };

  render() {
    return html`
      <div class="container">
        <h1>Start a WhatsApp Chat with any Phone Number</h1>

        <main>
          <sl-input
            inputmode="tel"
            label="Enter phone number"
            size="large"
            placeholder="2348012345678"
            name="phone"
            help-text="Include country code"
            clearable
          ></sl-input>

          <sl-button
            @click="${this.onChat}"
            variant="success"
            class="button"
            size="large"
          >
            <span>Start WhatsApp Chat</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="whatsapp-icon"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
              />
            </svg>
          </sl-button>
        </main>
      </div>
    `;
  }
}

