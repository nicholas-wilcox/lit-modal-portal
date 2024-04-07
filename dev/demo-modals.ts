import { LitElement, html } from 'lit';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { customElement, state } from 'lit/decorators.js';
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

  dialogRef = createRef<HTMLDialogElement>();

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
      <p>
        Alternatively, you can use the <code>portal</code> directive with
        <code>&lt;dialog&gt;</code> elements. Rather than conditionally including a portal based on
        a boolean flag, you can simply render the <code>&lt;dialog&gt;</code> in the portal and
        imperatively call the
        <a
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal"
          ><code>HTMLDialogElement.showModal()</code> method</a
        >.
      </p>
      <p>
        The button below does exactly that by using a
        <a
          target="_blank"
          href="https://lit.dev/docs/templates/directives/#referencing-rendered-dom"
          >Lit ref</a
        >
        that is attached to the <code>&lt;dialog&gt;</code> element used in the portal.
      </p>
      <button @click=${() => this.dialogRef.value?.showModal()}>Show Dialog</button>
      ${portal(
        html`<dialog ${ref(this.dialogRef)}>
          <p>
            This is a paragraph in a <code>&lt;dialog&gt;</code> element. You are seeing it because
            its <code>showModal</code> function was called.
          </p>
          <p>
            You may close the dialog by clicking the button below or by pressing the Escape key.
          </p>
          <button @click=${() => this.dialogRef.value?.close()}>Close Dialog</button>
        </dialog>`,
        document.body,
      )}

      <h3>Confirmation Dialogs</h3>
      <p>Putting all of this together, we can create a confirmation dialog component.</p>
      <button @click=${() => this.confirmationDialogRef.value?.showModal()}>
        Show Confirmation Dialog
      </button>
      ${portal(
        html`<confirmation-dialog
          @close=${() => {
            this.confirmationResponse = this.confirmationDialogRef.value?.returnValue;
          }}
          .dialogRef=${this.confirmationDialogRef}
        ></confirmation-dialog>`,
        document.body,
      )}
      ${when(
        this.confirmationResponse,
        () => html`<span><strong>Return value:</strong> ${this.confirmationResponse}</span>`,
      )}
      <p>
        The component shown with the button above accepts a Lit ref as a property. This means that
        the parent component can call the dialog's <code>showModal</code> method to open the dialog.
        The <code>&lt;confirmation-dialog&gt;</code> component that contains the dialog has two
        buttons that each close it, but with a different return value. (See
        <a
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close"
          >MDN documentation</a
        >
        on the <code>HTMLDialogElement.close()</code> method.)
      </p>
      <p>
        Additionally, the
        <code>&lt;confirmation-dialog&gt;</code> component listens to and forwards the
        <code>&lt;dialog&gt;</code>'s <code>close</code> event. This allows the parent component to
        react and update based on the return value. Note that closing the dialog with the Escape key
        does not change the <code>returnValue</code> attribute of the dialog.
      </p>
      <p>
        On a final note, consider that there are many different ways that you might want to
        implement and use a modal. You may want to avoid using a <code>&lt;dialog&gt;</code> tag, or
        you may prefer a component that accepts callback functions over a component that dispatches
        events. For these reasons, I've decided to focus on the utility of the
        <code>portal</code> directive and not provide any modal components in this package's
        exports.
      </p>
    `;
  }
}
