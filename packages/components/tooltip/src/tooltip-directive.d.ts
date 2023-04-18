import type { DirectiveParameters, ElementPart } from 'lit/directive.js';
import { Directive } from 'lit/directive.js';
import { Tooltip } from './tooltip.js';
export declare class TooltipDirective extends Directive {
    content?: unknown;
    didSetupLazy: boolean;
    part?: ElementPart;
    tooltip?: Tooltip;
    render(_content: unknown): void;
    renderContent(): void;
    update(part: ElementPart, [content]: DirectiveParameters<this>): void;
    setupLazy(): void;
}
export declare const tooltip: (_content: unknown) => import("lit-html/directive.js").DirectiveResult<typeof TooltipDirective>;
