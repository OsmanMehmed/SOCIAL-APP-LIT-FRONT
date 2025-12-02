import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, state } from "lit/decorators.js";
import { authStore } from "../state/auth-store";
import { CONSTANTS } from "../shared/constants";
import { navigate } from "../router";
import { authService } from "../servicios/core/auth-service";

@customElement("page-login")
export class PageLogin extends LitElement {
  @state() username = "";
  @state() password = "";
  @state() errorMessage: string | null = null;
  @state() isSubmitting = false;

  private onInput(e: Event) {
    const input = e.target as HTMLInputElement;

    const withoutPrefix = input.value.replace(/^@+/, "");
    this.username = withoutPrefix;
    this.errorMessage = null;

    const displayValue = this.username
      ? CONSTANTS.USERNAME_PREFIX + this.username
      : "";

    if (input.value !== displayValue) {
      input.value = displayValue;
    }
  }

  private onPasswordInput(e: Event) {
    this.password = (e.target as HTMLInputElement).value;
    this.errorMessage = null;
  }

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .wrap {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .panel {
        width: 400px;
        padding: 1rem;
        border-radius: var(--radius-md);
        border: 1.25px solid var(--border-subtle);
        background: var(--background);
        box-shadow: var(--shadow-soft);
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .title {
        font-size: 1.3rem;
        font-weight: 600;
        text-align: center;
      }

      .login-input {
        width: 95%;
      }

      .chip-login {
        margin-top: 0.75em;
      }

      .error {
        color: var(--danger);
        font-size: 0.9rem;
        padding: 0.35rem 0.5rem;
        border-radius: var(--radius-sm);
        background: rgba(255, 59, 48, 0.08);
        border: 1px solid rgba(255, 59, 48, 0.35);
        min-height: 1.8rem;
        display: flex;
        align-items: center;
      }

      .error.hidden {
        visibility: hidden;
      }
    `,
  ];

  private async onLogin(e: Event) {
    e.preventDefault();
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const user = this.username.trim();
    const pass = this.password.trim();

    if (!user || !pass) {
      this.errorMessage = "Introduce usuario y contraseña.";
      this.isSubmitting = false;
      return;
    }

    try {
      const auth = await authService.login({
        username: user,
        password: pass,
      });
      authStore.loginWithAuth(auth);
      navigate("/feed");
    } catch (err) {
      authStore.logout();
      const message =
        err instanceof Error ? err.message : "No se pudo iniciar sesión.";
      this.errorMessage = message || "Usuario o contraseña incorrectos.";
      console.warn("Login error", err);
    } finally {
      this.isSubmitting = false;
    }
  }

  render() {
    const displayValue = this.username
      ? CONSTANTS.USERNAME_PREFIX + this.username
      : "";

    return html`
      <div class="wrap">
        <form class="panel" @submit=${this.onLogin}>
          <div class="title">${CONSTANTS.LOGIN_TITLE}</div>
          <input
            id="user"
            class="input login-input"
            type="text"
            placeholder="${CONSTANTS.LOGIN_INPUT_USERNAME_PLACEHOLDER}"
            .value=${displayValue}
            @input=${this.onInput}
            required
          />
          <input
            id="pass"
            class="input login-input"
            type="password"
            placeholder="${CONSTANTS.LOGIN_INPUT_PASSWORD_PLACEHOLDER}"
            .value=${this.password}
            @input=${this.onPasswordInput}
            required
          />
          <button class="btn" type="submit">
            ${CONSTANTS.LOGIN_BUTTON_TEXT}
          </button>
          <div
            class=${`error ${this.errorMessage ? "" : "hidden"}`}
            role="alert"
            aria-live="polite"
          >
            ${this.errorMessage || " "}
          </div>
          <div class="chip-muted chip-login">
            <span>${CONSTANTS.LOGIN_HELP_TEXT}</span>
          </div>
        </form>
      </div>
    `;
  }
}
