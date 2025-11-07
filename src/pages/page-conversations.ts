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
          <div class="chip-muted">Perfiles / Mensajes</div>
          <strong>@ana.runner</strong>
          <p>Vista previa de últimos mensajes.</p>
        </div>
        <div class="card" @click=${() => this.openDm('2')}>
          <strong>@dev.team</strong>
          <p>Coordinación del proyecto.</p>
        </div>
      </section>
    `;
  }
}
