import { LitElement, html, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import iconButtonCSS from "../styles/components/app-icon-button.css?inline";
import { customElement, property } from "lit/decorators.js";

@customElement("app-icon-button")
export class AppIconButton extends LitElement {
  @property() label = "";
  @property() selected = false;
  @property() name = "";

  static styles = [unsafeCSS(layoutCSS), unsafeCSS(iconButtonCSS)];

  render() {
    return html` <button ?selected=${this.selected} title=${this.label}>
      <slot></slot>
    </button>`;
  }
}
