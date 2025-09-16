import { render } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { type ElementPart, directive } from 'lit/directive.js';
import { Tooltip, TooltipOptions } from './tooltip.js';

/**
 * All non-function public instance properties of Tooltip.
 * Mirrors your Dialog pattern.
 */
type TooltipInstanceProps = {
  [K in keyof Tooltip as Tooltip[K] extends (...args: unknown[]) => unknown ? never : K]: Tooltip[K];
};

/**
 * Config accepted by the directive: creation-time TooltipOptions + runtime (instance) props.
 */
export type TooltipDirectiveConfig = TooltipOptions & Partial<TooltipInstanceProps>;

// interface TooltipDirectiveConfig extends TooltipOptions {
//   position?: Tooltip['position'];
//   maxWidth?: number;
// }

type TooltipDirectiveParams = [content: unknown, config?: TooltipDirectiveConfig /*options?: TooltipOptions*/]; // TODO: add TooltipProperties here as well?

/*// Single introspection instance (never added to DOM).
const #tooltipIntrospection = new Tooltip();

function isInstanceProp(key: string): boolean {
  return key in __tooltipIntrospection && typeof (#tooltipIntrospection as any)[key] !== 'function';
}*/

// function isInstanceProp(key: keyof Tooltip): boolean {
//   const value = __tooltipIntrospection[key];
//   return typeof value !== 'function';
// }

// type RuntimePropKey = keyof TooltipInstanceProps;
//
// function isRuntimeProp(k: string): k is RuntimePropKey {
//   return k in __tooltipIntrospection && typeof (__tooltipIntrospection as Record<string, unknown>)[k] !== 'function';
// }

type TooltipInstancePropKey = Extract<keyof TooltipInstanceProps, string>;

export class TooltipDirective extends AsyncDirective {
  content?: unknown;
  part?: ElementPart;
  tooltip?: Tooltip | (() => void);
  config: TooltipDirectiveConfig = {};
  // options?: TooltipOptions = {};

  private static readonly introspection = new Tooltip();

  // private static isInstanceProp(key: string): key is keyof TooltipInstanceProps {
  //   const inst = TooltipDirective.introspection as unknown as Record<string, unknown>;
  //   return key in inst && typeof inst[key] !== 'function';
  // }

  // type TooltipInstancePropKey = Extract<keyof TooltipInstanceProps, string>;

  // private static isInstanceProp(key: string): key is TooltipInstancePropKey {
  //   const inst = TooltipDirective.introspection as Record<string, unknown>;
  //   return key in inst && typeof inst[key] !== 'function';
  // }

  private static isInstanceProp(key: string): key is TooltipInstancePropKey {
    const inst = TooltipDirective.introspection as unknown as Record<string, unknown>;
    return key in inst && typeof inst[key] !== 'function';
  }

  override disconnected(): void {
    if (this.tooltip instanceof HTMLElement) {
      this.tooltip.remove();
    } else if (this.tooltip) {
      this.tooltip();
    }

    this.tooltip = undefined;
  }

  override reconnected(): void {
    console.log('TooltipDirective reconnected');
    this.#setup();
  }

  render(_content: unknown, _config?: TooltipDirectiveConfig /*_options?: TooltipOptions*/): void {}

  renderContent(): void {
    console.log(
      'Rendering tooltip content:',
      this.content,
      'this.tooltip:',
      this.tooltip,
      'this.part?.options:',
      this.part?.options,
      'this.options:',
      this.config //,
      // this.options?.ariaRelation
    );
    // render(this.content, this.tooltip as Tooltip, this.part!.options);

    // const renderOptions = { ...this.part!.options, ...this.options };
    // render(this.content, this.tooltip as Tooltip, renderOptions);

    console.log('part and part options in renderContent:', this.part, this.part?.options, this.config);

    if (!(this.tooltip instanceof Tooltip) || !this.part) return;
    render(this.content, this.tooltip, this.part.options);
  }

  // applyTooltipProps(tooltip: Tooltip, options?: TooltipDirectiveConfig): void {
  //   console.log('Applying tooltip properties:', tooltip, options);
  //   this.tooltip
  // }

  override update(
    part: ElementPart,
    /*[content]: DirectiveParameters<this>*/ /*[content, options]: TooltipDirectiveParams*/
    [content, config]: TooltipDirectiveParams
  ): void {
    console.log('TooltipDirective update called with content:', content, 'and options:', config);
    this.content = content;

    // if (options) {
    //   // this.options = options;
    //   this.options = { ...this.options, ...options };
    // }

    if (config) {
      // Shallow merge enables incremental updates from caller.
      this.config = { ...this.config, ...config };
    }

    this.part = part;

    if (this.tooltip instanceof Tooltip) {
      this.#applyRuntimeProps(this.tooltip);
      this.renderContent();
      return;
    }

    this.#setup();
  }

  #setup(): void {
    console.log(
      'this.options in #setup:',
      this.config,
      // this.options?.ariaRelation,
      'part element:',
      this.part?.element,
      this.part?.options?.isConnected,
      this.part?.options?.host,
      this.part?.options?.creationScope,
      this.part?.options?.renderBefore,
      this.part?.element,
      this.part?.type
    );

    if (!this.part?.element || this.tooltip) return;

    // Split config: creation options = keys NOT present as instance props.
    // const creationOptions: TooltipOptions = {};
    // for (const [k, v] of Object.entries(this.config)) {
    //   if (v === undefined) continue;
    //   if (!isInstanceProp(k)) {
    //     (creationOptions as any)[k] = v;
    //   }
    // }

    // Split config: creation options = keys NOT present as instance props.
    // const creationOptions = Object.fromEntries(
    //   Object.entries(this.config).filter(([k, v]) => v !== undefined && !isInstanceProp(k))
    // ) as TooltipOptions;

    const creationOptions = Object.fromEntries(
      Object.entries(this.config).filter(([k, v]) => v !== undefined && !TooltipDirective.isInstanceProp(k))
    ) as TooltipOptions;

    this.tooltip = Tooltip.lazy(
      this.part.element,
      tooltip => {
        if (!this.isConnected) return;
        this.tooltip = tooltip;
        this.#applyRuntimeProps(tooltip);
        this.renderContent();
      },
      creationOptions
    );

    /*    if (this.part!.element) {
      this.tooltip ||= Tooltip.lazy(
        this.part!.element,
        tooltip => {
          // tooltip.position = 'bottom';
          if (this.isConnected) {
            this.tooltip = tooltip;
            this.renderContent();
            // this.tooltip.position = 'bottom';
            // tooltip.position = 'bottom'; // TODO: needs to be an option that can be set? why first position is top and then bottom?
          }
        },
        this.options
      ); // TODO: add TooltipOptions here

      console.log('this.tooltip after lazy init:', this.part?.options, this.part?.type, this.part?.element,
      this.tooltip.constructor, Object.keys(this.tooltip));
    }*/

    //console.log('this.tooltip after lazy init:', this.tooltip, this.tooltip.properties);
    // this.tooltip.properties = { ...this.tooltip.properties, ...options };
  } // TODO: it needs to be possible to set context shadowRoot as well in the callback

  #applyRuntimeProps(tooltip: Tooltip): void {
    for (const [k, v] of Object.entries(this.config)) {
      if (v === undefined) continue;
      if (!TooltipDirective.isInstanceProp(k)) continue; // skip creation-only keys
     // if (!isInstanceProp(k)) continue; // skip creation-only keys
      (tooltip as any)[k] = v;
    }
  }

  // #applyRuntimeProps(t: Tooltip): void {
  //   const cfg = this.config as Partial<TooltipInstanceProps>;
  //   for (const k of Object.keys(cfg) as RuntimePropKey[]) {
  //     const v = cfg[k];
  //     if (v === undefined) continue;
  //     if (!isRuntimeProp(k)) continue;
  //     t[k] = v as TooltipInstanceProps[typeof k];
  //   }
  // }
}

export const tooltip = directive(TooltipDirective);
