import { LitElement, html } from 'lit';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { customElement, state, property } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { portal } from '../src/portal';
import './confirmation-dialog';

const modalStyles: StyleInfo = {
  position: 'fixed',
  background: 'hsl(0deg 0% 0% / 0.4)',
  inset: 0,
  padding: '1rem',
};

const modalContentStyles: StyleInfo = {
  background: 'white',
  padding: '1rem',
};

@customElement('demo-modals')
export class DemoModals extends LitElement {
  @state()
  enableModalPortal = false;

  @property({ attribute: false })
  dialogRef = createRef<HTMLDialogElement>();

  @property({ attribute: false })
  confirmationDialogRef = createRef<HTMLDialogElement>();

  @state()
  confirmationResponse: unknown;

  render() {
    return html`
      <h2>Modals</h2>
      <p>
        The <code>portal</code> directive can be used to display modal content in the same way as
        React's <code>createPortal</code> function. In other words, simply target
        <code>document.body</code>. (Although you may prefer to create a dedicated
        <code>&lt;div&gt;</code> within the <code>&lt;body&gt;</code> and target that element
        instead.)
      </p>

      <!-- Showing a modal based on a boolean flag -->
      <p>The button below will enable a portal that contains modal content.</p>
      <button @click=${() => (this.enableModalPortal = true)}>Show Modal</button>
      ${when(this.enableModalPortal, () =>
        portal(
          html`<div style=${styleMap(modalStyles)}>
            <div style=${styleMap(modalContentStyles)}>
              <p>
                This is the modal. It is a <code>&lt;div&gt;</code> with fixed positioning, zero
                insets, and a slightly transparent background color.
              </p>
              <button @click=${() => (this.enableModalPortal = false)}>Close Modal</button>
            </div>
          </div>`,
          document.body,
        ),
      )}

      <!-- Imperatively showing a dialog -->
      <h3>Dialogs without <code>lit-modal-portal</code></h3>
      <p>
        Instead of using this package, your requirements may be better satisfied by the
        <code>&lt;dialog&gt;</code> element, also known as the <code>HTMLDialogElement</code>.
        Dialogs render their content on the
        <a href="https://developer.mozilla.org/en-US/docs/Glossary/Top_layer" target="_blank"
          >top layer</a
        >, which uses a separate stacking context that renders on top of all other content in the
        viewport.
      </p>
      <p>
        Rather than conditionally include a portal based on a boolean flag, you can simply render
        the <code>&lt;dialog&gt;</code> and imperatively call the
        <a
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal"
          ><code>HTMLDialogElement.showModal()</code> method</a
        >. The button below does exactly that by using a
        <a
          target="_blank"
          href="https://lit.dev/docs/templates/directives/#referencing-rendered-dom"
          >Lit ref</a
        >
        that is attached to the <code>HTMLDialogElement</code> element.
      </p>
      <button @click=${() => this.dialogRef.value?.showModal()}>Show Dialog</button>
      <dialog ${ref(this.dialogRef)}>
        <p>
          This is a paragraph in a <code>&lt;dialog&gt;</code> element. You are seeing it because
          its <code>showModal</code> function was called.
        </p>
        <p>You may close the dialog by clicking the button below or by pressing the Escape key.</p>
        <button @click=${() => this.dialogRef.value?.close()}>Close Dialog</button>
      </dialog>

      <h3>Confirmation Dialogs</h3>
      <p>You can even create a confirmation dialog without using <code>lit-modal-portal</code>.</p>
      <button @click=${() => this.confirmationDialogRef.value?.showModal()}>
        Show Confirmation Dialog
      </button>
      <dialog
        ${ref(this.confirmationDialogRef)}
        @close=${() => {
          this.confirmationResponse = this.confirmationDialogRef.value?.returnValue;
        }}
      >
        <p>This is the confirmation dialog</p>
        <button @click=${() => this.confirmationDialogRef.value?.close('cancelled')}>Cancel</button>
        <button @click=${() => this.confirmationDialogRef.value?.close('confirmed')}>
          Confirm Action
        </button>
      </dialog>
      ${when(
        this.confirmationResponse,
        () => html`<span><strong>Return value:</strong> ${this.confirmationResponse}</span>`,
      )}
      <p>
        The <code>&lt;dialog&gt;</code> shown by the button above contains buttons that close
        itself, but with difference return values. (See
        <a
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close"
          >MDN documentation</a
        >
        on the <code>HTMLDialogElement.close()</code> method.) The component that manages this
        section of the demo hooks into the
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event"
          ><code>close</code> event</a
        >
        to captures and conditionally render the return value. Note that closing the dialog with the
        Escape key does not change the <code>returnValue</code> attribute of the dialog.
      </p>
      <p>
        Consider that there are many different ways that you might want to implement and use a
        modal. You may want to avoid using a <code>&lt;dialog&gt;</code> tag, or you may prefer a
        component that accepts callback functions over a component that dispatches events. For these
        reasons, I've decided to focus on the utility of the <code>portal</code> directive and not
        provide any modal components in this package's exports.
      </p>
    `;
  }
}
