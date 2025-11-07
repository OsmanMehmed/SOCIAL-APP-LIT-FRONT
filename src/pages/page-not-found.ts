import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { navigate } from '../router';

@customElement('page-not-found')
export class PageNotFound extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="card">
        <div class="chip-muted">404</div>
        <p>Página no encontrada.</p>
        <button class="btn btn-sm" @click=${() => navigate('/feed')}>
          Volver al feed de recetas
        </button>
      </div>
    `;
  }
}
