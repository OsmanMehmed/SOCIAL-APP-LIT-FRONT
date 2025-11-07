import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { navigate } from '../router';

@customElement('page-profile-settings')
export class PageProfileSettings extends LitElement {
  createRenderRoot() {
    return this;
  }

  private save(e: Event) {
    e.preventDefault();
    navigate('/profile/me');
  }

  private cancel() {
    navigate('/profile/me');
  }

  render() {
    return html`
      <form class="flow-column card" @submit=${this.save}>
        <div class="chip-muted">Configurar perfil culinario</div>
        <input class="input" placeholder="Nombre del chef" />
        <input class="input" placeholder="Especialidad (italiana, vegana, etc.)" />
        <input class="input" placeholder="Enlace a tu blog o canal" />
        <div style="display:flex;gap:0.5rem;">
          <button class="btn btn-sm" type="submit">Guardar</button>
          <button
            class="btn-outline btn-sm"
            type="button"
            @click=${this.cancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    `;
  }
}
