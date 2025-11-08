import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  SEARCH_INPUT_PLACEHOLDER,
  SEARCH_POPULAR_TITLE,
  SEARCH_POPULAR_TEXT,
} from '../shared/constants';

@customElement('page-search')
export class PageSearch extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="flow-column">
        <input class="input" placeholder=${SEARCH_INPUT_PLACEHOLDER} />
        <div class="card">
          <div class="chip-muted">${SEARCH_POPULAR_TITLE}</div>
          <p>${SEARCH_POPULAR_TEXT}</p>
        </div>
      </section>
    `;
  }
}
