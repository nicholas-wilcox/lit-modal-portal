import {
  __decorateClass
} from "./chunk-S65R2BUY.js";

// src/lib/lit-dialog.ts
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef } from "lit/directives/ref.js";
import { classMap } from "lit/directives/class-map.js";
var LitDialog = class extends LitElement {
  constructor() {
    super(...arguments);
    this.dialogRef = createRef();
    this.label = "";
    this.enableLightDismiss = false;
    this.size = "small";
    this.unsetStyles = true;
  }
  get dialog() {
    return this.dialogRef.value;
  }
  get classes() {
    return { "unset": this.unsetStyles };
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
    this.dialog.addEventListener("close", () => this.onDialogClose());
    if (this.enableLightDismiss) {
      this.dialog.addEventListener("click", (e) => this.onClick(e));
    }
  }
  onClick(event) {
    if (event.target === this.dialog) {
      this.close();
    }
  }
  render() {
    return html`
      <dialog
        ${ref(this.dialogRef)}
        class=${classMap(this.classes)}
        size=${this.size}
        aria-labelledby="${this.label}"
        aria-modal="true">
        <slot></slot>
      </dialog>
    `;
  }
};
LitDialog.styles = css`
    dialog {
      display: flex;
      justify-content: center;
    }

    dialog.unset {
      border: unset;
      background: unset;
      max-width: unset;
      max-height: unset;
      height: unset;
      width: unset;
      margin: unset;
    }

    dialog::backdrop {
      background: var(--lit-dialog-backdrop-bg, hsl(0 0% 0% / 0.3));
    }

    dialog[size=small] {
      align-items: center;
    }

    dialog[size=large] {
      padding: 4rem;
    }
  `;
__decorateClass([
  property()
], LitDialog.prototype, "label", 2);
__decorateClass([
  property({ type: Boolean, attribute: false })
], LitDialog.prototype, "enableLightDismiss", 2);
__decorateClass([
  property()
], LitDialog.prototype, "size", 2);
__decorateClass([
  property({ type: Boolean, attribute: false })
], LitDialog.prototype, "unsetStyles", 2);
LitDialog = __decorateClass([
  customElement("lit-dialog")
], LitDialog);

export {
  LitDialog
};
