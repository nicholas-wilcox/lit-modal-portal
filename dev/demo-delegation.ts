import { html, LitElement, css } from 'lit';
import { customElement, property, state, queryAsync } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { portal } from '../src/portal';

@customElement('dynamic-portal')
export class DynamicPortal extends LitElement {
  static styles = [
    css`
      .dynamic-portal {
        border: 1px solid black;
        padding: 0.25rem;
      }
    `,
  ];

  @property({ attribute: false })
  portalContent: unknown;

  @property({ attribute: false })
  portalTarget: Promise<HTMLElement>;

  @state()
  enablePortal = false;

  render() {
    return html`
      <div class="dynamic-portal">
        <p>
          This component manages a reactive boolean value that is toggled by the button below. By
          default, this component will render its provided content in-place. When the portal is
          enabled, the content will be rendered in the provided target with a portal.
        </p>
        <button @click=${() => (this.enablePortal = !this.enablePortal)}>Toggle Portal</button>
        ${when(
          this.enablePortal,
          () =>
            portal(
              html`
                ${this.portalContent}
                <p>Rendered in a portal.</p>
              `,
              this.portalTarget,
            ),
          () => html`
            ${this.portalContent}
            <p>Rendered in-place.</p>
          `,
        )}
      </div>
    `;
  }
}

@customElement('demo-delegation')
export class DemoDelegation extends LitElement {
  static styles = [
    css`
      .portal-target {
        border: 1px solid black;
        padding: 0.25rem;
        margin-top: 0.5rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 0.25rem;
        line-height: 1;
      }
    `,
  ];

  @queryAsync('#portal-target')
  portalTarget: Promise<HTMLElement>;

  render() {
    return html`
      <h2>Delegating portals</h2>
      <p>
        You can create components that define certain portalling behaviors but use values provided
        by a parent component for the portal's content and target.
      </p>
      <dynamic-portal
        .portalTarget=${this.portalTarget}
        .portalContent=${html`<p>This is the portal content.</p>`}
      ></dynamic-portal>
      <div id="portal-target" class="portal-target">
        <h3>Portal target</h3>
      </div>
    `;
  }
}
