import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, property } from "lit/decorators.js";

@customElement("app-icon-button")
export class AppIconButton extends LitElement {
  @property() label = "";
  @property() selected = false;

  static styles = [
    unsafeCSS(layoutCSS),
    css`
      :host {
        display: inline-flex;
      }
      button {
        background: transparent;
        border: none;
        color: var(--muted-foreground);
        padding: 0.25rem;
        cursor: pointer;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        transition: all 0.15s ease;
      }
      button[selected] {
        color: var(--accent);
        background: rgba(255, 75, 58, 0.12);
        box-shadow: var(--shadow-soft);
      }
      button:hover {
        transform: translateY(-1px);
        color: var(--accent);
      }
    `,
  ];

  render() {
    return html`<button ?selected=${this.selected} title=${this.label}>
      <slot></slot>
    </button>`;
  }
}
