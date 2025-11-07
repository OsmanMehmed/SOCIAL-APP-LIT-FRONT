import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('page-search')
export class PageSearch extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="flow-column">
        <input class="input" placeholder="Buscar perfiles, posts o mensajes" />
        <div class="card">
          <div class="chip-muted">Resultados sugeridos</div>
          <p>Búsqueda social integrada con navegación a Perfil, Post o Mensaje directo.</p>
        </div>
      </section>
    `;
  }
}
