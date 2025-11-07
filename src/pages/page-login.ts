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
          <div class="title">Social Recipes</div>
          <input
            id="user"
            class="input"
            placeholder="Tu usuario chef"
            @input=${this.onInput}
            required
          />
          <input
            id="pass"
            class="input"
            type="password"
            placeholder="Contraseña"
            required
          />
          <button class="btn" type="submit">Entrar a la cocina</button>
          <div class="chip-muted">Comparte tus recetas con la comunidad.</div>
        </form>
      </div>
    `;
  }
}
