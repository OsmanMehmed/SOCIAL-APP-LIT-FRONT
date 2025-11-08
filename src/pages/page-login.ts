import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { authStore } from '../state/auth-store';
import {
  LOGIN_CHIP_COMMUNITY,
  LOGIN_TITLE,
  LOGIN_INPUT_USERNAME_PLACEHOLDER,
  LOGIN_INPUT_PASSWORD_PLACEHOLDER,
  LOGIN_BUTTON_TEXT,
  LOGIN_HELP_TEXT,
} from '../shared/constants';
import { navigate } from '../router';

@customElement('page-login')
export class PageLogin extends LitElement {
  @state() username = '';

  static styles = css`
    .wrap {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .panel {
      width: 320px;
      padding: 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: rgba(15, 4, 4, 0.98);
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
  `;

  private onLogin(e: Event) {
    e.preventDefault();
    authStore.isAuthenticated = true;
    navigate('/feed');
  }

  private onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.username = target.value;
  }

  render() {
    return html`
      <div class="wrap">
        <form class="panel" @submit=${this.onLogin}>
          <div class="title">${LOGIN_TITLE}</div>
          <input
            id="user"
            class="input"
            placeholder="${LOGIN_INPUT_USERNAME_PLACEHOLDER}"
            @input=${this.onInput}
            required
          />
          <input
            id="pass"
            class="input"
            type="password"
            placeholder="${LOGIN_INPUT_PASSWORD_PLACEHOLDER}"
            required
          />
          <button class="btn" type="submit">${LOGIN_BUTTON_TEXT}</button>
          <div class="chip-muted">${LOGIN_HELP_TEXT}</div>
        </form>
      </div>
    `;
  }
}
