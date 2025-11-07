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
    .card {
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: radial-gradient(circle at top left, var(--accent-soft), #020817f7);
      box-shadow: var(--shadow-soft);
      padding: 0.75rem;
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
        <div class="chip-muted">Post ${id}</div>
        <h2>Detalle del post</h2>
        <p>Contenido completo, comentarios e interacciones.</p>
      </div>
    `;
  }
}
