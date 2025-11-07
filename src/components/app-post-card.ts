import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigate } from '../router';

@customElement('app-post-card')
export class AppPostCard extends LitElement {
  @property() postId = '';
  @property() username = 'chef';
  @property() caption = 'Descripción de la receta';
  @property() image = '';

  static styles = css`
    .card {
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 179, 71, 0.26);
      background:
        radial-gradient(circle at top left, rgba(255, 75, 58, 0.06), transparent),
        rgba(15, 4, 4, 0.98);
      box-shadow: var(--shadow-soft);
      padding: 0.75rem;
      cursor: pointer;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }
    .username {
      font-size: 0.85rem;
      font-weight: 600;
    }
    .image {
      margin: 0.4rem 0;
      border-radius: var(--radius-md);
      background: #2b0909;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: rgba(255, 204, 196, 0.85);
    }
    .actions {
      display: flex;
      gap: 0.6rem;
      margin-top: 0.25rem;
      font-size: 0.8rem;
      color: var(--muted-foreground);
    }
  `;

  private openPost() {
    navigate(`/post/${this.postId}`);
  }

  render() {
    return html`
      <article class="card" @click=${this.openPost}>
        <div class="header">
          <app-avatar .size=${28}></app-avatar>
          <div class="username">@${this.username}</div>
          <span class="recipe-tag">Receta</span>
        </div>
        <div class="image">
          ${this.image ? html`<img src=${this.image} />` : 'Foto del plato'}
        </div>
        <div class="caption">${this.caption}</div>
        <div class="actions">
          <span>❤ 120</span>
          <span>💬 18</span>
          <span>⭐ Guardar</span>
        </div>
      </article>
    `;
  }
}
