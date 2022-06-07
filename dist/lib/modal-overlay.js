import "../chunk-U5RFDWIT.js";
import {
  __decorateClass
} from "../chunk-S65R2BUY.js";

// src/lib/modal-overlay.ts
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
var ModalOverlay = class extends LitElement {
  constructor() {
    super(...arguments);
    this.label = "";
    this.flexCentering = false;
    this.containerStyles = { padding: "1rem" };
  }
  get classes() {
    return {
      "modal-container": true,
      "flex": this.flexCentering
    };
  }
  render() {
    return html`
      <modal-backdrop label=${this.label}>
        <div class=${classMap(this.classes)} style=${styleMap(this.containerStyles)}>
          <slot></slot>
        </div>
      </modal-backdrop>
    `;
  }
};
ModalOverlay.styles = [
  css`
      .modal-container {
        inset: 0;
        overflow-y: auto;
        position: absolute;
      }

      .modal-container.flex {
        align-items: center;
        display: flex;
        justify-content: center;
      }
    `
];
__decorateClass([
  property()
], ModalOverlay.prototype, "label", 2);
__decorateClass([
  property({ type: Boolean, attribute: false })
], ModalOverlay.prototype, "flexCentering", 2);
__decorateClass([
  property({ type: Object, attribute: false })
], ModalOverlay.prototype, "containerStyles", 2);
ModalOverlay = __decorateClass([
  customElement("modal-overlay")
], ModalOverlay);
export {
  ModalOverlay as default
};
