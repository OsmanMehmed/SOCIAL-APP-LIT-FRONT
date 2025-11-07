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
      gap: 0.75rem;
    }
    @media (max-width: 800px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .flow-column {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  `;

  render() {
    return html`
      <div class="grid">
        <section class="flow-column">
          <app-post-card
            postId="1"
            username="ana.runner"
            caption="Salida nocturna por la ciudad."
          ></app-post-card>
          <app-post-card
            postId="2"
            username="osman.dev"
            caption="Nuevo diseño de la app."
          ></app-post-card>
        </section>
        <aside class="sidebar">
          <app-mini-profile></app-mini-profile>
          <div class="card">
            <div class="chip-muted">Búsqueda rápida</div>
            <div style="margin-top:0.3rem;">
              Explora perfiles, mensajes y posts desde la barra superior.
            </div>
          </div>
        </aside>
      </div>
    `;
  }
}
