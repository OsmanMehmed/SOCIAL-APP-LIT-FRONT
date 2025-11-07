import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/app-mini-profile';
import '../components/app-post-card';

@customElement('page-feed')
export class PageFeed extends LitElement {
  static styles = css`
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(220px, 0.9fr);
      gap: 0.9rem;
    }
    @media (max-width: 800px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .flow-column {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
  `;

  render() {
    return html`
      <div class="grid">
        <section class="flow-column">
          <app-post-card
            postId="1"
            username="ana.cocina"
            caption="Pasta fresca con salsa de tomate asado."
          ></app-post-card>
          <app-post-card
            postId="2"
            username="osman.chef"
            caption="Bowl de desayuno con avena, frutos rojos y miel."
          ></app-post-card>
        </section>
        <aside class="sidebar">
          <app-mini-profile></app-mini-profile>
          <div class="card">
            <div class="chip-muted">Explora sabores</div>
            <div style="margin-top:0.3rem;">
              Busca recetas, sigue a otros chefs y guarda tus platos favoritos.
            </div>
          </div>
        </aside>
      </div>
    `;
  }
}
