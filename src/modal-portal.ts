import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { List, is } from 'immutable';

import modalC, { KeyedTemplateResult } from './modal-controller';
import { MapOf, StatefulElement } from './lib/state';

/** @internal State accepted by the [[ModalPortal]]. */
export type ModalPortalState = {
  modalStack: List<KeyedTemplateResult>;
};

/**
 * A component that manages the rendering of Lit templates given by the [[ModalController]].
 * It should be placed at the end of the `<body>` tag in you application like so:
 *
 * ```html
 *  <!DOCTYPE html>
 *  <html>
 *    <head>
 *      <!-- meta, scripts, etc. -->
 *    </head>
 *    <body>
 *      <my-lit-app></my-lit-app>
 *      <modal-portal></modal-portal>
 *    </body>
 *  </html>
 * ```
 *
 * This element listens to the `"removeModal"` event.
 * Upon receiving the event, it inspects the event's `composedPath()` the determine
 * which modal the event came from and removes that one.
 */
@customElement('modal-portal')
export default class ModalPortal extends LitElement implements StatefulElement<ModalPortalState> {
  static styles = css`
    #portal {
      isolation: isolate;
    }
  `;

  @state()
  private modalStack: List<KeyedTemplateResult> = List();

  private portalRef: Ref<HTMLElement> = createRef();

  /**
   * A list of the modals currently present in the DOM. Used by the [[ModalController]].
   */
  get modalNodes(): HTMLCollection | undefined {
    return this.portalRef.value?.children;
  }

  constructor() {
    super();
    modalC.attach(this);
  }

  /**
   * Used by the [[ModalController]] when a modal is added or removed.
   * Updates the `<body>` element to have the `"modal-portal-active"` class
   * precisely when the `<modal-portal>` contains at least one modal.
   */
  offerState(newState: MapOf<ModalPortalState>) {
    if (!is(this.modalStack, newState.get('modalStack'))) {
      this.modalStack = newState.get('modalStack');
      if (this.modalStack.size > 0) {
        document.querySelector('body').classList.add('modal-portal-active');
      } else {
        document.querySelector('body').classList.remove('modal-portal-active');
      }
    }
  }

  /**
   * Inspects the `composedPath()` of the given event and removes the modal that
   * intersects with the path, if any.
   */
  protected removeModal = (e: Event) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    // Locate portal in event path and grab child modal-node.
    const eventPath = e.composedPath();
    const portalEventPathIndex = eventPath.findIndex((el) => el === this.portalRef.value);
    if (portalEventPathIndex < 1) {
      console.warn(
        'Could not locate modal portal at appropriate depth in the @removeModal event path'
      );
    } else {
      const modalNode = eventPath[portalEventPathIndex - 1];
      modalC.removeByNode(modalNode);
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('removeModal', this.removeModal);
  }

  render() {
    return html`
      <div id="portal" ${ref(this.portalRef)}>
        ${repeat(
          this.modalStack?.values(),
          (modal) => modal.key,
          (modal) => html`<div class="modal-node">${modal}</div>`
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
