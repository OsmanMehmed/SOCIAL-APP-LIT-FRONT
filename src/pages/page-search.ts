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
        <input class="input" placeholder="Buscar recetas, chefs o ingredientes" />
        <div class="card">
          <div class="chip-muted">Búsquedas populares</div>
          <p>Pizza napolitana, ramen casero, tiramisú, meal prep saludable.</p>
        </div>
      </section>
    `;
  }
}
