import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("modal-backdrop")
export default class ModalBackdrop extends LitElement {
  static styles = css`
    .modal-backdrop {
      background-color: hsl(0deg 0% 0% / 75%);
      position: fixed;
      inset: 0;
    }
  `;

  @property()
  label: string;

  render() {
    return html`
      <div class="modal-backdrop" aria-labelledby="${this.label}" role="dialog" aria-modal="true">
        <slot></slot>
      </div>
    `;
  }
}
