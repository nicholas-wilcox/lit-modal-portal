import {
  __decorateClass
} from "./chunk-S65R2BUY.js";

// src/lib/modal-backdrop.ts
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
var ModalBackdrop = class extends LitElement {
  render() {
    return html`
      <div class="modal-backdrop" aria-labelledby="${this.label}" role="dialog" aria-modal="true">
        <slot></slot>
      </div>
    `;
  }
};
ModalBackdrop.styles = css`
    .modal-backdrop {
      background-color: hsl(0deg 0% 0% / 75%);
      position: fixed;
      inset: 0;
    }
  `;
__decorateClass([
  property()
], ModalBackdrop.prototype, "label", 2);
ModalBackdrop = __decorateClass([
  customElement("modal-backdrop")
], ModalBackdrop);

export {
  ModalBackdrop
};
