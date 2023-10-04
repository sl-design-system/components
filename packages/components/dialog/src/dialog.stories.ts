import type { Dialog } from './dialog.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { html } from 'lit';
import '../register.js';

const onClick = (event: Event & { target: HTMLElement }): void => {
  (event.target.nextElementSibling as Dialog).showModal();
};

// TODO: buttonsAlign as option

// TODO: with our own icon instead of closing icon in the top right corner

// TODO: story with different closing icon - two possibilities, with close slot or totally other slot and closing event

// TODO: buttons-align="start" as parameter

// TODO: story with different buttons for closing

export default {
  title: 'Dialog',
  args: {
    closingButton: true,
    title: 'Dialog title',
    subtitle: 'Dialog subtitle',
    buttonsAlign: 'end',
    bodyContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac augue neque. Nunc sed ex ut neque lacinia rutrum nec vitae mi. Donec dictum urna elit, et feugiat nunc fringilla nec. Maecenas nisi lorem, facilisis nec libero ut, hendrerit ultricies orci. Vivamus massa ligula, ultricies quis odio a, scelerisque tincidunt lorem. Morbi quis pulvinar augue. Nunc eros magna, laoreet vitae ornare at, iaculis quis diam. Duis odio urna, viverra ut ex mattis, egestas tincidunt enim. Praesent ac ex tincidunt, hendrerit sem et, aliquam metus. Nunc quis nisi nulla. Sed nibh ante, posuere eu volutpat vitae, elementum ut leo. Ut aliquet tincidunt tellus, ut molestie urna ultrices in. Suspendisse potenti. Nunc non nunc eu nibh venenatis vestibulum. Maecenas rutrum nibh lacus.
    Fusce sodales purus ut arcu hendrerit, non interdum nulla suscipit. Duis vitae felis facilisis, eleifend ipsum ut, condimentum est. Nullam metus massa, venenatis vitae suscipit in, feugiat quis turpis. In pellentesque velit at sagittis mattis. Nam ut tellus elit. Proin luctus lectus velit, ut ultricies libero blandit blandit. Aenean molestie est ipsum, in dictum turpis dictum nec. Curabitur eu convallis quam. Proin efficitur velit nec quam ornare, id volutpat ex ornare. Vestibulum porttitor lobortis lacus, eu efficitur libero congue nec. Maecenas volutpat massa non nulla venenatis, aliquet gravida lectus aliquam. Pellentesque aliquam blandit condimentum. Phasellus non justo odio. Phasellus a dui posuere, dapibus risus tempus, laoreet augue. Sed tincidunt, lorem a placerat aliquet, nisi erat lobortis orci, in aliquet mi ante nec nisi. Pellentesque porttitor elit sem, nec scelerisque arcu suscipit eu.`
  },
  argTypes: {
    buttonsAlign: {
      control: 'radio',
      options: ['start', 'end']
    }
  }
};

export const API: StoryObj = {
  render: ({ title, subtitle, buttonsAlign, bodyContent, closingButton }) => {
    return html`
      <sl-button fill="outline" size="md" @click=${onClick}>Show Dialog</sl-button>
      <sl-dialog ?closing-button=${closingButton} buttons-align=${buttonsAlign}>
        <span slot="subtitle">${subtitle}</span>
        <span slot="title">${title}</span>
        ${bodyContent}
        <!--<sl-button slot="header-buttons" fill="ghost" variant="default">
          <sl-icon name="face-smile"></sl-icon>
        </sl-button>-->
        <!--<sl-button slot="close" fill="ghost" variant="default">
          <sl-icon name="face-smile"></sl-icon>
        </sl-button>-->
        <!--        <p>
          Dolore nulla ad magna nostrud cillum veniam sint et consectetur anim Lorem. Sint fugiat id deserunt magna et
          tempor veniam eu fugiat fugiat. Fugiat mollit sint labore adipisicing do mollit eu dolore nulla enim cillum.
          Pariatur amet occaecat dolor consectetur aliqua mollit est aliquip irure cupidatat. Reprehenderit consectetur
          anim sunt voluptate dolor aute non enim aliqua sit. Occaecat irure ullamco aliquip minim labore occaecat dolor
          magna duis. Voluptate tempor amet cupidatat officia labore ipsum ad do. Dolore nulla ad magna nostrud cillum
          veniam sint et consectetur anim Lorem. Sint fugiat id deserunt magna et tempor veniam eu fugiat fugiat. Fugiat
          mollit sint labore adipisicing do mollit eu dolore nulla enim cillum. Pariatur amet occaecat dolor consectetur
          aliqua mollit est aliquip irure cupidatat. Reprehenderit consectetur anim sunt voluptate dolor aute non enim
          aliqua sit. Occaecat irure ullamco aliquip minim labore occaecat dolor magna duis. Voluptate tempor amet
          cupidatat officia labore ipsum ad do. Dolore nulla ad magna nostrud cillum veniam sint et consectetur anim
          Lorem. Sint fugiat id deserunt magna et tempor veniam eu fugiat fugiat. Fugiat mollit sint labore adipisicing
          do mollit eu dolore nulla enim cillum. Pariatur amet occaecat dolor consectetur aliqua mollit est aliquip
          irure cupidatat. Reprehenderit consectetur anim sunt voluptate dolor aute non enim aliqua sit. Occaecat irure
          ullamco aliquip minim labore occaecat dolor magna duis. Voluptate tempor amet cupidatat officia labore ipsum
          ad do. Dolore nulla ad magna nostrud cillum veniam sint et consectetur anim Lorem. Sint fugiat id deserunt
          magna et tempor veniam eu fugiat fugiat. Fugiat mollit sint labore adipisicing do mollit eu dolore nulla enim
          cillum. Pariatur amet occaecat dolor consectetur aliqua mollit est aliquip irure cupidatat. Reprehenderit
          consectetur anim sunt voluptate dolor aute non enim aliqua sit. Occaecat irure ullamco aliquip minim labore
          occaecat dolor magna duis. Voluptate tempor amet cupidatat officia labore ipsum ad do. Dolore nulla ad magna
          nostrud cillum veniam sint et consectetur anim Lorem. Sint fugiat id deserunt magna et tempor veniam eu fugiat
          fugiat. Fugiat mollit sint labore adipisicing do mollit eu dolore nulla enim cillum. Pariatur amet occaecat
          dolor consectetur aliqua mollit est aliquip irure cupidatat. Reprehenderit consectetur anim sunt voluptate
          dolor aute non enim aliqua sit. Occaecat irure ullamco aliquip minim labore occaecat dolor magna duis.
          Voluptate tempor amet cupidatat officia labore ipsum ad do. Dolore nulla ad magna nostrud cillum veniam sint
          et consectetur anim Lorem. Sint fugiat id deserunt magna et tempor veniam eu fugiat fugiat. Fugiat mollit sint
          labore adipisicing do mollit eu dolore nulla enim cillum. Pariatur amet occaecat dolor consectetur aliqua
          mollit est aliquip irure cupidatat.
        </p>-->
        <sl-button slot="action" sl-dialog-close>Close</sl-button>
        <sl-button slot="action" fill="solid" variant="primary" sl-dialog-close autofocus>Action</sl-button>
      </sl-dialog>
    `;
  }
};

export const DisableClose: StoryObj = {
  render: () => html`
    <sl-button fill="outline" @click=${onClick}>Show Dialog</sl-button>
    <sl-dialog disable-close closing-button>
      <span slot="title">Disable close</span>
      <p>You cannot close me by pressing the Escape key, or clicking the backdrop.</p>
      <sl-button slot="action" sl-dialog-close>Close</sl-button>
    </sl-dialog>
  `
};

export const ScrollingBody: StoryObj = {
  render: () => html`
    <style>
      sl-button {
        margin: 50vh 0 100vh;
      }
    </style>
    <sl-button fill="outline" @click=${onClick}>Show Dialog</sl-button>
    <sl-dialog closing-button>
      <div>You cannot scroll the body once the dialog is open.</div>
    </sl-dialog>
  `
};
