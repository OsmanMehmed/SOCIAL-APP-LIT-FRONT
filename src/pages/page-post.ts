import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigate } from '../router';
import {
  POST_BACK_TO_FEED,
  POST_CHIP_LABEL_PREFIX,
  POST_TITLE,
  POST_BODY,
} from '../shared/constants';

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
      <div class="back" @click=${this.goBack}>${POST_BACK_TO_FEED}</div>
      <div class="card">
        <div class="chip-muted">${POST_CHIP_LABEL_PREFIX} ${id}</div>
        <h2>${POST_TITLE}</h2>
        <p>${POST_BODY}</p>
      </div>
    `;
  }
}
