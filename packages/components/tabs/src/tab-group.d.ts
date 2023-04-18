import type { CSSResultGroup, TemplateResult } from 'lit';
import type { EventEmitter } from '@sl-design-system/shared';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { LitElement } from 'lit';
import { Tab } from './tab.js';
declare const TabGroup_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types.js").ScopedElementsHost>;
export declare class TabGroup extends TabGroup_base {
    #private;
    /** @private */
    static get scopedElements(): ScopedElementsMap;
    /** @private */
    static styles: CSSResultGroup;
    /** The slotted tabs. */
    tabs?: Tab[];
    /** The current tab node selected in the tab group. */
    private selectedTab;
    tabChange: EventEmitter<number>;
    /** Renders the tabs vertically instead of the default horizontal  */
    vertical: boolean;
    render(): TemplateResult;
    connectedCallback(): void;
    firstUpdated(): void;
}
export {};
