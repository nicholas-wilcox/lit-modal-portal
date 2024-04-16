import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, Ref } from 'lit/directives/ref.js';

import './demo-intro';
import './demo-reactive';
import './demo-modals';

@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = [
    css`
      :host {
        font-size: 1.125rem;
        font-family: sans-serif;
        line-height: 1.5;
      }

      #wrapper {
        max-width: 80ch;
      }
    `,
  ];

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
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div id="wrapper">
        <h1>lit-modal-portal Demo</h1>
        <hr></hr>
        <demo-intro></demo-intro>
        <demo-reactive></demo-reactive>
        <demo-modals></demo-modals>
      </div>
    `;
  }
}
