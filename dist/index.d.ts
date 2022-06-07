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
    export function isNew<T>(newState: MapOf<T>, name: keyof T, current: any): boolean;
}
declare module "modal-portal" {
    import { LitElement } from "lit";
    import { Ref } from "lit/directives/ref.js";
    import { List } from "immutable";
    import { KeyedTemplateResult } from "modal-controller";
    import { MapOf, StatefulElement } from "lib/state";
    export type ModalPortalState = {
        modalStack: List<KeyedTemplateResult>;
    };
    export class ModalPortal extends LitElement implements StatefulElement<ModalPortalState> {
        static styles: import("lit").CSSResult;
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
            'modal-portal': ModalPortal;
        }
    }
}
declare module "modal-controller" {
    import { ReactiveController, TemplateResult } from "lit";
    import { List, Map } from "immutable";
    import { StateManager } from "lib/state";
    import { ModalPortal } from "modal-portal";
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
declare module "portal" {
    import { TemplateResult } from "lit";
    import { Directive } from "lit/directive.js";
    import { ModalRegistry } from "modal-controller";
    class PortalDirective extends Directive {
        modalRegistry?: ModalRegistry;
        getTemplate(templateOrSupplier: TemplateResult | (() => TemplateResult)): TemplateResult;
        render(showModal: boolean | Function, template: TemplateResult | (() => TemplateResult), closeCallback?: Function): void;
    }
    export const portal: (showModal: boolean | Function, template: TemplateResult<2 | 1> | (() => TemplateResult), closeCallback?: Function) => import("lit-html/directive").DirectiveResult<typeof PortalDirective>;
}
declare module "lib/lit-modal" {
    import { LitElement } from 'lit';
    export abstract class LitModal extends LitElement {
        closeModal(): void;
    }
}
declare module "lib/confirm-modal" {
    import { LitModal } from "lib/lit-modal";
    import './modal-overlay.ts';
    export default class ConfirmModal extends LitModal {
        static styles: import("lit").CSSResult[];
        cancelLabel: string;
        confirmLabel: string;
        confirmCallback: Function | undefined;
        secondaryLabel: string;
        secondaryAction: Function | undefined;
        closeOnConfirmation: boolean;
        handleConfirm(): void;
        handleSecondaryAction(): void;
        render(): import("lit-html").TemplateResult<1>;
    }
}
declare module "lib/modal-backdrop" {
    import { LitElement } from "lit";
    export default class ModalBackdrop extends LitElement {
        static styles: import("lit").CSSResult;
        label: string;
        render(): import("lit-html").TemplateResult<1>;
    }
}
declare module "lib/modal-overlay" {
    import { LitElement } from 'lit';
    import { StyleInfo } from 'lit/directives/style-map.js';
    import "./modal-backdrop.ts";
    export default class ModalOverlay extends LitElement {
        static styles: import("lit").CSSResult[];
        label: string;
        flexCentering: boolean;
        containerStyles: StyleInfo;
        get classes(): {
            'modal-container': boolean;
            flex: boolean;
        };
        render(): import("lit-html").TemplateResult<1>;
    }
}
//# sourceMappingURL=index.d.ts.map