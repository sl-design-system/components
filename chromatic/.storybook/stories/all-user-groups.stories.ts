import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/breadcrumbs/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/callout/register.js';
import '@sl-design-system/card/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/inline-message/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/tag/register.js';
import '@sl-design-system/tool-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { All as FormAll } from '../../../packages/components/form/src/form.stories';
import { html } from 'lit';
import { ecosystemMatrixModes } from '../modes';

if (!window.SLDS.icons['far-plus']) {
  Icon.register(faPlus);
}

const typographyStyles = [
  { name: 'Display', className: 'display', sizes: ['sm', 'md', 'lg'] },
  { name: 'Heading', className: 'heading', sizes: ['sm', 'md', 'lg'] },
  { name: 'Title', className: 'title', sizes: ['sm', 'md', 'lg'] },
  { name: 'Label', className: 'label', sizes: ['sm', 'md', 'lg'] },
  { name: 'Text', className: 'text', sizes: ['sm', 'md', 'lg'] },
  { name: 'Caption', className: 'caption', sizes: ['md', 'lg'] }
];

export default {
  title: 'All User Groups',
  parameters: {
    chromatic: {
      modes: ecosystemMatrixModes
    }
  }
} satisfies Meta;

export const Typography: StoryObj = {
  play: async () => {
    await document.fonts.ready;
  },
  render: () => html`
    <style>
      .typography-gallery {
        display: grid;
        gap: 16px;
        width: 680px;
        max-width: 100%;
      }

      .typography-row {
        display: grid;
        grid-template-columns: 90px minmax(0, 1fr) minmax(0, 240px);
        gap: 16px;
        align-items: start;
        border-bottom: 1px solid #ccc;
        padding-bottom: 16px;
      }

      .typography-name {
        font: 12px/1.5 sans-serif;
      }

      .typography-sample {
        margin: 0;
        overflow-wrap: anywhere;
      }
    </style>
    <div class="typography-gallery">
      ${typographyStyles.flatMap(({ name, className, sizes }) =>
        sizes.map(
          size => html`
            <div class="typography-row">
              <span class="typography-name">${name} ${size}</span>
              <p class="typography-sample ${className} ${size}">Learning together</p>
              <p class="typography-sample ${className} ${size}">
                A longer example that wraps across multiple lines in a narrow space.
              </p>
            </div>
          `
        )
      )}
    </div>
  `
};

export const AllForm = { ...FormAll };

export const ActionsAndNavigation: StoryObj = {
  play: async ({ canvasElement }) => {
    const menuButton = canvasElement.querySelector('sl-menu-button');
    if (!menuButton) {
      throw new Error('The user groups menu button was not rendered');
    }

    await menuButton.updateComplete;
    await menuButton.menu.updateComplete;
    await document.fonts.ready;

    menuButton.menu.showPopover();

    if (!menuButton.menu.matches(':popover-open')) {
      throw new Error('The user groups menu did not open');
    }
  },
  render: () => html`
    <style>
      .actions-user-groups {
        display: grid;
        gap: 24px;
        max-width: 720px;
      }

      .actions-user-groups {
        display: grid;
        gap: 12px;
        min-width: 0;
      }

      .actions-user-groups h2 {
        margin: 0;
      }

      .actions-user-groups-buttons,
      .actions-user-groups-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }

      .actions-user-groups-toolbar {
        inline-size: 380px;
        max-inline-size: 100%;
      }

      .actions-user-groups-tags sl-tag {
        max-inline-size: 220px;
      }

      .actions-user-groups-breadcrumbs {
        max-inline-size: 480px;
      }

      .actions-user-groups-menu {
        //margin: auto !important;
        //position: static !important;
      }
    </style>

    <div class="actions-user-groups">
      <section class="actions-user-groups-section">
        <h2 class="heading sm">Buttons</h2>
        <div class="actions-user-groups-buttons">
          <sl-button variant="primary">
            <sl-icon name="far-plus"></sl-icon>
            Create a new learning activity
          </sl-button>
          <sl-button fill="outline">
            <sl-icon name="far-plus"></sl-icon>
            Add resource
          </sl-button>
          <sl-button aria-label="Add item" fill="ghost">
            <sl-icon name="far-plus"></sl-icon>
          </sl-button>
        </div>
      </section>

      <section class="actions-user-groups-section">
        <h2 class="heading sm">Toolbar</h2>
        <sl-tool-bar
          class="actions-user-groups-toolbar"
          fill="outline"
          aria-label="Learning activity actions">
          <sl-button fill="outline">
            <sl-icon name="far-plus"></sl-icon>
            Create activity
          </sl-button>
          <sl-button fill="outline">Duplicate selected activity</sl-button>
          <sl-tool-bar-divider></sl-tool-bar-divider>
          <sl-button fill="outline">Move to another course</sl-button>
        </sl-tool-bar>
      </section>

      <section class="actions-user-groups-section">
        <h2 class="heading sm">Tags</h2>
        <div class="actions-user-groups-tags">
          <sl-tag>Required</sl-tag>
          <sl-tag removable>Draft for the next school year</sl-tag>
          <sl-tag variant="info">Recently updated learning material</sl-tag>
        </div>
      </section>

      <section class="actions-user-groups-section">
        <h2 class="heading sm">Breadcrumbs</h2>
        <sl-breadcrumbs class="actions-user-groups-breadcrumbs" aria-label="Breadcrumb">
          <a href="#">Courses</a>
          <a href="#">Language and communication</a>
          <a href="#">Materials for the upcoming school year</a>
          <a href="#">Current activity</a>
        </sl-breadcrumbs>
      </section>

      <section class="actions-user-groups-section">
        <h2 class="heading sm">Open menu</h2>
        <sl-menu-button position="bottom-end">
          <span slot="button">More settings</span>
          <sl-menu-item-group selects="single">
            <sl-menu-item selectable selected shortcut="$mod+Digit1">List</sl-menu-item>
            <sl-menu-item selectable shortcut="$mod+Digit2">Cards</sl-menu-item>
          </sl-menu-item-group>
          <hr />
          <sl-menu-item>
            Sort by
            <sl-menu selects="single" slot="submenu">
              <sl-menu-item selectable selected>Newest</sl-menu-item>
              <sl-menu-item selectable>Oldest</sl-menu-item>
              <sl-menu-item selectable>Name</sl-menu-item>
            </sl-menu>
          </sl-menu-item>
          <hr />
          <sl-menu-item aria-disabled="true">Edit</sl-menu-item>
          <sl-menu-item>Remove</sl-menu-item>
        </sl-menu-button>
      </section>
    </div>
  `
};

export const ContentLayout: StoryObj = {
  play: async () => {
    await document.fonts.ready;
  },
  render: () => html`
    <style>
      .content-layout-user-groups {
        display: grid;
        gap: 24px;
        max-inline-size: 640px;
      }

      .content-layout-user-groups section {
        display: grid;
        gap: 12px;
        min-inline-size: 0;
      }

      .content-layout-user-groups h2 {
        margin: 0;
      }

      .content-layout-copy {
        display: grid;
        gap: 12px;
      }

      .content-layout-copy p {
        margin: 0;
      }
    </style>

    <div class="content-layout-user-groups">
      <section>
        <h2 class="heading sm">Card</h2>
        <sl-card>
          <h2>Preparing learners for the upcoming school year with updated course materials</h2>
          <p slot="body">
            Review the latest lessons, activities, and supporting resources for your class. This
            longer description should wrap within the card while leaving enough room for its action.
          </p>
          <sl-button slot="actions" variant="primary">Review all course materials</sl-button>
        </sl-card>
      </section>

      <section>
        <h2 class="heading sm">Callout</h2>
        <sl-callout variant="info">
          <h2 slot="title">Action required before the new term begins</h2>
          <div class="content-layout-copy">
            <p>
              Check the course details and confirm that the learning materials are ready for every
              student. Changes may take a few minutes to appear across your courses.
            </p>
            <sl-button fill="outline" variant="info">View course readiness details</sl-button>
          </div>
        </sl-callout>
      </section>

      <section>
        <h2 class="heading sm">Inline message</h2>
        <sl-inline-message variant="warning">
          <h2 slot="title">Some learning materials need your attention</h2>
          <div class="content-layout-copy">
            <p>
              A few resources are not available to all learners yet. Review their access settings
              and update the materials before sharing this course.
            </p>
            <sl-button fill="outline" variant="warning">Review access settings</sl-button>
          </div>
        </sl-inline-message>
      </section>
    </div>
  `
};
