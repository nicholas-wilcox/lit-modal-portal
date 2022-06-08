import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import LitDialog from '../src/lib/lit-dialog';

@customElement('styled-dialog')
export default class StyledDialog extends LitDialog {
  static styles = [
    LitDialog.styles,
    css`
      dialog::backdrop {
        --lit-dialog-backdrop-bg: hsl(90 100% 50% / 0.4);
      }

      .content {
        background: white;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 2px solid black;
        max-width: 480px;
      }
    `
  ];

  render() {
    return html`
      <dialog ${ref(this.dialogRef)}
        class=${classMap(this.classes)}
        size=${this.size}
        aria-labelledby="${this.label}"
        aria-modal="true">
        <div class="content">
          <p>
            This modal has a green backdrop. This is accomplished by extending the LitDialog
            class, inheriting its styles, and adding a rule for the <code>::backdrop</code>
            pseudo-element that declares a custom property used in LitDialog's styles.
          </p>
          <button type="button" @click=${() => this.close()} autofocus>Cancel</button>
        </div>
      </dialog>
    `;
  }
}
