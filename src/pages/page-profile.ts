import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigate } from '../router';
import '../components/app-avatar';

@customElement('page-profile')
export class PageProfile extends LitElement {
  @property({ attribute: false }) params?: { id?: string };

  createRenderRoot() {
    return this;
  }

  private editProfile() {
    navigate('/profile-settings');
  }

  private openDm() {
    navigate('/dm/me');
  }

  render() {
    const id = this.params?.id ?? 'me';
    return html`
      <section class="flow-column">
        <div class="card">
          <div style="display:flex;gap:0.75rem;align-items:center;">
            <app-avatar .size=${64}></app-avatar>
            <div>
              <h2>@${id}</h2>
              <div class="chip-muted">Datos de visualización del perfil</div>
            </div>
          </div>
          <div style="display:flex;gap:0.4rem;margin-top:0.5rem;">
            <button class="btn-outline btn-pill btn-sm" @click=${this.openDm}>
              Mensaje
            </button>
            <button class="btn-outline btn-pill btn-sm" @click=${this.editProfile}>
              Editar perfil
            </button>
          </div>
        </div>

        <div class="card">
          <div class="chip-muted">Posts</div>
          <p>Rejilla/tabla de posts del usuario.</p>
        </div>
      </section>
    `;
  }
}
