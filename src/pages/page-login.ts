import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { authStore } from '../state/auth-store';
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
      background: #020817f7;
      box-shadow: var(--shadow-soft);
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .title {
      font-size: 1.2rem;
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
          <div class="title">Social App</div>
          <input
            class="input"
            placeholder="Usuario o email"
            @input=${this.onInput}
            required
          />
          <input
            class="input"
            type="password"
            placeholder="Contraseña"
            required
          />
          <button class="btn" type="submit">Login</button>
          <div class="chip-muted">Cierre de sesión disponible en el menú superior.</div>
        </form>
      </div>
    `;
  }
}
