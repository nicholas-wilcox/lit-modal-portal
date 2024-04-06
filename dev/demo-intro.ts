import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './demo-intro-example';

@customElement('demo-intro')
export class DemoIntro extends LitElement {
  render() {
    return html`
      <h2>Introduction</h2>
      <p>
        The <code>lit-modal-portal</code> package provides a <code>portal</code> directive. This
        directive works like
        <a target="_blank" href="https://react.dev/reference/react-dom/createPortal"
          >React's <code>createPortal</code> function</a
        >, in the sense that you provide the content and the target DOM node you want the content
        rendered in. When the <code>portal</code> directive renders, it will create a container
        <code>&lt;div&gt;</code> as a child of the target. The content provided to the directive
        will be rendered in this container using
        <a target="_blank" href="https://lit.dev/docs/api/templates/#render"
          >Lit's <code>render</code> function</a
        >.
      </p>
      <p>
        The <code>portal</code> directive is a custom, asynchronous directive (see
        <a target="_blank" href="https://lit.dev/docs/templates/custom-directives/#async-directives"
          >Lit documentation</a
        >). This means it has a lifecycle and can automatically remove the content (and its
        container) whenever the directive itself is removed.
      </p>
      <p>
        In the component below, there are three buttons that toggle on (i.e. set to
        <code>true</code>) some reactive boolean flags in the component's internal state. Each flag
        is used to optionally render a portal, and the content of each portal contains a button to
        turn the respective boolean flag back to <code>off</code>. Each portal targets the same
        root, which is a <code>&lt;div&gt;</code> that is also in the component.
      </p>
      <demo-intro-example></demo-intro-example>
      <p>
        This results in a stack. A portal's content is added to (or removed from) the stack when the
        respective <code>portal</code> directive is included (or excluded) from the template.
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-intro': DemoIntro;
  }
}
