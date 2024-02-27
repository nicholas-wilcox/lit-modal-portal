import { ReactiveController, TemplateResult } from 'lit';
import { List, Map } from 'immutable';

import uuid from './lib/uuid';
import { MapOf, applyState, isNew } from './lib/state';
import ModalPortal, { ModalPortalState } from './modal-portal';

/** @internal A [`TemplateResult`](https://lit.dev/docs/api/templates/#TemplateResult) with an extra property: `key`. */
export type KeyedTemplateResult = TemplateResult & { key: string };

function addKeyToTemplate(el: TemplateResult, key: string): KeyedTemplateResult {
  const keyedTemplate: KeyedTemplateResult = el as KeyedTemplateResult;
  keyedTemplate.key = key;
  return keyedTemplate;
}

/** Registry for a modal that offers callbacks to remove the modal or replace it with another template. */
export type ModalRegistry = {
  /** Callback to remove the modal. */
  remove: Function;

  /** Callback to update the modal with a new `template` and `closeCallback` function. */
  replace: (template: TemplateResult, closeCallback?: Function) => void;
};

/** @internal Object type parameter for [[ModalController]] state. */
export type ModalState = {
  modalStack: List<KeyedTemplateResult>;
  modalNodes: List<EventTarget>;
  closeCallbacks: Map<string, Function>;
};

let _modalState: MapOf<ModalState> = Map<keyof ModalState, any>({
  modalStack: List(),
  modalNodes: List(),
  closeCallbacks: Map(),
});

/**
 * An extended ReactiveController interface for [[modalController]].
 */
export interface ModalController extends ReactiveController {
  /** @internal */
  host?: ModalPortal;

  /** @internal */
  modalState: MapOf<ModalState>;

  /** @internal */
  modalStack: List<KeyedTemplateResult>;

  /** @internal */
  modalNodes: List<EventTarget>;

  /** @internal */
  closeCallbacks: Map<string, Function>;

  /** @internal */
  attach: (host: ModalPortal) => void;

  /**
   * Add the given template to a new modal, placed on the top of the stack.
   * An optional `closeCallback` function will be executed when the modal is removed from the stack.
   *
   * @returns A registry object that can be used to remove or replace the modal.
   */
  push: (template: TemplateResult, closeCallback?: Function) => ModalRegistry;

  /** Removed the topmost modal from the stack. */
  pop: () => void;

  /** Removes a modal by its DOM node. */
  removeByNode: (modal: EventTarget) => void;

  /** Removes a modal by its key. */
  removeByKey: (key: string) => void;

  /** Clears the modal stack. */
  removeAll: () => void;
}

/**
 * Private removal function via index.
 * Looks for (and executes) an associated callback function for the modal at the given index.
 * Deletes both the template and the cached DOM node at the index.
 */
function removeModal(index: number) {
  if (index >= 0) {
    // Safeguard against negative indices, which are supported by the immutable List.
    const key = this.modalStack.get(index)?.key;
    const callback = this.closeCallbacks.get(key);
    if (callback !== undefined) {
      callback();
    }

    this.modalState = applyState(this.modalState, {
      modalStack: this.modalStack.delete(index),
      modalNodes: this.modalNodes.delete(index),
      closeCallbacks: this.closeCallbacks.delete(key),
    });
  }
}

/** Replaces a modal with the given key, updating both the template and the closeCallback. */
function replaceModal(key: string, template: TemplateResult, closeCallback?: Function) {
  const index = this.modalStack.findIndex((kt: KeyedTemplateResult) => kt.key === key);
  if (index >= 0) {
    this.modalState = applyState(this.modalState, {
      modalStack: this.modalStack.set(index, addKeyToTemplate(template, key)),
      closeCallbacks:
        closeCallback !== undefined
          ? this.closeCallbacks.set(key, closeCallback)
          : this.closeCallbacks.delete(key),
    });
  }
}

/**
 * A singleton Lit controller that manages the state of [[ModalPortal]].
 */
const modalController: ModalController = {
  host: undefined,

  set modalState(newState: MapOf<ModalState>) {
    if (isNew(newState, 'modalStack', this.modalStack)) {
      this.host.offerState(
        Map<keyof ModalPortalState, any>({
          modalStack: newState.get('modalStack'),
        }),
      );
    }
    _modalState = newState;
  },

  get modalState(): MapOf<ModalState> {
    return _modalState;
  },

  get modalStack(): List<KeyedTemplateResult> {
    return this.modalState.get('modalStack');
  },

  get modalNodes(): List<EventTarget> {
    return this.modalState.get('modalNodes');
  },

  get closeCallbacks(): Map<string, Function> {
    return this.modalState.get('closeCallbacks');
  },

  attach(host: ModalPortal) {
    if (this.host === undefined) {
      (this.host = host).addController(this);
    } else {
      console.error('You attempted to attach a singleton controller to more than one host.');
    }
  },

  hostConnected() {
    this.host.offerState(Map<keyof ModalPortalState, any>({ modalStack: this.modalStack }));
  },

  hostUpdated() {
    // We need to maintain a concurrent list of the modals to support asynchronous and out-of-order modal popping.
    this.modalState = applyState(this.modalState, {
      modalNodes: List(this.host.modalNodes),
    });
  },

  push(template: TemplateResult, closeCallback?: Function): ModalRegistry {
    const key = uuid();
    this.modalState = applyState(this.modalState, {
      modalStack: this.modalStack.push(addKeyToTemplate(template, key)),
      closeCallbacks:
        closeCallback !== undefined
          ? this.closeCallbacks.set(key, closeCallback)
          : this.closeCallbacks,
    });

    return {
      remove: () => this.removeByKey(key),
      replace: (template: TemplateResult, closeCallback?: Function) =>
        replaceModal.call(this, key, template, closeCallback),
    };
  },

  pop() {
    removeModal.call(this, this.modalStack.size - 1);
  },

  removeByNode(modal: EventTarget) {
    removeModal.call(this, this.modalNodes.indexOf(modal));
  },

  removeByKey(key: string) {
    removeModal.call(
      this,
      this.modalStack.findIndex((kt: KeyedTemplateResult) => kt.key === key),
    );
  },

  removeAll() {
    while (this.modalStack.size > 0) {
      this.pop();
    }
  },
};

export default modalController;
