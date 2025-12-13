import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

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
      padding: 2rem;
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
    let icon = "📂";
    if (this.type === "loading") icon = "🥘";
    if (this.type === "error") icon = "⚠️";

    let displayMessage = this.message;
    if (!displayMessage) {
      if (this.type === "loading") displayMessage = "Cargando...";
      else if (this.type === "error") displayMessage = "Ocurrió un error.";
      else displayMessage = "No hay resultados.";
    }

    return html`
      <div class="${this.type}">
        <div class="icon">${icon}</div>
        <div class="message">${displayMessage}</div>
      </div>
    `;
  }
}
