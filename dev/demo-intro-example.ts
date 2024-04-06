import { LitElement, html, css } from 'lit';
import { customElement, queryAsync, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { styleMap } from 'lit/directives/style-map.js';
import { portal } from '../src/portal';

@customElement('demo-intro-example')
export class DemoIntroExample extends LitElement {
  static styles = [
    css`
      #wrapper {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid black;
        align-items: stretch;
        gap: 0.5rem;
        padding: 0.25rem;
      }

      #buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }

      #portal-target {
        border: 1px solid black;
        padding: 0.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      #portal-target h3 {
        margin-top: 0;
        margin-bottom: 0.25rem;
        line-height: 1;
      }
    `,
  ];

  @state()
  enablePortal1 = false;

  @state()
  enablePortal2 = false;

  @state()
  enablePortal3 = false;

  @queryAsync('#portal-target')
  portalTarget: Promise<HTMLElement>;

  portalContentStyles = {
    borderWidth: '2px',
    borderStyle: 'solid',
    padding: '0.25rem',
  };

  portalContent(label: string, borderColor: string, closeCallback: Function) {
    return html`
      <div style=${styleMap({ borderColor, ...this.portalContentStyles })}>
        <p>${label} content</p>
        <button @click=${closeCallback}>Close ${label}</button>
      </div>
    `;
  }

  render() {
    return html`
      <div id="wrapper">
        <div id="buttons">
          <button @click=${() => (this.enablePortal1 = true)}>Enable Portal 1</button>
          ${when(this.enablePortal1, () =>
            portal(
              this.portalContent('Portal 1', 'red', () => (this.enablePortal1 = false)),
              this.portalTarget,
            ),
          )}

          <button @click=${() => (this.enablePortal2 = true)}>Enable Portal 2</button>
          ${when(this.enablePortal2, () =>
            portal(
              this.portalContent('Portal 2', 'blue', () => (this.enablePortal2 = false)),
              this.portalTarget,
            ),
          )}

          <button @click=${() => (this.enablePortal3 = true)}>Enable Portal 3</button>
          ${when(this.enablePortal3, () =>
            portal(
              this.portalContent('Portal 3', 'green', () => (this.enablePortal3 = false)),
              this.portalTarget,
            ),
          )}
        </div>
        <div id="portal-target">
          <h3>Portal target</h3>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-intro-example': DemoIntroExample;
  }
}
