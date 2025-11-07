import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigate } from '../router';

@customElement('page-post')
export class PagePost extends LitElement {
  @property({ attribute: false }) params?: { id?: string };

  static styles = css`
    .back {
      font-size: 0.8rem;
      color: var(--muted-foreground);
      cursor: pointer;
      margin-bottom: 0.4rem;
    }
  `;

  private goBack() {
    navigate('/feed');
  }

  render() {
    const id = this.params?.id ?? '';
    return html`
      <div class="back" @click=${this.goBack}>← Volver al feed</div>
      <div class="card">
        <div class="chip-muted">Receta ${id}</div>
        <h2>Detalle de la receta</h2>
        <p>Ingredientes, pasos y comentarios de la comunidad.</p>
      </div>
    `;
  }
}
