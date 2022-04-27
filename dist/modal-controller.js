import { List, Map, is } from "immutable";
import uuid from "../lib/uuid";
import { StateManager } from "../lib/state";
function addKeyToTemplate(el, key) {
  const keyedTemplate = el;
  keyedTemplate.key = key;
  return keyedTemplate;
}
let _modalState = Map({
  modalStack: List(),
  modalNodes: List(),
  closeCallbacks: Map()
});
class ModalController extends StateManager {
  static getInstance() {
    if (this.instance === void 0) {
      this.instance = new ModalController();
    }
    return this.instance;
  }
  set modalState(newState) {
    if (is(newState.get("modalStack"), this.modalStack)) {
      this.host.offerState(Map({ "modalStack": newState.get("modalStack") }));
    }
    _modalState = newState;
  }
  get modalState() {
    return _modalState;
  }
  get modalStack() {
    return this.modalState.get("modalStack");
  }
  get modalNodes() {
    return this.modalState.get("modalNodes");
  }
  get closeCallbacks() {
    return this.modalState.get("closeCallbacks");
  }
  attach(host) {
    if (this.host === void 0) {
      (this.host = host).addController(this);
    } else {
      console.error("You attempted to attach a singleton controller to more than one host.");
    }
  }
  hostConnected() {
    this.host.offerState(Map({ "modalStack": this.modalStack }));
  }
  hostUpdated() {
    this.modalState = this.applyState(this.modalState, { modalNodes: List(this.host.modalNodes) });
  }
  push(template, closeCallback) {
    const key = uuid();
    this.modalState = this.applyState(this.modalState, {
      modalStack: this.modalStack.push(addKeyToTemplate(template, key)),
      closeCallbacks: closeCallback !== void 0 ? this.closeCallbacks.set(key, closeCallback) : this.closeCallbacks
    });
    return {
      remove: () => this.removeByKey(key),
      replace: (template2, closeCallback2) => this.replace(key, template2, closeCallback2)
    };
  }
  replace(key, template, closeCallback) {
    const index = this.modalStack.findIndex((keyedTemplate) => keyedTemplate.key === key);
    if (index >= 0) {
      this.modalState = this.applyState(this.modalState, {
        modalStack: this.modalStack.set(index, addKeyToTemplate(template, key)),
        closeCallbacks: closeCallback !== void 0 ? this.closeCallbacks.set(key, closeCallback) : this.closeCallbacks.delete(key)
      });
    }
  }
  pop() {
    this.remove(this.modalStack.size - 1);
  }
  remove(index) {
    var _a;
    if (index >= 0) {
      const key = (_a = this.modalStack.get(index)) == null ? void 0 : _a.key;
      const callback = this.closeCallbacks.get(key);
      if (callback !== void 0) {
        callback();
      }
      this.modalState = this.applyState(this.modalState, {
        modalStack: this.modalStack.delete(index),
        modalNodes: this.modalNodes.delete(index),
        closeCallbacks: this.closeCallbacks.delete(key)
      });
    }
  }
  removeByNode(modal) {
    this.remove(this.modalNodes.indexOf(modal));
  }
  removeByKey(key) {
    this.remove(this.modalStack.findIndex((keyedTemplate) => keyedTemplate.key === key));
  }
  removeAll() {
    while (this.modalStack.size > 0) {
      this.pop();
    }
  }
}
export {
  ModalController as default
};
