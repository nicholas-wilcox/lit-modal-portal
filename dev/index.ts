import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { portal } from '../src/portal';
import modalC from '../src/modal-controller';

import '../src/lib/confirm-modal.ts';
import './large-modal.ts';
import './nested-modal.ts';
import './form-modal.ts';
import './styled-dialog.ts';

const mockConfirmAction = () => console.log('Action confirmed');

@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = [
    css`
      :host {
        font-size: 1.125rem;
      }

      dialog::backdrop {
        --lit-dialog-backdrop-bg: hsl(90 100% 50% / 0.4);
      }

      p {
        max-width: 65ch;
      }

      code {
        font-family: monospace;
        font-weight: bold;
      }
    `,
  ];

  private clockInterval?: ReturnType<typeof setInterval>;

  @state()
  showCase2Modal: boolean = false;

  @state()
  currentTime: Date = new Date();

  get timeString(): string {
    return this.currentTime.toLocaleTimeString([], { timeStyle: 'medium' });
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.clockInterval = setInterval(() => (this.currentTime = new Date()), 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this.clockInterval);
    this.clockInterval = undefined;
  }

  pushCase1Modal() {
    modalC.push(
      html`
        <confirm-modal
          .confirmCallback=${mockConfirmAction}
          .secondaryAction=${() => console.log('Secondary action')}
        ></confirm-modal>
      `
    );
  }

  case2Portal() {
    return portal(
      this.showCase2Modal,
      html`
        <confirm-modal .confirmCallback=${mockConfirmAction}>
          <p>This value comes from the application root: ${this.timeString}</p>
        </confirm-modal>
      `,
      () => (this.showCase2Modal = false)
    );
  }

  pushCase3Modal() {
    modalC.push(html`<large-modal></large-modal>`);
  }

  pushCase4Modal() {
    modalC.push(html`<nested-modal></nested-modal>`);
  }

  pushCase5Modal() {
    modalC.push(
      html`
        <confirm-modal .confirmCallback=${mockConfirmAction} .enableLightDismiss=${false}>
          <p>You cannot close this modal by clicking out of bounds in the backdrop area.</p>
        </confirm-modal>
      `
    );
  }

  pushCase6Modal() {
    modalC.push(
      html`
        <form-modal
          .submitCallback=${(formData: FormData) => {
            this.shadowRoot.querySelector('#form-modal-output').innerHTML =
              JSON.stringify(formData);
          }}
        ></form-modal>
      `
    );
  }

  pushCase7Modal() {
    modalC.push(html`<styled-dialog></styled-dialog>`);
  }

  render() {
    return html`
      <h1>lit-modal-portal Demo</h1>
      <hr />
      <div>
        <h2>Case 1: Confirmation Modal</h2>
        <p>
          A simple example of using <code>ModalController::push()</code> on the provided
          <code>&lt;confirm-modal&gt;</code> component.
        </p>
        <button @click=${() => this.pushCase1Modal()}>Show Modal</button>
      </div>

      <div>
        <h2>Case 2: Reactive Update</h2>
        <p>
          This example uses the <code>portal</code> directive, because it features a template that
          is asynchronously updated by the component that spawned the modal.
        </p>
        <div>${this.timeString}</div>
        <button @click=${() => (this.showCase2Modal = true)}>Show Modal</button>
      </div>

      <div>
        <h2>Case 3: Large Modal</h2>
        <p>This is an example of a large modal that should exceed the height of the viewport.</p>
        <button @click=${() => this.pushCase3Modal()}>Show Modal</button>
      </div>

      <div>
        <h2>Case 4: Nested Modals</h2>
        <p>This modal contains a component that can push a <emph>second</emph> on top of itself.</p>
        <button @click=${() => this.pushCase4Modal()}>Show Modal</button>
      </div>

      <div>
        <h2>Case 5: Light Dismiss Override</h2>
        <p>
          This modal disables a feature present in the other examples, in which a user can close a
          modal by clicking in the backdrop area surrounding the content of the modal.
        </p>
        <p>
          This feature is disabled by default for the
          <code>&lt;lit-dialog&gt;</code> component, but it is exposed by
          <code>&lt;confirm-modal&gt;</code> and enabled by default there.
        </p>
        <button @click=${() => this.pushCase5Modal()}>Show Modal</button>
      </div>

      <div>
        <h2>Case 6: Handling Form Submission</h2>
        <p>
          This example shows how to extract user input from the modal. There isn't anything special
          about the library components that facilitate this pattern, as it works simply by passing a
          callback function into the component that manages the form.
        </p>
        <p>
          I ran into some issues when wrapping a
          <code>&lt;form&gt;</code> element inside of a <code>&lt;slot&gt;</code> in a
          <code>&lt;lit-dialog&gt;</code>. Instead, I extended <code>&lt;lit-dialog&gt;</code> and
          made a subclass <code>&lt;form-modal&gt;</code>.
        </p>
        <button @click=${() => this.pushCase6Modal()}>Show Modal</button>
        <span id="form-modal-output"></span>
      </div>

      <div>
        <h2>Case 7: Styled Modal</h2>
        <p>
          If you have specific reasons to style the
          <code>&lt;dialog&gt;</code> element contained in the
          <code>&lt;lit-dialog&gt;</code> component, then you may wish to extend it as a superclass
          to inherit/override its styles, or even rewrite it entirely.
        </p>
        <button @click=${() => this.pushCase7Modal()}>Show Modal</button>
      </div>
      ${this.case2Portal()}
    `;
  }
}
