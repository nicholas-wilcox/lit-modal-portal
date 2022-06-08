import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import LitDialog from '../src/lib/lit-dialog';

@customElement('form-modal')
export default class FormModal extends LitDialog {
  static styles = [
    LitDialog.styles,
    css`
      form {
        background: white;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 2px solid black;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .button-row {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
      }
    `
  ];

  @property({ attribute: false })
  submitCallback: Function | undefined;

  handleSubmit() {
    const fd = new FormData(this.shadowRoot.querySelector('form'));
    const obj = {};
    fd.forEach((value, key) => obj[key] = value);
    this.submitCallback(obj);
  }

  render() {
    return html`
      <dialog ${ref(this.dialogRef)}
        class=${classMap(this.classes)}
        size=${this.size}
        aria-labelledby="${this.label}"
        aria-modal="true">
        <form method="dialog">
          <label for="example-select">Pick something!</label>
          <select name="selection" id="example-select">
            <option value="asdf">asdf</option>
            <option value="1234">1234</option>
            <option value="Password123!">Password123!</option>
          </select>
          <label for="text-input">Input something!</label>
          <input name="text-input" id="text-input" autofocus type="text">
          <div class="button-row">
            <button type="button" @click=${() => this.close()} autofocus>Cancel</button>
            <button type="submit" @click=${() => this.handleSubmit()}>Submit</button>
          </div>
        </form>
      </dialog>
    `;
  }
}
