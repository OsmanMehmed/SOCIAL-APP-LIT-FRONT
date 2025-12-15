import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";

@customElement("app-fallback")
export class AppFallback extends LitElement {
  @property({ type: String }) message = "";
  @property({ type: String }) type = "empty";

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--muted-foreground);
      width: 100%;
    }

    .icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      opacity: 0.5;
    }

    .message {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .empty {
      margin-block: 1.5rem;
    }

    .loading .icon {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 0.3;
        transform: scale(0.95);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.05);
      }
      100% {
        opacity: 0.3;
        transform: scale(0.95);
      }
    }
  `;

  render() {
    let icon = CONSTANTS.ICON_EMPTY;
    if (this.type === "loading") icon = CONSTANTS.ICON_LOADING;
    if (this.type === "error") icon = CONSTANTS.ICON_ERROR;

    let displayMessage = this.message;
    if (!displayMessage) {
      if (this.type === "loading") displayMessage = CONSTANTS.LOADING_TEXT;
      else if (this.type === "error") displayMessage = CONSTANTS.ERROR_TEXT;
      else displayMessage = CONSTANTS.NO_RESULTS_TEXT;
    }

    return html`
      <div class="${this.type}">
        <div class="icon">${icon}</div>
        <div class="message">${displayMessage}</div>
      </div>
    `;
  }
}
