import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, Ref } from 'lit/directives/ref.js';

import './demo-intro';
import './demo-reactive';

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
  showModal4: boolean = false;

  dialogRef: Ref<HTMLDialogElement> = createRef();

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

  render() {
    return html`
      <h1>lit-modal-portal Demo</h1>
      <hr></hr>
      <demo-intro></demo-intro>
      <demo-reactive></demo-reactive>
    `;
  }
}
