import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { EditorMarks, EditorNodes } from './schema.js';
import type { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { LitElement } from 'lit';
declare const Editor_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").HintInterface> & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").FormControlInterface>;
export declare class Editor extends Editor_base {
    #private;
    /** @private */
    static formAssociated: boolean;
    /** @private */
    static styles: CSSResultGroup;
    /** Element internals. */
    readonly internals: ElementInternals;
    /** Additional plugins. */
    plugins?: Plugin[];
    get value(): string | undefined;
    set value(value: string | undefined);
    connectedCallback(): void;
    firstUpdated(): void;
    updated(changes: PropertyValues<this>): void;
    render(): TemplateResult;
    createEditor(): EditorView;
    createSchema(): Schema<EditorNodes, EditorMarks>;
    createState(): EditorState;
}
export {};
