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
    export default class ModalPortal extends LitElement implements StatefulElement<ModalPortalState> {
        static styles: import("lit").CSSResult;
        private modalC;
        modalStack: List<KeyedTemplateResult>;
        portalRef: Ref<HTMLElement>;
        get modalNodes(): HTMLCollection | undefined;
        constructor();
        offerState(newState: MapOf<ModalPortalState>): void;
        protected removeModal: (e: Event) => void;
        connectedCallback(): void;
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
    import ModalPortal from "modal-portal";
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
declare module "lib/lit-dialog" {
    import { LitElement } from 'lit';
    export default class LitDialog extends LitElement {
        private dialogRef;
        private get dialog();
        label: string;
        enableLightDismiss: boolean;
        close(): void;
        onDialogClose(): void;
        firstUpdated(): void;
        onClick(event: MouseEvent): void;
        render(): import("lit-html").TemplateResult<1>;
    }
    global {
        interface HTMLElementTagNameMap {
            'lit-dialog': LitDialog;
        }
    }
}
declare module "lib/with-lit-dialog" {
    import { LitElement } from 'lit';
    import { Ref } from 'lit/directives/ref.js';
    import LitDialog from "lib/lit-dialog";
    type Constructor<T = {}> = new (...args: any[]) => T;
    export class WithLitDialogInterface {
        litDialogRef: Ref<LitDialog>;
        closeDialog(): void;
    }
    export const WithLitDialog: <T extends Constructor<LitElement>>(superclass: T) => Constructor<WithLitDialogInterface> & T;
}
declare module "lib/confirm-modal" {
    import { LitElement } from 'lit';
    import './lit-dialog.ts';
    const ConfirmModal_base: (new (...args: any[]) => import("lib/with-lit-dialog").WithLitDialogInterface) & typeof LitElement;
    export default class ConfirmModal extends ConfirmModal_base {
        static styles: import("lit").CSSResult[];
        cancelLabel: string;
        confirmLabel: string;
        confirmCallback: Function | undefined;
        secondaryLabel: string;
        secondaryAction: Function | undefined;
        closeOnConfirmation: boolean;
        enableLightDismiss: boolean;
        handleConfirm(): void;
        handleSecondaryAction(): void;
        render(): import("lit-html").TemplateResult<1>;
    }
    global {
        interface HTMLElementTagNameMap {
            'confirm-modal': ConfirmModal;
        }
    }
}
//# sourceMappingURL=index.d.ts.map