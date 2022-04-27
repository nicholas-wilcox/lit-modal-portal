import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import { List, is } from "immutable";

import ModalController, { KeyedTemplateResult } from "./modal-controller";
import { MapOf, StatefulElement } from "../lib/state";

export type ModalPortalState = {
  modalStack: List<KeyedTemplateResult>,
};

@customElement("modal-portal")
export class ModalPortal extends LitElement implements StatefulElement<ModalPortalState> {
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

  private popOnEscape = (e: KeyboardEvent) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
    // see the end of the article -- this is to ignore the compose key sequences
    // such as creating an emoji or entering Kanji or something like that.
    if (e.isComposing || e.keyCode === 229) {
      return;
    }
    // https://w3c.github.io/uievents/#dom-keyboardeventk-key
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    if ((e.key == "Escape" || e.key == "Esc") && this.modalStack.size > 0) {
      this.modalC.pop();
    }
  }

  /**
   * Looks for the div#portal in the event's path, and removes the modal found in the chain.
   */
  protected closeModal = (e: Event) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    // Locate portal in event path and grab child modal-node.
    const eventPath = e.composedPath();
    const portalEventPathIndex = eventPath.findIndex(el => el === this.portalRef.value);
    if (portalEventPathIndex < 1) {
      console.warn("Could not locate modal portal at appropriate depth in the @closeModal event path");
    } else {
      const modalNode = eventPath[portalEventPathIndex - 1];
      this.modalC.removeByNode(modalNode);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.popOnEscape);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.popOnEscape);
  }

  render() {
    return html`
      <div id="portal" ${ref(this.portalRef)} class="isolate">
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
    "modal-portal": ModalPortal;
  }
}
