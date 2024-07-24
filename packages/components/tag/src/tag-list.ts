import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { type EventEmitter, RovingTabindexController, event, getScrollParent } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state, queryAssignedElements } from 'lit/decorators.js';
import styles from './tag-list.scss.js';
import {Tag, TagSize, TagEmphasis} from './tag.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-tab-change': SlTabChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-tag-list': TagList;
  }
}

export type SlTabChangeEvent = CustomEvent<number>;

export type TabsAlignment = 'start' | 'center' | 'end' | 'stretch';

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributes: true,
  subtree: true,
  attributeFilter: ['selected'],
  attributeOldValue: true
};

let nextUniqueId = 0;

/**
 * A tab group component that can contain tags.
 *
 * ```html
 *   <sl-tag-list>
 *     <sl-tag>First tag</sl-tag>
 *     <sl-tag>Second tag</sl-tag>
 *     ...
 *   </sl-tag-list>
 * ```
 *
 * @csspart ...
 *
 * @cssprop ...
 *
 * @slot default - Tab panels or other tab content here.
 * @slot tabs - The tabs to display.
 */
@localized()
export class TagList extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tag': Tag,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Unique prefix ID for each component in the light DOM. */
  #idPrefix = `sl-tab-group-${nextUniqueId++}`;

  /**
   * Observe changes to the selected tab and update accordingly. This observer
   * is necessary for changes to the selected tab that are made programmatically.
   * Selected changes made by the user are handled by the click event listener.
   */
  #mutationObserver = new MutationObserver(entries => {
    console.log(entries);
    // const selected = entries.find(
    //   entry =>
    //     entry.attributeName === 'selected' &&
    //     entry.oldValue === null &&
    //     entry.target instanceof Tab &&
    //     entry.target.parentElement === this
    // );
    //
    // const deselected = entries.find(
    //   entry =>
    //     entry.attributeName === 'selected' &&
    //     entry.target instanceof Tab &&
    //     entry.target.parentElement === this &&
    //     !entry.target.hasAttribute('selected')
    // );

    // Update the selected tab with the observer turned off to avoid loops
    this.#mutationObserver?.disconnect();

    // if (selected) {
    //   this.#updateSelectedTab(selected.target as Tab);
    // } else if (deselected) {
    //   this.#updateSelectedTab();
    // }

    this.#mutationObserver?.observe(this, OBSERVER_OPTIONS);
  });

  /**
   * Observe changes to the size of the tablist so:
   * - we can determine when to display an overflow menu with tab items
   * - we know when we need to reposition the active tab indicator
   */
  #resizeObserver = new ResizeObserver((entries) => {
    requestAnimationFrame(() => {
      console.log('entries in observer', entries, entries[0], entries[0].contentRect);
      const { contentRect } = entries[0];
      const widthChange = contentRect.width - entries[0].target.clientWidth;
      console.log('entry and width change', contentRect, widthChange, entries[0], contentRect.width, entries[0].target.clientWidth );
      this.#updateVisibility();
      // this.#shouldAnimate = false;
      // this.#updateSize();
      // this.#shouldAnimate = true;
    });
    // console.log('entries in observer', entries, entries[0], entries[0].contentRect);
    // const { contentRect } = entries[0];
    // const widthChange = contentRect.width - entries[0].target.clientWidth;
    // console.log('entry and width change', contentRect, widthChange, entries[0]);
    // this.#updateVisibility();
    // // this.#shouldAnimate = false;
    // // this.#updateSize();
    // // this.#shouldAnimate = true;
  });

  /** Manage keyboard navigation between tabs. */
  #rovingTabindexController = new RovingTabindexController<Tag>(this, {
    // focusInIndex: (elements: Tag[]) => elements.findIndex(el => el.focus),
    elements: () => this.tags || [],
    isFocusableElement: (el: Tag) => !el.disabled
  });

  /** Determines whether the active tab indicator should animate. */
  #shouldAnimate = false;

  /** The alignment of tabs within the wrapper. */
  @property({ attribute: 'align-tabs', reflect: true }) alignTabs?: TabsAlignment;

  /** @internal The menu items to render when the tabs are overflowing. */
  // @state() menuItems?: Array<{ tab: Tab; disabled?: boolean; title: string; subtitle?: string }>;

  /** @internal The currently selected tab. */
  @state() selectedTab?: Tag;

  /** @internal Whether the menu button needs to be shown. */
  @state() showMenu = false;

  /** @internal Emits when the tab has been selected/changed. */
  @event({ name: 'sl-tab-change' }) tabChangeEvent!: EventEmitter<SlTabChangeEvent>;

  // /** @internal The slotted tabs. */
  // @state() tabPanels?: TabPanel[];

  /** @internal The slotted tags. */
  @queryAssignedElements({ flatten: true }) tags?: Tag[];
  // @state() tags?: Tag[];

  /** Renders the tabs vertically instead of the default horizontal  */
  @property({ type: Boolean, reflect: true }) vertical?: boolean;

  /** Whether there should be a stacked version shown when there is not enough space. */
  @property({ type: Boolean, reflect: true }) stacked?: boolean;

  /** The size of the tag-list (determines size of tags inside). Defaults to `md` with css properties if not attribute is not set. */
  @property({ reflect: true }) size?: TagSize = 'md'; // TODO: change description

  /** The emphasis of the tag-list and tags inside; defaults to 'subtle'. */
  @property({ reflect: true }) emphasis: TagEmphasis = 'subtle';

  #initialListWidth = 0;

  #hiddenLabel = 0;

  #previousChange = 0;

  #hiddenTags: Tag[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.#mutationObserver.observe(this, OBSERVER_OPTIONS);

    // We need to wait for the next frame so the element has time to render
    requestAnimationFrame(() => {
      // const tablist = this.renderRoot.querySelector('[part="tablist"]') as Element;

      // We want to observe the size of the tablist, not the
      // container or wrapper. The tablist is the element that
      // changes size for example when fonts are loaded. The
      // other elements do not change size while the tablist does.
      // this.#resizeObserver.observe(tablist);
      this.#resizeObserver.observe(this);

      const list = this.renderRoot.querySelector('.list') as HTMLDivElement;
      const listInitialWidth = Math.round(list.getBoundingClientRect().width);
      const listInitialWidth2 = Math.round(list.offsetWidth);

      this.#initialListWidth = list.scrollWidth;

      console.log('list-width', list.scrollWidth, list.clientWidth, list.offsetWidth)

      console.log('list.scrollWidth in connectedCallback', listInitialWidth, listInitialWidth2, this.tags, list.scrollWidth);
      this.tags?.forEach((tag: Tag) => tag.size = this.size);
      this.tags?.forEach((tag: Tag) => tag.emphasis = this.emphasis);
    });
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('this.tags in updated', this.tags);

    if (changes.has('alignTabs')) {
      this.#shouldAnimate = false;
      // this.#updateSelectionIndicator();
      this.#shouldAnimate = true;
    }

    // In vertical mode, we need to observe the scroller for changes in size to
    // determine when we need to show the menu button.
    if (changes.has('vertical')) {
      const scroller = this.renderRoot.querySelector('[part="scroller"]') as HTMLElement;

      if (this.vertical) {
        this.#resizeObserver.observe(scroller);
      } else {
        this.#resizeObserver.unobserve(scroller);
      }
    }
  }

  override render(): TemplateResult {
    console.log('this.tags', this.tags);
    const labels = this.#hiddenTags?.map((tag) => tag.label);
    console.log('lejbels', this.#hiddenTags?.forEach((tag: Tag) => { return tag.label}), this.#hiddenTags, this.#hiddenTags[0]?.label, labels, labels.join(', '));
    return html`
    ${this.stacked && this.#hiddenLabel > 0
      ? html`
        <div class="group">
        <sl-tag emphasis=${this.emphasis} aria-describedby="tooltip" label=${this.#hiddenLabel > 99 ? '+99' : this.#hiddenLabel}></sl-tag> <!-- TODO: do we need this one to be focusable due to accessibility reasons?-->
          <sl-tooltip id="tooltip" position="top" max-width="300">
            ${this.#hiddenTags?.map((tag) => tag.label).join(', ')}
          </sl-tooltip>
        </div>`
      : nothing}
    <!--<div class="group" hidden-elemens="3">-->
      <!--<sl-tag label="1" readonly></sl-tag>
      <sl-tag label="2" readonly></sl-tag>-->
     <!-- <sl-tag label=${this.#hiddenLabel} readonly></sl-tag>
    </div>-->
    <div class="list">
      <slot @slotchange=${this.#onTagsSlotChange}></slot>
    </div>
     <!-- <div part="panels">
        <slot></slot>
      </div> -->
    `;
  } // name="tags"

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    console.log('this.tags in first updated', this.tags);
  }

  #updateVisibility(): void {
    if (!this.tags || !this.stacked) {
      return;
    }

    console.log('renderRoot on update', this.renderRoot.querySelectorAll<Tag>('sl-tag'), this.renderRoot, this.renderRoot.querySelectorAll('sl-tag'), this.tags);
    console.log('renderRoot on update list', this.renderRoot.querySelector('.list'));

    const remainingSpace = this.clientWidth; // TODO: this minut place for group when more than 1 and 3 in group hidden and minus spacing
    const list = this.renderRoot.querySelector('.list') as HTMLDivElement;
    const listInitialWidth = Math.round(list.getBoundingClientRect().width);
    const listInitialWidth2 = Math.round(list.offsetWidth);

    console.log('dimensions', this.getBoundingClientRect(), this.scrollWidth, this.clientWidth);
    console.log('list dimensions', list.getBoundingClientRect(), list.scrollWidth, list.clientWidth); // TODO: group width?

    console.log('list.getBoundingClientRect', list.getBoundingClientRect(), Math.round(list.getBoundingClientRect().width), this.tags, this.tags[0].offsetWidth);
    console.log('list.scrollWidth', list.scrollWidth, Math.round(list.getBoundingClientRect().width), Math.round(list.getBoundingClientRect().width) < list.scrollWidth, listInitialWidth, listInitialWidth2);
    console.log('parentElement', this.parentElement);
    console.log('change in px', list.scrollWidth - Math.round(list.getBoundingClientRect().width));
    console.log('tag width', this.tags[0].offsetWidth, this.tags[0].clientWidth);
    let hiddenTags: Tag[] = [];

/*   console.log('is resize smaller', Math.round(list.getBoundingClientRect().width) < this.#initialListWidth, Math.round(list.offsetWidth) < this.#initialListWidth, this.offsetWidth, this.offsetWidth < this.#initialListWidth );
    if (this.offsetWidth < this.#initialListWidth/!*Math.round(list.getBoundingClientRect().width) < this.#initialListWidth*!/ /!*list.scrollWidth*!/) { // TODO: or list.offsetWidth ??
      const change = /!*list.scrollWidth*!/this.#initialListWidth - Math.round(list.getBoundingClientRect().width);
      // const change = this.#initialListWidth - list.scrollWidth; //Math.round(list.getBoundingClientRect().width);
      console.log('change---', change);
      // let previousChange = 0;
      const tagsWidth = this.tags.slice().reduce((acc, tag) => {
        console.log('this.offsetWidth < this.#initialListWidth', this.offsetWidth < this.#initialListWidth, acc, this.offsetWidth, this.#initialListWidth);
        console.log('change in acc', change, this.#initialListWidth, Math.round(list.getBoundingClientRect().width), list.scrollWidth);
        console.log('acc + tag.clientWidth',acc,  acc + tag.clientWidth, change, acc + (tag.clientWidth/10) < change);
        console.log('acc change', acc + (tag.clientWidth/10) < (this.#initialListWidth - Math.round(list.getBoundingClientRect().width)));
        console.log('acc shoudl go to if',acc, tag.clientWidth, change, acc + (tag.clientWidth/10) < change);
       // requestAnimationFrame(() => {
          if (acc + tag.clientWidth /!*(tag.clientWidth/10)*!/ < change) {
            console.log('taaaag in acc change?', tag);
            hiddenTags.push(tag);
            this.#hiddenLabel = hiddenTags.length;
            console.log('hiddenTags in acc', hiddenTags, tag, change, acc, (acc + tag.clientWidth),
              (acc + (tag.clientWidth/10) /!*(tag.clientWidth/10)*!/ < change),
              (acc + (tag.clientWidth/10) /!*(tag.clientWidth/10)*!/ > change), change > this.#previousChange );
            // tag.style.display = 'none';
            // tag.style.background = "yellow"
            console.log('previousChange > change', this.#previousChange, change, change > this.#previousChange /!*this.#previousChange > change)*!/);

/!*            if (change > this.#previousChange) {
              tag.style.background = "yellow";
              console.log('tag should be yellow', tag);
              tag.setAttribute('hidden', '');
           //   hiddenTags?.forEach(tag => tag.setAttribute('hidden', ''));
              console.log('hiddenTags color yellow', hiddenTags);
            } else if ( change < this.#previousChange && hiddenTags.length) {
              // tag.style.background = "green";
              this.tags?.forEach(tag => tag.style.background = 'blue');
              hiddenTags?.forEach(tag => tag.style.background = 'darkgreen');
              tag.style.background = "green";
              // this.tags?.forEach(tag => tag.removeAttribute('hidden'));
              // hiddenTags?.forEach(tag => tag.setAttribute('hidden', ''));
            //  tag.setAttribute('hidden', '');
              console.log('hiddenTags color green', hiddenTags);
            }*!/

          }
         this.#previousChange = change;
       // });
        /!*if (acc + (tag.clientWidth/10) /!*(tag.clientWidth/10)*!/ < change) {
          console.log('taaaag in acc change?', tag);
          hiddenTags.push(tag);
          this.#hiddenLabel = hiddenTags.length;
          console.log('hiddenTags in acc', hiddenTags);
          // tag.style.display = 'none';
        }*!/ /!*else if (/!*acc >= change &&*!/ hiddenTags.length) {
          const index = hiddenTags.indexOf(tag);
          console.log('tag in acc else', tag);
          if (index > -1) { // only splice array when item is found
            hiddenTags.splice(index, 1); // 2nd parameter means remove one item only
          }
          // tag.removeAttribute('hidden');
          console.log('hiddenTags in else in reduce...', hiddenTags, acc);
          this.#hiddenLabel = hiddenTags.length;
          // hiddenTags.forEach(hiddenTag => hiddenTag.style.background = "yellow");
          console.log('hiddenTags and tag in reduce', hiddenTags, tag);
        }*!/

        console.log('hiddenTags and acc', hiddenTags, acc);
        // this.#previousChange = change;
        return acc + tag.clientWidth - 16;
      }, 80); // TODO: first starts with 0, but better with tag group width element wth values

     //  const hiddenTagsWidth = hiddenTags.slice().reduce((acc, tag) => {return acc + tag.clientWidth},0);
     // // this.#previousChange = change;
     //  // this.#previousChange = change;
     //  console.log('hiddenTags.length after acc', hiddenTags.length);
     //  // hiddenTags?.forEach(tag => tag.setAttribute('hidden', ''));
     //  // TODO filter all hidden tags and compare with hiddenTags and toggleAttribute
     //  // list.style.transform = `translateX(-${hiddenTagsWidth}px)`;
     //  list.style.marginLeft = `-${hiddenTagsWidth + 32}px`; // TODO: + gap
      this.tags?.forEach(tag => tag.style.visibility = 'visible');
      hiddenTags.forEach(tag => tag.style.visibility = 'hidden');
      // console.log('tagsWidth', tagsWidth, hiddenTagsWidth, list);
      console.log('hiddenTags in if', hiddenTags);
      // this.#hiddenLabel = hiddenTags.length; //1;
      console.log('this.#hiddenLabel in if', this.#hiddenLabel);
      // this.tags[0].style.display = 'none';
    } else {
      this.#hiddenLabel = hiddenTags.length; //0;
      // this.tags.forEach(tag => tag.removeAttribute('hidden'));
      // list.style.transform = `translateX(0)`;
      // list.style.marginLeft = '0';
      // this.tags?.forEach(tag => tag.style.visibility = 'visible');
      // hiddenTags?.forEach(tag => tag.toggleAttribute('hidden'));
      console.log('this.#hiddenLabel in else', this.#hiddenLabel);
      console.log('hiddenTags in else', hiddenTags);
      // this.tags[0].style.display = 'flex';
    }

    console.log('this.tagsss', this.tags);

    // this.#previousChange = this.#initialListWidth - Math.round(list.getBoundingClientRect().width);

  //  this.#hiddenLabel = hiddenTags.length; // TODO: here ir's not working properly

    console.log('hiddenTags at the end', hiddenTags);
    // this.tags.forEach(tag => tag.removeAttribute('hidden'));
    // this.tags.forEach(tag => tag.style.background = 'blue');
    // hiddenTags?.forEach(tag => tag.setAttribute('hidden', ''));
    // hiddenTags.forEach(hiddenTag => hiddenTag.style.background = "yellow");

    // requestAnimationFrame(() => {
    //   console.log('hiddenTags at the end---> in request animation frame', hiddenTags, this.tags);
    //   if (hiddenTags.length) {
    //     const hiddenTagsWidth = hiddenTags.slice().reduce((acc, tag) => {return acc + tag.clientWidth},0);
    //     // this.#previousChange = change;
    //     // this.#previousChange = change;
    //     console.log('hiddenTags.length after acc', hiddenTags.length);
    //     // hiddenTags?.forEach(tag => tag.setAttribute('hidden', ''));
    //     // TODO filter all hidden tags and compare with hiddenTags and toggleAttribute
    //     // list.style.transform = `translateX(-${hiddenTagsWidth}px)`;
    //     // list.style.marginLeft = `-${hiddenTagsWidth + 16}px`; // TODO: + gap
    //     // this.tags?.forEach(tag => tag.style.background = 'purple');
    //     // hiddenTags.forEach(hiddenTag => hiddenTag.style.background = "red");
    //     // this.tags?.forEach(tag => tag.removeAttribute('hidden'));
    //     // hiddenTags?.forEach(tag => tag.setAttribute('hidden', ''));
    //     this.tags?.forEach(tag => tag.style.visibility = 'visible');
    //     hiddenTags.forEach(tag => tag.style.visibility = 'hidden');
    //     list.style.marginLeft = `-${hiddenTagsWidth + 16}px`; // TODO: + gap
    //   } else {
    //     list.style.marginLeft = 'inherit';
    //     // this.tags?.forEach(tag => tag.style.background = 'purple');
    //     // this.tags?.forEach(tag => tag.removeAttribute('hidden'));
    //     this.tags?.forEach(tag => tag.style.visibility = 'visible');
    //   }
    // });

    // TODO for each hidden tag display none or flex when necessary

    this.requestUpdate(); // TODO: whet this would be in acc the label would change too often?
    // this.#previousChange = this.#initialListWidth - Math.round(list.getBoundingClientRect().width);

    this.#hiddenTags = hiddenTags;

    // requestAnimationFrame(() => {
      console.log('hiddenTags at the end---> in request animation frame', hiddenTags, this.tags, hiddenTags.length, this.#hiddenLabel);
      let invisibleTags = [];
    invisibleTags = this.tags?.slice(0, this.#hiddenLabel);
    console.log('invisibleTags', invisibleTags);
      if (/!*hiddenTags.length*!/invisibleTags.length) {
        // const hiddenTagsWidth = hiddenTags.slice().reduce((acc, tag) => {return acc + tag.clientWidth},0);
        const hiddenTagsWidth = /!*this.tags?.slice(0, this.#hiddenLabel)*!/invisibleTags.reduce((acc, tag) => {return acc + tag.clientWidth - 16},0);

        // this.#previousChange = change;
        // this.#previousChange = change;
        console.log('hiddenTags.length after acc', hiddenTags.length);
        // hiddenTags?.forEach(tag => tag.setAttribute('hidden', ''));
        // TODO filter all hidden tags and compare with hiddenTags and toggleAttribute
        // list.style.transform = `translateX(-${hiddenTagsWidth}px)`;
        // list.style.marginLeft = `-${hiddenTagsWidth + 16}px`; // TODO: + gap
        // this.tags?.forEach(tag => tag.style.background = 'purple');
        // hiddenTags.forEach(hiddenTag => hiddenTag.style.background = "red");
        // this.tags?.forEach(tag => tag.removeAttribute('hidden'));
        // hiddenTags?.forEach(tag => tag.setAttribute('hidden', ''));
        this.tags?.forEach(tag => tag.style.visibility = 'visible');
        // hiddenTags.forEach(tag => tag.style.visibility = 'hidden');
        invisibleTags.forEach(tag => tag.style.visibility = 'hidden');
        list.style.marginLeft = `-${hiddenTagsWidth + 32}px`; // TODO: + gap
      } else {
        list.style.marginLeft = 'inherit';
        // this.tags?.forEach(tag => tag.style.background = 'purple');
        // this.tags?.forEach(tag => tag.removeAttribute('hidden'));
        this.tags?.forEach(tag => tag.style.visibility = 'visible');
      }*/
    // });



    const tagGap = parseInt(getComputedStyle(this).getPropertyValue('--_gap') || '0');

    // Parent element (you can replace this with the actual parent element)
    const parentElement = this; //document.getElementById("parent"); // Replace "parent" with your actual element ID

    const groupEl = this.renderRoot.querySelector('.group') as HTMLDivElement;

// Initialize hidden tags array
    const hiddenTags2: Tag[] = [];

    const reversedTags = this.tags.slice().reverse();

// Reduce function to check whether a tag should be hidden and add it to the hidden tags array
    const reduceFn = reversedTags.reduce((acc: { visibleTags: Tag[], remainingWidth: number, hiddenTagsWidth: number, visibleTagsWidth: number}, tag: Tag) => {

      // Get the actual rendered width using offsetWidth
      const tagWidth = tag.offsetWidth; //tempSpan.offsetWidth;

        console.log('reduceFn acc.remainingWidth tagwidth', acc.remainingWidth, tagWidth, parentElement.clientWidth, tag);

      // Check if there is enough space for the tag
      if (acc.remainingWidth >= (tagWidth /** 1.2*/ * 2)) {
        acc.visibleTags.push(tag);
        acc.remainingWidth -= tagWidth;
        acc.visibleTagsWidth += tagWidth + tagGap;
        // tag.style.display = 'inline-flex'
      } else {
        // Otherwise, add the tag to the hidden tags array
        hiddenTags2.push(tag); // TODO accumulate tag width here to move to the left
        acc.hiddenTagsWidth += tagWidth;
        // tag.style.display = 'none'
      }

      console.log('acc inside reduce', acc, tag, tag.offsetLeft, tag.getBoundingClientRect(), tagGap);

      return acc;
    }
  , { visibleTags: [], remainingWidth: (parentElement.clientWidth - 50 /*- 100*//* - groupEl?.clientWidth*/), hiddenTagsWidth: 0, visibleTagsWidth: 0 }); // TODO: hidden remaining width

    console.log('after reduce', reduceFn, tagGap);

    console.log('reduceFn', hiddenTags2, reduceFn, groupEl, this.renderRoot, groupEl?.offsetWidth, groupEl?.clientWidth, groupEl?.getBoundingClientRect().width, (reduceFn.hiddenTagsWidth + groupEl?.getBoundingClientRect().width));

    // list.style.marginLeft = `-${reduceFn.hiddenTagsWidth + groupEl?.getBoundingClientRect().width}px`; // TODO: + gap

    if (hiddenTags2.length) {
      // list.style.width = `${reduceFn.visibleTagsWidth + reduceFn.remainingWidth - 70}px`;
      // list.style.width = `${reduceFn.visibleTagsWidth + 16}px`; // width + 16px gap between group and list
      list.style.flexBasis = `${reduceFn.visibleTagsWidth}px`; //`calc(100% - 46px - ${reduceFn.remainingWidth}px)`; // 46px gap and width of group  //`${reduceFn.visibleTagsWidth + 70}px`; // TODO: 70 aproximately a sum of group width and gap between group and label
      // list.style.transform = `translateX(-${reduceFn.remainingWidth}px)`;
    } else {
      list.style.width = 'auto';
      list.style.flexBasis = 'auto';

      // list.style.transform = `translateX(0)`;
    }

    // reduceFn.hiddenTagsWidth

    hiddenTags2.forEach(tag => tag.style.visibility = 'hidden');
    reduceFn.visibleTags?.forEach(visible => visible.style.visibility = 'visible');
/*    setTimeout(() => {
      hiddenTags2.forEach(tag => tag.style.display = 'none');
      reduceFn.visibleTags?.forEach(visible => visible.style.display = 'inline-flex');
      this.#hiddenLabel = hiddenTags2.length;
      this.requestUpdate();
    });*/
    // hiddenTags2.forEach(tag => tag.style.display = 'none');
    // reduceFn.visibleTags?.forEach(visible => visible.style.display = 'inline-flex');
    // TODO: use remainingwidth for the marginleft of translateX
    // TODO: remaining width not working properly?
// TODO: maybe sth with grid template columns 24px minmax(100px, 1924px) ???
    this.#hiddenLabel = hiddenTags2.length;
    this.#hiddenTags = hiddenTags2;
    this.requestUpdate();
  }

  // #onClick(event: Event & { target: HTMLElement }): void {
  //   console.log('event', event);
    // const tab = event.target.closest('sl-tab');
    //
    // if (!tab) {
    //   return;
    // }
    //
    // this.#updateSelectedTab(tab);
    // this.#scrollToTabPanelStart();
  // }

  #onKeydown(event: KeyboardEvent & { target: HTMLElement }): void {
    const tab = event.target.closest('sl-tab');

    if (tab && ['Enter', ' '].includes(event.key)) {
      // this.#updateSelectedTab(tab);
      // this.#scrollToTabPanelStart();
    }
  }

  #onMenuItemClick(tag: Tag): void {
    console.log(tag);
    // this.#updateSelectedTab(tab);
  }

  // #onScroll(event: Event & { target: HTMLElement }): void {
  //   let scrollStart = false,
  //     scrollEnd = false;
  //
  //   if (this.vertical) {
  //     const { clientHeight, scrollTop, scrollHeight } = event.target,
  //       scrollable = scrollHeight > clientHeight;
  //
  //     scrollStart = scrollable && scrollTop > 0;
  //     scrollEnd = scrollable && Math.round(scrollTop + clientHeight) < scrollHeight;
  //   } else {
  //     const { clientWidth, scrollLeft, scrollWidth } = event.target,
  //       scrollable = scrollWidth > clientWidth;
  //
  //     scrollStart = scrollable && scrollLeft > 0;
  //     scrollEnd = scrollable && Math.round(scrollLeft + clientWidth) < scrollWidth;
  //   }
  //
  //   this.toggleAttribute('scroll-start', scrollStart);
  //   this.toggleAttribute('scroll-end', scrollEnd);
  // }

  #onTabSlotChange(event: Event & { target: HTMLSlotElement }): void {
    console.log(event);
    // this.tabs = event.target.assignedElements({ flatten: true }).filter((el): el is Tab => el instanceof Tab);
    // this.tabs.forEach((tab, index) => {
    //   tab.id ||= `${this.#idPrefix}-tab-${index + 1}`;
    // });

    // this.selectedTab = this.tabs.find(tab => tab.selected);

    this.#rovingTabindexController.clearElementCache();
    // this.#linkTabsWithPanels();
  }

  #onTagsSlotChange(event: Event & { target: HTMLSlotElement }): void {
    console.log(event);
    // TODO: set size to tags here based on tag-list size
    this.tags = event.target
      .assignedElements({ flatten: true })
      .filter((el): el is Tag => el instanceof Tag); // TypeError: Cannot set property tags of #<TagList> which has only a getter

    // this.tags?.forEach((tag) => {
    //   tag => tag.size = this.size;
    // });

    // this.tabPanels = event.target
    //   .assignedElements({ flatten: true })
    //   .filter((el): el is TabPanel => el instanceof TabPanel);
    //
    // this.tabPanels.forEach((panel, index) => {
    //   panel.id ||= `${this.#idPrefix}-panel-${index + 1}`;
    // });

    // Set the no-panels attribute if there are no panels; used for styling
    // this.toggleAttribute('no-panels', this.tabPanels.length === 0);

    // this.#linkTabsWithPanels();
  }

  // #linkTabsWithPanels(): void {
  //   this.tabs?.forEach((tab, index) => {
  //     tab.toggleAttribute('selected', tab === this.selectedTab);
  //
  //     const panel = this.tabPanels?.at(index);
  //
  //     if (panel) {
  //       tab.setAttribute('aria-controls', `${this.#idPrefix}-panel-${index + 1}`);
  //       panel.setAttribute('aria-hidden', tab === this.selectedTab ? 'false' : 'true');
  //       panel.setAttribute('aria-labelledby', `${this.#idPrefix}-tab-${index + 1}`);
  //     } else {
  //       tab.removeAttribute('aria-controls');
  //     }
  //   });
  // }

  // #scrollIntoViewIfNeeded(tab: Tab): void {
  //   const scroller = this.renderRoot.querySelector('[part="scroller"]') as HTMLElement,
  //     scrollerRect = scroller.getBoundingClientRect(),
  //     tabRect = tab.getBoundingClientRect();
  //
  //   if (this.vertical) {
  //     if (tabRect.top < scrollerRect.top) {
  //       // The tab is above the top edge of the scroller
  //       scroller.scrollBy({ top: tabRect.top - scrollerRect.top });
  //     } else if (tabRect.bottom > scrollerRect.bottom) {
  //       // The tab is below the bottom edge of the scroller
  //       scroller.scrollBy({ top: tabRect.bottom - scrollerRect.bottom });
  //     }
  //   } else {
  //     if (tabRect.left < scrollerRect.left) {
  //       // The tab is to the left of the left edge of the scroller
  //       scroller.scrollBy({ left: tabRect.left - scrollerRect.left });
  //     } else if (tabRect.right > scrollerRect.right) {
  //       // The tab is to the right of the right edge of the scroller
  //       scroller.scrollBy({ left: tabRect.right - scrollerRect.right });
  //     }
  //   }
  // }

  // #scrollToTabPanelStart(): void {
  //   const { bottom: containerBottom = 0 } =
  //     this.renderRoot.querySelector('[part="container"]')?.getBoundingClientRect() || {},
  //     { top: wrapperTop = 0 } = this.renderRoot.querySelector('[part="wrapper"]')?.getBoundingClientRect() || {},
  //     { top = 0 } = this.renderRoot.querySelector('[part="panels"]')?.getBoundingClientRect() || {};
  //
  //   // Scroll to make sure the top of the panel is visible, but don't scroll too far
  //   // so the tab container/wrapper may become unstuck.
  //   getScrollParent(this)?.scrollBy({ top: top - (this.vertical ? wrapperTop : containerBottom) });
  // }
  //
  // #updateSelectedTab(selectedTab?: Tab): void {
  //   if (selectedTab !== this.selectedTab) {
  //     this.tabs?.forEach(tab => tab.toggleAttribute('selected', tab === selectedTab));
  //
  //     this.querySelectorAll('sl-tab-panel').forEach(panel => {
  //       panel.setAttribute('aria-hidden', selectedTab?.getAttribute('aria-controls') === panel.id ? 'false' : 'true');
  //     });
  //
  //     this.selectedTab = selectedTab;
  //     this.tabChangeEvent.emit(selectedTab ? this.tabs?.indexOf(selectedTab) ?? 0 : -1);
  //     this.#updateSelectionIndicator();
  //   }
  //
  //   if (selectedTab) {
  //     this.#scrollIntoViewIfNeeded(selectedTab);
  //   }
  // }
  //
  // #updateSelectionIndicator(): void {
  //   const indicator = this.renderRoot.querySelector('.indicator') as HTMLElement;
  //
  //   if (!this.selectedTab) {
  //     indicator.style.opacity = '';
  //     indicator.style.scale = '';
  //     indicator.style.transitionDuration = '0s';
  //     indicator.style.translate = '';
  //
  //     return;
  //   }
  //
  //   const tablist = this.renderRoot.querySelector('[part="tablist"]') as HTMLElement,
  //     rect = this.selectedTab.getBoundingClientRect();
  //
  //   let start = 0;
  //   if (this.vertical) {
  //     start = rect.top - tablist.getBoundingClientRect().top;
  //   } else {
  //     start = rect.left - tablist.getBoundingClientRect().left;
  //   }
  //
  //   indicator.style.opacity = '1';
  //   indicator.style.transitionDuration = this.#shouldAnimate ? '' : '0s';
  //   indicator.style.transitionProperty = indicator.style.translate === '' ? 'opacity' : '';
  //
  //   if (this.vertical) {
  //     indicator.style.scale = `1 ${rect.height / 100}`;
  //     indicator.style.translate = `0 ${start}px`;
  //   } else {
  //     indicator.style.scale = `${rect.width / 100} 1`;
  //     indicator.style.translate = `${start}px`;
  //   }
  // }
  //
  // #updateSize(): void {
  //   const scroller = this.renderRoot.querySelector('[part="scroller"]') as HTMLElement,
  //     tablist = this.renderRoot.querySelector('[part="tablist"]') as HTMLElement;
  //
  //   this.showMenu = this.vertical
  //     ? tablist.scrollHeight > scroller.offsetHeight
  //     : tablist.scrollWidth > scroller.offsetWidth;
  //
  //   if (this.showMenu) {
  //     this.menuItems = this.tabs?.map(tab => {
  //       const title = Array.from(tab.childNodes)
  //         .filter(node => node instanceof Text || (node instanceof Element && !node.slot))
  //         .reduce((acc, node) => acc + node.textContent?.trim() || '', '');
  //
  //       const subtitle = Array.from(tab.childNodes)
  //         .filter(node => node instanceof Element && node.slot === 'subtitle')
  //         .reduce((acc, node) => acc + node.textContent?.trim() || '', '');
  //
  //       return { tab, disabled: tab.disabled, title, subtitle };
  //     });
  //   } else {
  //     this.menuItems = undefined;
  //   }
  //
  //   this.selectedTab?.scrollIntoView(false);
  //
  //   this.#updateSelectionIndicator();
  // }
}

// TODO: stacked or full by default

// TODO: name slot tags??


// TODO: hidden tags? amount


// TODO: resize observer to hide tags?


// TODO: arrow keys only thorugh visible tags, not all

// TODO: on remove tag use also checking hidden and visible tags
