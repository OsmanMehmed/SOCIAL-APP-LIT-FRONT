import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, property } from "lit/decorators.js";

@customElement("app-avatar")
export class AppAvatar extends LitElement {
  @property() size = 32;
  @property() src = "";
  @property() alt = "";

  static styles = [
    unsafeCSS(layoutCSS),
    css`
      .avatar {
        border-radius: var(--radius-full);
        overflow: hidden;
        border: 2px solid var(--accent);
        background: #2b0909;
        display: inline-flex;
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `,
  ];

  render() {
    const size = `${this.size}px`;
    return html`
      <div class="avatar" style="width:${size};height:${size}">
        ${this.src
          ? html`<img src=${this.src} alt=${this.alt} />`
          : html`<span></span>`}
      </div>
    `;
  }
}
