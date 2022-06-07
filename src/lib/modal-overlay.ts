import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';

import "./modal-backdrop.ts";

@customElement("modal-overlay")
export default class ModalOverlay extends LitElement {
  static styles = [
    css`
      .modal-container {
        inset: 0;
        overflow-y: auto;
        position: absolute;
      }

      .modal-container.flex {
        align-items: center;
        display: flex;
        justify-content: center;
      }
    `
  ];

  @property()
  label: string = '';

  @property({ type: Boolean, attribute: false })
  flexCentering: boolean = false;

  @property({ type: Object, attribute: false })
  containerStyles: StyleInfo = { padding: '1rem' };

  get classes() {
    return {
      'modal-container': true,
      'flex': this.flexCentering,
    };
  }

  render() {
    return html`
      <modal-backdrop label=${this.label}>
        <div class=${classMap(this.classes)} style=${styleMap(this.containerStyles)}>
          <slot></slot>
        </div>
      </modal-backdrop>
    `;
  }
}
