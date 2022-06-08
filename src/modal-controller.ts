import { ReactiveController, TemplateResult } from 'lit';
import { List, Map } from 'immutable';

import uuid from './lib/uuid';
import { MapOf, StateManager, isNew } from './lib/state';
import ModalPortal, { ModalPortalState } from './modal-portal';

export type KeyedTemplateResult = TemplateResult & { key: string };

function addKeyToTemplate(el: TemplateResult, key: string): KeyedTemplateResult {
  const keyedTemplate: KeyedTemplateResult = el as KeyedTemplateResult;
  keyedTemplate.key = key;
  return keyedTemplate;
}

/* Registry for a modal that offers callbacks to remove the modal or replace it with another template. */
export type ModalRegistry = {
  remove: Function;
  replace: (arg0: TemplateResult, arg1?: Function) => void;
};

type ModalState = {
  modalStack: List<KeyedTemplateResult>;
  modalNodes: List<EventTarget>;
  closeCallbacks: Map<string, Function>;
};

let _modalState: MapOf<ModalState> = Map<keyof ModalState, any>({
  modalStack: List(),
  modalNodes: List(),
  closeCallbacks: Map(),
});

export default class ModalController
  extends StateManager<ModalState>
  implements ReactiveController
{
  /* Static stuff for singleton pattern. */
  private static instance?: ModalController;

  public static getInstance(): ModalController {
    if (this.instance === undefined) {
      this.instance = new ModalController();
    }
    return this.instance;
  }

  private host: ModalPortal;

  private set modalState(newState: MapOf<ModalState>) {
    if (isNew(newState, 'modalStack', this.modalStack)) {
      this.host.offerState(
        Map<keyof ModalPortalState, any>({
          modalStack: newState.get('modalStack'),
        })
      );
    }
    _modalState = newState;
  }

  private get modalState(): MapOf<ModalState> {
    return _modalState;
  }
  private get modalStack(): List<KeyedTemplateResult> {
    return this.modalState.get('modalStack');
  }
  private get modalNodes(): List<EventTarget> {
    return this.modalState.get('modalNodes');
  }
  private get closeCallbacks(): Map<string, Function> {
    return this.modalState.get('closeCallbacks');
  }

  public attach(host: ModalPortal) {
    if (this.host === undefined) {
      (this.host = host).addController(this);
    } else {
      console.error('You attempted to attach a singleton controller to more than one host.');
    }
  }

  hostConnected() {
    this.host.offerState(Map<keyof ModalPortalState, any>({ modalStack: this.modalStack }));
  }

  // We need to maintain a concurrent list of the modals to support
  // asynchronous and out-of-order modal popping.
  hostUpdated() {
    this.modalState = this.applyState(this.modalState, {
      modalNodes: List(this.host.modalNodes),
    });
  }

  push(template: TemplateResult, closeCallback?: Function): ModalRegistry {
    const key = uuid();
    this.modalState = this.applyState(this.modalState, {
      modalStack: this.modalStack.push(addKeyToTemplate(template, key)),
      closeCallbacks:
        closeCallback !== undefined
          ? this.closeCallbacks.set(key, closeCallback)
          : this.closeCallbacks,
    });

    return {
      remove: () => this.removeByKey(key),
      replace: (template: TemplateResult, closeCallback?: Function) =>
        this.replace(key, template, closeCallback),
    };
  }

  private replace(key: string, template: TemplateResult, closeCallback?: Function) {
    const index = this.modalStack.findIndex((keyedTemplate) => keyedTemplate.key === key);
    if (index >= 0) {
      this.modalState = this.applyState(this.modalState, {
        modalStack: this.modalStack.set(index, addKeyToTemplate(template, key)),
        closeCallbacks:
          closeCallback !== undefined
            ? this.closeCallbacks.set(key, closeCallback)
            : this.closeCallbacks.delete(key),
      });
    }
  }

  pop() {
    this.remove(this.modalStack.size - 1);
  }

  /**
   * Private removal function via index.
   * Looks for (and executes) an associated callback function for the modal at the given index.
   * Deletes both the template and the cached DOM node at the index.
   */
  private remove(index: number) {
    if (index >= 0) {
      // Safeguard against negative indices, which are supported by the immutable List.
      const key = this.modalStack.get(index)?.key;
      const callback = this.closeCallbacks.get(key);
      if (callback !== undefined) {
        callback();
      }

      this.modalState = this.applyState(this.modalState, {
        modalStack: this.modalStack.delete(index),
        modalNodes: this.modalNodes.delete(index),
        closeCallbacks: this.closeCallbacks.delete(key),
      });
    }
  }

  /* Remove a modal by its DOM node. */
  removeByNode(modal: EventTarget) {
    this.remove(this.modalNodes.indexOf(modal));
  }

  /* Remove a modal by its uuid. */
  removeByKey(key: string) {
    this.remove(this.modalStack.findIndex((keyedTemplate) => keyedTemplate.key === key));
  }

  removeAll() {
    while (this.modalStack.size > 0) {
      this.pop();
    }
  }
}
