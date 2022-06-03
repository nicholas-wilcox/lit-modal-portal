import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./modal-backdrop.ts";

@customElement("modal-overlay")
export default class ModalOverlay extends LitElement {
  static styles = css`
    .modal-container {
      bottom: 0;
      left: 0;
      overflow-y: auto;
      position: absolute;
      right: 0;
      top: 0;
    }
  ` as CSSResultGroup;

  @property()
  label: string = "";

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
}
