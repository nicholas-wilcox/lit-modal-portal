import { LitElement, css, html, PropertyValueMap } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('example-component')
export class ExampleComponent extends LitElement {
  static styles = [
    css`
      #wrapper {
        border: 1px solid black;
        padding: 0.25rem;
      }

      h3 {
        margin: 0;
      }
    `,
  ];

  @state()
  name: string = 'Your name here';

  constructor() {
    super();
    console.log('ExampleComponent::constructor()');
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('ExampleComponent::connectedCallback()');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('ExampleComponent::disconnectedCallback()');
  }

  firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    console.log('ExampleComponent::firstUpdated()');
  }

  updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    console.log('ExampleComponent::updated()');
  }

  willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    console.log('ExampleComponent::willUpdate()');
  }

  render() {
    return html`<div id="wrapper">
      <h3>Example component</h3>
      <p>
        This component is a modified version of the <code>&lt;name-tag&gt;</code> component that is
        developed in
        <a target="_blank" href="https://lit.dev/tutorials/intro-to-lit/#4"
          >Lit's interactive tutorial</a
        >.
      </p>
      <p>Hello, ${this.name}</p>
      <input @input=${this.changeName} placeholder="Enter your name" />
    </div>`;
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.name = input.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'example-component': ExampleComponent;
  }
}
