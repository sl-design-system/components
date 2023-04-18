import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { IconDefinition, IconLibrary, IconStyle } from './models.js';
import { LitElement } from 'lit';
declare global {
    interface Window {
        SLDS: {
            icons: IconLibrary;
        };
    }
}
export declare class Icon extends LitElement {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    static availableStyles: IconStyle[];
    private iconNotDef;
    /**
     * Add icon(s) to the icon registry
     *
     * @param {IconDefinition | IconDefinition[] } faIcons One or more IconDefinition that have been imported from FontAwesome
     */
    static registerIcon(...faIcons: IconDefinition[]): void;
    /**
     * store all icons from the IconLibrary of the theme in the icon registry for easy access
     */
    static registerIcons(icons: IconLibrary): void;
    /**
     * Describes the icon for assistive devices. If not present, the icon is considered
     * to be purely presentational.
     */
    label?: string;
    /** The name of the icon to show. */
    name?: string;
    get icons(): IconLibrary;
    updated(changes: PropertyValues<this>): void;
    render(): TemplateResult;
}
