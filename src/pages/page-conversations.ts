import { CONSTANTS } from "./../shared/constants";
import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import "../components/app-mini-profile";

@customElement("page-conversations")
export class PageConversations extends LitElement {
  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .component-container {
        justify-self: center;
        width: 23em;
        cursor: pointer;
      }
    `,
  ];

  private openDm(id: string) {
    navigate(`/dm/${id}`);
  }

  render() {
    const chefId = CONSTANTS.CONVERSATIONS_MSG1_USERNAME.replace(
      CONSTANTS.USERNAME_PREFIX,
      ""
    );
    const teamId = CONSTANTS.CONVERSATIONS_MSG2_USERNAME.replace(
      CONSTANTS.USERNAME_PREFIX,
      ""
    );

    return html`
      <section class="flow-column component-container">
        <div class="card" @click=${() => this.openDm("1")}>
          <app-mini-profile
            .username=${CONSTANTS.CONVERSATIONS_MSG1_USERNAME}
            .subtitle=${CONSTANTS.CONVERSATIONS_MSG1_SUBTITLE}
            .profileId=${chefId}
            .supressProfileRoute=${true}
            .noSubtitle=${true}
          ></app-mini-profile>
          <p>${CONSTANTS.CONVERSATIONS_MSG1_TEXT}</p>
        </div>
        <div class="card" @click=${() => this.openDm("2")}>
          <app-mini-profile
            .username=${CONSTANTS.CONVERSATIONS_MSG2_USERNAME}
            .profileId=${teamId}
            .supressProfileRoute=${true}
            .noSubtitle=${true}
          ></app-mini-profile>
          <p>${CONSTANTS.CONVERSATIONS_MSG2_TEXT}</p>
        </div>
      </section>
    `;
  }
}
