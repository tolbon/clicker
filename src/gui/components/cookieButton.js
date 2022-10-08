import {html, css, LitElement} from 'lit';


export class CookieButton extends LitElement {

  static styles = css`p { color: blue }`;

  static properties = {
    cookie: {type: Number}
  };

  constructor() {
    super();
    this.cookie = 0;
  }

  collectCookie() {
    this.cookie += 
  }

  render() {
    return html`
      <button @click=${this.collectCookie}>Cookie 🍪</button>
      <p>Result: ${this.result}</p>
    `;
  }

}

customElements.define('cookieButton', CookieButton);