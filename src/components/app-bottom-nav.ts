import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { navigate } from '../router';
import './app-icon-button';

@customElement('app-bottom-nav')
export class AppBottomNav extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <nav class="bottom-nav">
        <app-icon-button label="Inicio" @click=${() => navigate('/feed')}>🏠</app-icon-button>
        <app-icon-button label="Buscar" @click=${() => navigate('/search')}>🔍</app-icon-button>
        <app-icon-button label="Nuevo" @click=${() => navigate('/post/new')}>➕</app-icon-button>
        <app-icon-button label="Mensajes" @click=${() => navigate('/messages')}>✉</app-icon-button>
        <app-icon-button label="Perfil" @click=${() => navigate('/profile/me')}>👤</app-icon-button>
      </nav>
    `;
  }
}
