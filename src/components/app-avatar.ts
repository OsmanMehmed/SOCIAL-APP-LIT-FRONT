import { LitElement, html, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import avatarCSS from "../styles/components/app-avatar.css?inline";
import { customElement, property } from "lit/decorators.js";

@customElement("app-avatar")
export class AppAvatar extends LitElement {
  @property({ type: String }) src = "";
  @property({ type: Boolean }) bigAvatar = false;
  @property({ type: Boolean }) cursorPointer = true;

  static styles = [unsafeCSS(layoutCSS), unsafeCSS(avatarCSS)];

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
