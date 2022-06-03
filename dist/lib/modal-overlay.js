import "../chunk-HKORPZST.js";
import {
  __decorateClass
} from "../chunk-S65R2BUY.js";

// src/lib/modal-overlay.ts
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
var ModalOverlay = class extends LitElement {
  constructor() {
    super(...arguments);
    this.label = "";
  }
  closeModal() {
    this.dispatchEvent(new Event("closeModal", { bubbles: true, composed: true }));
  }
  render() {
    return html`
      <modal-backdrop label=${this.label}>
        <div class="modal-container">
          <slot></slot>
        </div>
      </modal-backdrop>
    `;
  }
};
ModalOverlay.styles = css`
    .modal-container {
      bottom: 0;
      left: 0;
      overflow-y: auto;
      position: absolute;
      right: 0;
      top: 0;
    }
  `;
__decorateClass([
  property()
], ModalOverlay.prototype, "label", 2);
ModalOverlay = __decorateClass([
  customElement("modal-overlay")
], ModalOverlay);
export {
  ModalOverlay as default
};
