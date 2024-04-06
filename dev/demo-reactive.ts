import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('demo-reactive')
export class DemoReactive extends LitElement {
  render() {
    return html`<h2>Reactive Updates</h2>`;
  }
}
