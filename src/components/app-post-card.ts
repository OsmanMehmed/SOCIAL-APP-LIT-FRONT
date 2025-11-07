import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigate } from '../router';

@customElement('app-post-card')
export class AppPostCard extends LitElement {
  @property() postId = '';
  @property() username = 'usuario';
  @property() caption = 'Descripción del post';
  @property() image = '';

  static styles = css`
    .card {
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: radial-gradient(circle at top left, var(--accent-soft), #020817f7);
      box-shadow: var(--shadow-soft);
      padding: 0.75rem;
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
      background: #111827;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: var(--muted-foreground);
    }
    .actions {
      display: flex;
      gap: 0.4rem;
      margin-top: 0.25rem;
      font-size: 0.9rem;
      color: var(--muted-foreground);
    }
    .card-click {
      cursor: pointer;
    }
  `;

  private openPost() {
    navigate(`/post/${this.postId}`);
  }

  render() {
    return html`
      <article class="card card-click" @click=${this.openPost}>
        <div class="header">
          <app-avatar .size=${28}></app-avatar>
          <div class="username">@${this.username}</div>
        </div>
        <div class="image">
          ${this.image ? html`<img src=${this.image} />` : 'Imagen del post'}
        </div>
        <div class="caption">${this.caption}</div>
        <div class="actions">
          <span>❤ 120</span>
          <span>💬 8</span>
          <span>⤴ Guardar</span>
        </div>
      </article>
    `;
  }
}
