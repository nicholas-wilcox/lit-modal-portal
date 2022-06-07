import {
  __decorateClass
} from "./chunk-S65R2BUY.js";

// src/lib/lit-dialog.ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef } from "lit/directives/ref.js";
var LitDialog = class extends LitElement {
  constructor() {
    super(...arguments);
    this.dialogRef = createRef();
    this.label = "";
  }
  get dialog() {
    return this.dialogRef.value;
  }
  close() {
    var _a;
    (_a = this.dialog) == null ? void 0 : _a.close();
  }
  onDialogClose() {
    this.dispatchEvent(new Event("removeModal", { bubbles: true, composed: true }));
  }
  firstUpdated() {
    this.dialog.showModal();
    this.dialog.addEventListener("click", (e) => this.onClick(e));
    this.dialog.addEventListener("close", () => this.onDialogClose());
  }
  onClick(event) {
    if (event.target === this.dialog) {
      this.close();
    }
  }
  render() {
    return html`
      <dialog ${ref(this.dialogRef)} aria-labelledby="${this.label}" aria-modal="true">
        <slot></slot>
      </dialog>
    `;
  }
};
__decorateClass([
  property()
], LitDialog.prototype, "label", 2);
LitDialog = __decorateClass([
  customElement("lit-dialog")
], LitDialog);

export {
  LitDialog
};
