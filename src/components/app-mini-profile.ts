import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { navigate } from '../router';

@customElement('app-mini-profile')
export class AppMiniProfile extends LitElement {
  static styles = css`
    .root {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .meta {
      display: flex;
      flex-direction: column;
      font-size: 0.75rem;
    }
    .username {
      font-weight: 600;
    }
    .cta {
      margin-left: auto;
      font-size: 0.7rem;
      color: var(--accent-alt);
      cursor: pointer;
    }
  `;

  private goProfile() {
    navigate('/profile/me');
  }

  render() {
    return html`
      <div class="root">
        <app-avatar .size=${36}></app-avatar>
        <div class="meta">
          <span class="username">@chef.demo</span>
          <span class="chip-muted">Perfil culinario</span>
        </div>
        <span class="cta" @click=${this.goProfile}>Ver</span>
      </div>
    `;
  }
}
