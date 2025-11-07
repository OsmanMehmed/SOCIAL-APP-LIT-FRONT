import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { navigate } from '../router';

@customElement('page-conversations')
export class PageConversations extends LitElement {
  createRenderRoot() {
    return this;
  }

  private openDm(id: string) {
    navigate(`/dm/${id}`);
  }

  render() {
    return html`
      <section class="flow-column">
        <div class="card" @click=${() => this.openDm('1')}>
          <div class="chip-muted">Chefs / Mensajes</div>
          <strong>@ana.cocina</strong>
          <p>Consejos sobre fermentación y panes.</p>
        </div>
        <div class="card" @click=${() => this.openDm('2')}>
          <strong>@equipo.recetas</strong>
          <p>Organiza un reto semanal de recetas.</p>
        </div>
      </section>
    `;
  }
}
