import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { portal } from '../src/portal';

import '../src/lib/confirm-modal.ts';
import './large-modal.ts';
import './nested-modal.ts';

@customElement('app-root')
export class AppRoot extends LitElement {
  private clockInterval?: ReturnType<typeof setInterval>;

  @state()
  showCase1Modal: boolean = false;

  @state()
  showCase2Modal: boolean = false;

  @state()
  showCase3Modal: boolean = false;

  @state()
  showCase4Modal: boolean = false;

  @state()
  currentTime: Date = new Date();

  connectedCallback(): void {
    super.connectedCallback();
    this.clockInterval = setInterval(() => this.currentTime = new Date(), 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this.clockInterval);
    this.clockInterval = undefined;
  }

  case1Portal() {
    return portal(
      this.showCase1Modal,
      html`<confirm-modal .confirmCallback=${() => console.log('Action confirmed')}></confirm-modal>`,
      () => this.showCase1Modal = false
    );
  }

  case2Portal() {
    return portal(
      this.showCase2Modal,
      html`
        <confirm-modal .confirmCallback=${() => console.log('Action confirmed')}>
          This value comes from the application root: ${this.currentTime.toString()}
        </confirm-modal>
      `,
      () => this.showCase2Modal = false
    );
  }

  case3Portal() {
    return portal(
      this.showCase3Modal,
      html`<large-modal></large-modal>`,
      () => this.showCase3Modal = false
    );
  }

  case4Portal() {
    return portal(
      this.showCase4Modal,
      html`<nested-modal></nested-modal>`,
      () => this.showCase4Modal = false
    );
  }

  render() {
    return html`
      <h1>lit-modal-portal Demo</h1>
      <hr>
      <div>
        <h2>Case 1: Confirmation Modal</h2>
        <button @click=${() => this.showCase1Modal = true}>Show Modal</button>
      </div>
      <div>
        <h2>Case 2: Reactive Update</h2>
        <div>${this.currentTime.toString()}</div>
        <button @click=${() => this.showCase2Modal = true}>Show Modal</button>
      </div>
      <div>
        <h2>Case 3: Large Modal</h2>
        <button @click=${() => this.showCase3Modal = true}>Show Modal</button>
      </div>
      <div>
        <h2>Case 4: Nested Modals</h2>
        <button @click=${() => this.showCase4Modal = true}>Show Modal</button>
      </div>
      ${this.case1Portal()}
      ${this.case2Portal()}
      ${this.case3Portal()}
      ${this.case4Portal()}
    `;
  }
};

