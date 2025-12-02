import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import pageLoginCSS from "./page-login.css?inline";
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

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageLoginCSS)];

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
