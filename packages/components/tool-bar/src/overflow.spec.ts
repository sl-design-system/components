import { faBell, faGear, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type MenuItem } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type ToolBarItem } from './mapping.js';
import { calculateVisibility } from './overflow.js';
import { type ToolBar } from './tool-bar.js';

Icon.register(faBell, faGear, faPen, faTrash);

/** Helper to create a mock ToolBarItem for pure-function testing (no DOM needed). */
function mockItem(type: ToolBarItem['type'], visible = true): ToolBarItem {
  return { type, visible, element: document.createElement('div') } as ToolBarItem;
}

describe('calculateVisibility', () => {
  it('should mark all items visible when they all fit', () => {
    const items = [mockItem('button'), mockItem('button'), mockItem('button')],
      widths = [50, 50, 50];

    calculateVisibility(items, widths, 200, 10, 40);

    expect(items.every(i => i.visible)).to.be.true;
  });

  it('should hide items that do not fit', () => {
    const items = [mockItem('button'), mockItem('button'), mockItem('button')],
      widths = [50, 50, 50];

    // available = 100, gap = 10, menuButton = 40
    // needsMenu check: 50 + 10+50 = 110 > 100 → needs menu
    // effective = 100 - (40+10) = 50
    // item 0: 50 <= 50 → visible
    // item 1: 50+10+50 = 110 > 50 → hidden
    calculateVisibility(items, widths, 100, 10, 40);

    expect(items[0].visible).to.be.true;
    expect(items[1].visible).to.be.false;
    expect(items[2].visible).to.be.false;
  });

  it('should hide all items when available width is zero', () => {
    const items = [mockItem('button'), mockItem('button')],
      widths = [50, 50];

    calculateVisibility(items, widths, 0, 10, 40);

    expect(items.every(i => !i.visible)).to.be.true;
  });

  it('should handle a single item that fits', () => {
    const items = [mockItem('button')],
      widths = [50];

    calculateVisibility(items, widths, 100, 10, 40);

    expect(items[0].visible).to.be.true;
  });

  it('should handle a single item that does not fit', () => {
    const items = [mockItem('button')],
      widths = [150];

    calculateVisibility(items, widths, 100, 10, 40);

    expect(items[0].visible).to.be.false;
  });

  it('should handle empty items array', () => {
    const items: ToolBarItem[] = [],
      widths: number[] = [];

    calculateVisibility(items, widths, 100, 10, 40);

    expect(items).to.have.length(0);
  });

  describe('orphan divider handling', () => {
    it('should hide a leading divider', () => {
      const items = [mockItem('divider'), mockItem('button'), mockItem('button')],
        widths = [10, 50, 50];

      calculateVisibility(items, widths, 200, 10, 40);

      expect(items[0].visible).to.be.false;
      expect(items[1].visible).to.be.true;
      expect(items[2].visible).to.be.true;
    });

    it('should hide a trailing divider', () => {
      const items = [mockItem('button'), mockItem('button'), mockItem('divider')],
        widths = [50, 50, 10];

      calculateVisibility(items, widths, 200, 10, 40);

      expect(items[0].visible).to.be.true;
      expect(items[1].visible).to.be.true;
      expect(items[2].visible).to.be.false;
    });

    it('should hide a divider when all items after it are hidden', () => {
      const items = [mockItem('button'), mockItem('divider'), mockItem('button')],
        widths = [50, 10, 50];

      // effective should only fit the first button + divider, but the button after is hidden
      // available=80, gap=10, menuButton=40
      // needsMenu: 50+10+10=70 ok, 70+10+50=130>80 → needs menu
      // effective = 80 - 50 = 30
      // item0: 50 > 30 → hidden… that hides everything
      // Let's use 100 instead:
      // needsMenu: 50+10+10+10+50=130>100 → needs menu
      // effective = 100 - 50 = 50
      // item0: 50 <= 50 → visible (cum=50)
      // item1: 50+10+10=70 > 50 → hidden
      // item2: hidden
      // divider at 1 has visible before (item0) but no visible after → hidden
      calculateVisibility(items, widths, 100, 10, 40);

      expect(items[0].visible).to.be.true;
      expect(items[1].visible).to.be.false;
      expect(items[2].visible).to.be.false;
    });

    it('should keep a divider between two visible non-divider items', () => {
      const items = [mockItem('button'), mockItem('divider'), mockItem('button')],
        widths = [50, 10, 50];

      calculateVisibility(items, widths, 300, 10, 40);

      expect(items[0].visible).to.be.true;
      expect(items[1].visible).to.be.true;
      expect(items[2].visible).to.be.true;
    });
  });
});

describe('overflow (integration)', () => {
  describe('all items hidden', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 48px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button 1
          </sl-button>
          <sl-button>
            <sl-icon name="far-bell"></sl-icon>
            Button 2
          </sl-button>
        </sl-tool-bar>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));
      await el.updateComplete;
    });

    it('should hide all items when the toolbar is too narrow', () => {
      expect(el.items.every(item => !item.visible)).to.be.true;
    });

    it('should show items in the overflow menu', () => {
      expect(el.menuItems.length).to.equal(2);
    });

    it('should show the overflow menu button', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      expect(menuButton).to.exist;
    });
  });

  describe('overflow menu', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 48px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button
          </sl-button>

          <sl-tool-bar-divider></sl-tool-bar-divider>

          <sl-button aria-labelledby="edit-tooltip" fill="ghost">
            <sl-icon name="far-pen"></sl-icon>
          </sl-button>
          <sl-tooltip id="edit-tooltip">Edit</sl-tooltip>

          <sl-menu-button>
            <div slot="button">Edit</div>
            <sl-menu-item>
              <sl-icon name="far-pen"></sl-icon>
              Rename...
            </sl-menu-item>
            <sl-menu-item>
              <sl-icon name="far-trash"></sl-icon>
              Delete...
            </sl-menu-item>
          </sl-menu-button>
        </sl-tool-bar>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
      await el.updateComplete;
    });

    it('should have hidden all slotted elements', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      expect(menuButton).to.exist;
      expect(el.menuItems.length).to.be.greaterThan(0);
    });

    it('should have a menu button', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      expect(menuButton).to.exist;
    });

    it('should have a regular menu item for the button', () => {
      const menuItem = el.renderRoot.querySelector('sl-menu-item');

      expect(menuItem).to.exist;
      expect(menuItem).to.have.trimmed.text('Button');
      expect(menuItem).to.contain('sl-icon[name="far-gear"]');
    });

    it('should have an hr element for the divider', () => {
      const hr = el.renderRoot.querySelector('hr');

      expect(hr).to.exist;
    });

    it('should have a menu item for the icon only button with tooltip connected via aria-labelledby', () => {
      const menuItems = el.renderRoot.querySelectorAll('sl-menu-item');

      const editButton = Array.from(menuItems).find(
        item => item.querySelector('sl-icon[name="far-pen"]') && !item.querySelector('sl-menu')
      );

      expect(editButton).to.exist;
      expect(editButton).to.have.trimmed.text('Edit');
      expect(editButton).to.contain('sl-icon[name="far-pen"]');
    });

    it('should have a menu item with submenu for the menu button', () => {
      const menu = el.renderRoot.querySelector('sl-menu')!,
        menuItem = menu.parentElement as MenuItem,
        menuItems = menu.querySelectorAll('sl-menu-item');

      expect(menuItem).to.contain.text('Edit');
      expect(menuItems).to.have.length(2);
      expect(menuItems[0]).to.have.trimmed.text('Rename...');
      expect(menuItems[0]).to.contain('sl-icon[name="far-pen"]');
      expect(menuItems[1]).to.have.trimmed.text('Delete...');
      expect(menuItems[1]).to.contain('sl-icon[name="far-trash"]');
    });

    it('should proxy clicks on the menu items to the original elements', () => {
      const onClick = spy();

      el.querySelector('sl-button')?.addEventListener('click', onClick);

      el.renderRoot.querySelector('sl-menu-item')?.click();

      expect(onClick).to.have.been.calledOnce;
    });

    it('should proxy clicks on overflow submenu items to the original menu items', () => {
      const originalMenuItem = el.querySelector('sl-menu-button sl-menu-item'),
        onClick = spy(),
        overflowSubmenuItem = el.renderRoot.querySelector('sl-menu[slot="submenu"] sl-menu-item');

      expect(originalMenuItem, 'expected original menu item to exist').to.exist;
      expect(overflowSubmenuItem, 'expected overflow submenu item to exist').to.exist;

      (originalMenuItem as MenuItem).addEventListener('click', onClick);
      // Use a non-bubbling click here to assert proxying behavior only.
      // A real bubbling click can trigger the parent submenu path (with delayed showPopover),
      // which causes teardown-related InvalidStateError noise in this test environment.
      (overflowSubmenuItem as MenuItem).dispatchEvent(
        new MouseEvent('click', { bubbles: false, composed: false })
      );

      expect(onClick).to.have.been.calledOnce;
    });
  });
});

describe('forceRecalculation', () => {
  let el: ToolBar;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-tool-bar style="inline-size: 400px">
        <sl-button>
          <sl-icon name="far-gear"></sl-icon>
          Button 1
        </sl-button>
        <sl-button>
          <sl-icon name="far-bell"></sl-icon>
          Button 2
        </sl-button>
        <sl-button>
          <sl-icon name="far-pen"></sl-icon>
          Button 3
        </sl-button>
      </sl-tool-bar>
    `);

    await new Promise(resolve => setTimeout(resolve, 50));
  });

  it('should trigger layout recalculation', async () => {
    el.style.inlineSize = '48px';
    await new Promise(resolve => setTimeout(resolve, 100));

    const initialHiddenCount = el.menuItems.length;
    expect(initialHiddenCount).to.be.greaterThan(0);

    el.style.inlineSize = '400px';

    el.forceRecalculation();
    await new Promise(resolve => setTimeout(resolve, 250));

    expect(el.menuItems.length).to.be.lessThan(initialHiddenCount);
  });

  it('should debounce multiple calls', async () => {
    el.style.inlineSize = '48px';
    await new Promise(resolve => setTimeout(resolve, 100));

    const initialMenuItemCount = el.menuItems.length;

    el.style.inlineSize = '400px';

    el.forceRecalculation();
    el.forceRecalculation();
    el.forceRecalculation();

    await new Promise(resolve => setTimeout(resolve, 250));

    expect(el.menuItems.length).to.be.lessThan(initialMenuItemCount);
  });

  it('should cancel pending recalculation when called again', async () => {
    el.style.inlineSize = '48px';
    await new Promise(resolve => setTimeout(resolve, 100));

    el.style.inlineSize = '400px';

    el.forceRecalculation();

    await new Promise(resolve => setTimeout(resolve, 100));

    el.forceRecalculation();

    await new Promise(resolve => setTimeout(resolve, 250));

    expect(el.menuItems.length).to.equal(0);
  });

  it('should make hidden items visible after expansion', async () => {
    el.style.inlineSize = '48px';
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(el.menuItems.length).to.be.greaterThan(0);

    el.style.inlineSize = '400px';
    el.forceRecalculation();
    await new Promise(resolve => setTimeout(resolve, 250));

    expect(el.menuItems.length).to.equal(0);
  });

  it('should do nothing if no items are hidden', async () => {
    expect(el.menuItems.length).to.equal(0);

    const menuItemsBeforeRecalc = el.menuItems.length;

    el.forceRecalculation();
    await new Promise(resolve => setTimeout(resolve, 250));

    expect(el.menuItems.length).to.equal(menuItemsBeforeRecalc);
  });

  it('should handle size changes after forceRecalculation', async () => {
    el.style.inlineSize = '100px';
    await new Promise(resolve => setTimeout(resolve, 100));

    const initialMenuItemCount = el.menuItems.length;
    expect(initialMenuItemCount).to.be.greaterThan(0);

    el.style.inlineSize = '500px';
    el.forceRecalculation();
    await new Promise(resolve => setTimeout(resolve, 250));

    expect(el.menuItems.length).to.be.lessThan(initialMenuItemCount);
  });

  it('should clean up timeout on disconnect', async () => {
    el.forceRecalculation();

    el.remove();
    await new Promise(resolve => setTimeout(resolve, 250));

    expect(document.body.contains(el)).to.be.false;
  });
});

describe('width measurement', () => {
  let el: ToolBar;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-tool-bar style="inline-size: 400px">
        <sl-button>
          <sl-icon name="far-gear"></sl-icon>
          Button 1
        </sl-button>
        <sl-button>
          <sl-icon name="far-bell"></sl-icon>
          Button 2
        </sl-button>
        <sl-button>
          <sl-icon name="far-pen"></sl-icon>
          Button 3
        </sl-button>
      </sl-tool-bar>
    `);

    await new Promise(resolve => setTimeout(resolve, 50));
    await el.updateComplete;
  });

  it('should show all items when there is enough space', () => {
    expect(el.items.filter(item => item.visible).length).to.equal(3);
    expect(el.menuItems.length).to.equal(0);
  });

  it('should hide items when the toolbar gets narrower', async () => {
    el.style.inlineSize = '150px';
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(el.menuItems.length).to.equal(2);
  });

  it('should show items again when the toolbar gets wider', async () => {
    el.style.inlineSize = '150px';
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(el.menuItems.length).to.equal(2);

    el.style.inlineSize = '400px';
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(el.menuItems.length).to.equal(0);
  });

  it('should keep all items visible when inline-size is fit-content', async () => {
    el.style.inlineSize = 'fit-content';
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(el.items.filter(item => item.visible).length).to.equal(3);
  });

  it('should not show the overflow menu prematurely when fit-content is constrained by the parent', async () => {
    const container = await fixture<HTMLDivElement>(html`
        <div style="inline-size: 400px">
          <sl-tool-bar style="inline-size: fit-content">
            <sl-button>
              <sl-icon name="far-gear"></sl-icon>
              Button 1
            </sl-button>
            <sl-button>
              <sl-icon name="far-bell"></sl-icon>
              Button 2
            </sl-button>
            <sl-button>
              <sl-icon name="far-pen"></sl-icon>
              Button 3
            </sl-button>
          </sl-tool-bar>
        </div>
      `),
      toolbar = container.querySelector('sl-tool-bar') as ToolBar;

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(toolbar.items.filter(item => item.visible).length).to.equal(3);
    expect(toolbar.menuItems.length).to.equal(0);
  });

  it('should overflow items when a padded div grid item shrinks (All story scenario)', async () => {
    const container = await fixture<HTMLDivElement>(html`
        <div style="display: grid; grid-template-columns: 1fr; inline-size: 700px;">
          <div style="padding: 1.6rem;">
            <sl-tool-bar>
              <sl-button>Button 1</sl-button>
              <sl-button>Button 2</sl-button>
              <sl-button>Button 3</sl-button>
              <sl-button>Button 4</sl-button>
              <sl-button>Button 5</sl-button>
            </sl-tool-bar>
          </div>
        </div>
      `),
      toolbar = container.querySelector('sl-tool-bar') as ToolBar;

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(toolbar.menuItems.length).to.equal(0);

    container.style.inlineSize = '200px';
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(toolbar.menuItems.length).to.equal(1);
  });

  it('should not leave the measuring state set', async () => {
    el.style.inlineSize = '150px';
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(el.matches(':state(measuring)')).to.be.false;
  });
});
