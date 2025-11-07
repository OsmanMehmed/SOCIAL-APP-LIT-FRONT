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
        <div class="chip-muted">Configuración del perfil</div>
        <input class="input" placeholder="Nombre visible" />
        <input class="input" placeholder="Bio" />
        <input class="input" placeholder="Enlace" />
        <div style="display:flex;gap:0.5rem;">
          <button class="btn btn-sm" type="submit">Confirmar</button>
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
