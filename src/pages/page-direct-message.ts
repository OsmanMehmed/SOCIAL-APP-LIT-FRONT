import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('page-direct-message')
export class PageDirectMessage extends LitElement {
  @property({ attribute: false }) params?: { id?: string };
  @state() draft = '';

  static styles = css`
    .thread {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 0.5rem;
    }
    .msg {
      padding: 0.35rem 0.55rem;
      border-radius: var(--radius-md);
      background: rgba(15, 23, 42, 0.98);
      font-size: 0.8rem;
      max-width: 70%;
    }
    .me {
      align-self: flex-end;
      background: var(--accent);
      color: #020817;
    }
    form {
      display: flex;
      gap: 0.35rem;
      align-items: center;
    }
    input {
      flex: 1;
    }
  `;

  private send(e: Event) {
    e.preventDefault();
    this.draft = '';
  }

  private onInput(e: Event) {
    this.draft = (e.target as HTMLInputElement).value;
  }

  render() {
    const id = this.params?.id ?? '';
    return html`
      <section>
        <div class="chip-muted">DM con usuario ${id}</div>
        <div class="thread">
          <div class="msg">Mensaje anterior del contacto.</div>
          <div class="msg me">Mensaje enviado por ti.</div>
        </div>
        <form @submit=${this.send}>
          <input
            class="input"
            placeholder="Escribe un mensaje..."
            .value=${this.draft}
            @input=${this.onInput}
          />
          <button class="btn btn-sm" type="submit">Enviar</button>
        </form>
      </section>
    `;
  }
}
