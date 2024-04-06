import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { portal } from './portal';

@customElement('lit-portal')
export default class LitPortal extends LitElement {
  @property()
  portalRoot: HTMLElement | string;

  @property({ attribute: false })
  content: unknown;

  render() {
    return portal(this.content, this.portalRoot);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-portal': LitPortal;
  }
}
