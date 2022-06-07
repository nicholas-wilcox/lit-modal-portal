import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import { List, is } from "immutable";

import ModalController, { KeyedTemplateResult } from "./modal-controller";
import { MapOf, StatefulElement } from "./lib/state";

export type ModalPortalState = {
  modalStack: List<KeyedTemplateResult>,
};

@customElement("modal-portal")
export default class ModalPortal extends LitElement implements StatefulElement<ModalPortalState> {
  static styles = css`
    #portal {
      isolation: isolate;
    }
  `;

  private modalC: ModalController = ModalController.getInstance();

  @state()
  modalStack: List<KeyedTemplateResult> = List();

  portalRef: Ref<HTMLElement> = createRef();

  get modalNodes(): HTMLCollection | undefined {
    return this.portalRef.value?.children;
  }

  constructor() {
    super();
    this.modalC.attach(this);
  }

  offerState(newState: MapOf<ModalPortalState>) {
    if (!is(this.modalStack, newState.get("modalStack"))) {
      this.modalStack = newState.get("modalStack");
      if (this.modalStack.size > 0) {
        document.querySelector("body").classList.add("modal-portal-active");
      } else {
        document.querySelector("body").classList.remove("modal-portal-active");
      }
    }
  }

  /**
   * Looks for the div#portal in the event's path, and removes the modal found in the chain.
   */
  protected removeModal = (e: Event) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    // Locate portal in event path and grab child modal-node.
    const eventPath = e.composedPath();
    const portalEventPathIndex = eventPath.findIndex(el => el === this.portalRef.value);
    if (portalEventPathIndex < 1) {
      console.warn('Could not locate modal portal at appropriate depth in the @removeModal event path');
    } else {
      const modalNode = eventPath[portalEventPathIndex - 1];
      this.modalC.removeByNode(modalNode);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('removeModal', this.removeModal);
  }

  render() {
    return html`
      <div id="portal" ${ref(this.portalRef)}>
        ${repeat(
          this.modalStack?.values(),
          modal => modal.key,
          modal => html`<div class="modal-node">${modal}</div>`
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'modal-portal': ModalPortal;
  }
}
