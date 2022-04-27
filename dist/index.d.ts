declare module "lib/uuid" {
    export default function uuid(a?: string): string;
}
declare module "lib/state" {
    import { ReactiveElement } from "lit";
    import { Map } from "immutable";
    export type MapOf<T> = Map<keyof T, any>;
    export class StateManager<T> {
        protected constructor();
        applyState(existingState: MapOf<T>, newState: Partial<T>): MapOf<T>;
    }
    export interface StatefulElement<T> extends ReactiveElement {
        offerState(state: MapOf<T>): void;
    }
}
declare module "src/modal-portal" {
    import { LitElement } from "lit";
    import { Ref } from "lit/directives/ref.js";
    import { List } from "immutable";
    import { KeyedTemplateResult } from "src/modal-controller";
    import { MapOf, StatefulElement } from "lib/state";
    export type ModalPortalState = {
        modalStack: List<KeyedTemplateResult>;
    };
    export class ModalPortal extends LitElement implements StatefulElement<ModalPortalState> {
        private modalC;
        modalStack: List<KeyedTemplateResult>;
        portalRef: Ref<HTMLElement>;
        get modalNodes(): HTMLCollection | undefined;
        constructor();
        offerState(newState: MapOf<ModalPortalState>): void;
        private popOnEscape;
        protected closeModal: (e: Event) => void;
        connectedCallback(): void;
        disconnectedCallback(): void;
        render(): import("lit-html").TemplateResult<1>;
    }
    global {
        interface HTMLElementTagNameMap {
            "modal-portal": ModalPortal;
        }
    }
}
declare module "src/modal-controller" {
    import { ReactiveController, TemplateResult } from "lit";
    import { List, Map } from "immutable";
    import { StateManager } from "lib/state";
    import { ModalPortal } from "src/modal-portal";
    export type KeyedTemplateResult = TemplateResult & {
        key: string;
    };
    export type ModalRegistry = {
        remove: Function;
        replace: (arg0: TemplateResult, arg1?: Function) => void;
    };
    type ModalState = {
        modalStack: List<KeyedTemplateResult>;
        modalNodes: List<EventTarget>;
        closeCallbacks: Map<string, Function>;
    };
    export default class ModalController extends StateManager<ModalState> implements ReactiveController {
        private static instance?;
        static getInstance(): ModalController;
        private host;
        private set modalState(value);
        private get modalState();
        private get modalStack();
        private get modalNodes();
        private get closeCallbacks();
        attach(host: ModalPortal): void;
        hostConnected(): void;
        hostUpdated(): void;
        push(template: TemplateResult, closeCallback?: Function): ModalRegistry;
        private replace;
        pop(): void;
        private remove;
        removeByNode(modal: EventTarget): void;
        removeByKey(key: string): void;
        removeAll(): void;
    }
}
declare module "src/portal" {
    import { TemplateResult } from "lit";
    import { Directive } from "lit/directive.js";
    import { ModalRegistry } from "src/modal-controller";
    class PortalDirective extends Directive {
        modalRegistry?: ModalRegistry;
        getTemplate(templateOrSupplier: TemplateResult | (() => TemplateResult)): TemplateResult;
        render(showModal: boolean | Function, template: TemplateResult | (() => TemplateResult), closeCallback?: Function): void;
    }
    export const portal: (showModal: boolean | Function, template: TemplateResult<2 | 1> | (() => TemplateResult), closeCallback?: Function) => import("lit-html/directive").DirectiveResult<typeof PortalDirective>;
}
