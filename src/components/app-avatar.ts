import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, property } from "lit/decorators.js";

@customElement("app-avatar")
export class AppAvatar extends LitElement {
  @property({ type: String }) src = "";
  @property({ type: Boolean }) bigAvatar = false;
  @property({ type: Boolean }) cursorPointer = true;

  static styles = [
    unsafeCSS(layoutCSS),
    css`
      .avatar {
        border-radius: var(--radius-full);
        overflow: hidden;
        border: 2px solid var(--accent);
        background: #712222ff;
        display: inline-flex;
        width: 3em;
        height: 3em;
      }
      
      .big-avatar {
        width: 5em;
        height: 5em;
      }

      .pointer {
        cursor: pointer;
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
    return html`
      <div class="avatar ${this.cursorPointer ? "pointer" : ""} ${
      this.bigAvatar ? "big-avatar" : ""
    }">
          ${this.src ? html`<img src=${this.src} />` : html`<span></span>`}
        </div>
      </div>
    `;
  }
}
