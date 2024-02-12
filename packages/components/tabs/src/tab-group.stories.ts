import type { Tab } from './tab.js';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/icon/register.js';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Tab Group',
  args: {
    vertical: false,
    alignment: 'start'
  },
  argTypes: {
    alignment: {
      control: 'inline-radio',
      options: ['start', 'filled']
    }
  }
};

const activateTab = (index: number): void => {
  const tabs: Tab[] = Array.from(document.querySelectorAll('#externalInteraction sl-tab'));
  if (tabs[index]) {
    document.querySelector('#externalInteraction sl-tab[selected]')?.removeAttribute('selected');
    tabs[index].setAttribute('selected', 'true');
  }
};

const tabChange = (event: CustomEvent): void => {
  const output = (document.querySelector('.sb-errordisplay_code') ||
    document.createElement('pre')) as HTMLOutputElement;

  event.preventDefault();
  document.querySelector('#output')?.after(output);

  output.textContent = (event.detail as number)?.toString();
};

const createLipsumParagraphs = (paragraphs: number): string => {
  const text = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam laoreet eget leo pretium congue. Aliquam pretium magna non varius mollis. Ut luctus finibus lectus eu dignissim. Vivamus tempus aliquam mauris eget egestas. Sed condimentum erat eget urna mollis finibus. Pellentesque eu urna eu est viverra porta. Nam at diam mollis enim posuere condimentum at vitae ex. Donec pulvinar suscipit turpis id aliquet. Sed nec neque eget purus ultrices porta. In pharetra velit sed neque gravida dignissim. Praesent vitae felis risus. Fusce id lobortis odio, a pretium mi.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et convallis erat. Cras gravida hendrerit sapien ut sodales. Cras venenatis commodo tristique. In hac habitasse platea dictumst. Integer ut tincidunt nisi. Sed gravida tristique nisl. Suspendisse blandit orci sem, non pulvinar quam lacinia ac. Proin tellus sapien, ultrices at lorem vel, pellentesque sagittis ligula. Phasellus eget varius nulla. Suspendisse vitae nunc arcu. Integer et lectus semper, molestie risus ut, ultrices risus. Aenean et sapien non purus ultricies porta id ut sem. Curabitur non orci quis nisl iaculis laoreet.',
    'Phasellus viverra tristique metus nec vulputate. Curabitur in augue ut eros sagittis auctor. Donec odio ante, egestas vitae turpis id, congue faucibus magna. Donec tristique ante velit, at sollicitudin arcu placerat in. In dignissim libero erat, ornare euismod orci tincidunt nec. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam eget vehicula diam, non efficitur lectus. Sed volutpat elit quis purus interdum, non venenatis massa luctus.',
    'Aenean elit enim, condimentum id tincidunt sit amet, accumsan ac ipsum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed condimentum augue et massa molestie, vel lobortis quam posuere. Nunc efficitur, diam ut sodales finibus, turpis enim tristique tortor, a ullamcorper urna leo a mi. Vestibulum turpis leo, maximus eu turpis quis, euismod aliquet odio. Duis quis neque sollicitudin, ultricies elit et, tempor libero. Nullam in turpis consequat, dictum ipsum et, consequat dolor. Maecenas porttitor auctor arcu, a lacinia ante dictum quis. Integer auctor venenatis semper. Praesent elementum iaculis velit, a ultrices neque lobortis ut. Pellentesque a tempus nisi. Phasellus eget porttitor sem, ut iaculis ex. Nam at dapibus erat, nec convallis lacus. Sed est quam, ornare id vestibulum ut, elementum id sem.',
    'In dui nunc, pharetra eget lorem vitae, interdum euismod tortor. Integer maximus semper nisl quis ullamcorper. Curabitur sit amet tortor gravida, suscipit est eu, sagittis felis. Sed vitae tincidunt sapien, ac volutpat augue. Duis tempor ex id pulvinar varius. Nullam pretium augue in scelerisque tempor. Integer et ex eu nisl consequat pretium et in lorem.',
    'Donec turpis risus, viverra vitae ultricies et, consectetur vitae ante. Aenean malesuada in urna sed auctor. Nulla libero tellus, maximus in est sit amet, dignissim efficitur eros. In a rhoncus lacus. Mauris a nunc facilisis, elementum lorem ut, finibus ex. Vestibulum et scelerisque magna. Mauris felis nunc, lacinia eget consequat tempor, mattis et neque. Ut fringilla urna eu sem gravida, eu vulputate eros accumsan. Etiam nec erat ipsum. Aenean non lorem mauris. Curabitur cursus est vitae turpis venenatis suscipit. Donec semper, ex in pretium tempor, metus ipsum tincidunt nulla, ut eleifend sapien nulla eu tortor.',
    'Curabitur accumsan augue risus, sit amet mollis arcu ullamcorper non. Ut viverra semper nisi et finibus. Nulla porta vehicula arcu eu venenatis. Donec ac turpis ornare quam fermentum mattis ac vel turpis. Quisque aliquam libero massa, ac tempus nibh imperdiet at. Sed gravida quis nibh nec dapibus. Mauris venenatis elit et viverra convallis. Nullam blandit eros id ligula ornare dignissim.',
    'Nunc commodo enim a lorem molestie elementum. Fusce blandit justo urna, sit amet placerat magna suscipit quis. Donec scelerisque metus vitae eros pharetra consequat. Aliquam vestibulum et sapien sed dictum. Nunc ultrices sit amet lacus at consequat. Integer a faucibus turpis. Nulla eu eros rutrum nulla aliquam tempor at vel augue. Donec a purus eu libero sollicitudin elementum tempus vel arcu. Aliquam pellentesque, odio in finibus ultricies, justo elit iaculis libero, sit amet varius massa dui at libero. Praesent nunc neque, gravida vel purus at, vulputate tincidunt lectus. Mauris sit amet augue nisi. Duis ac metus porttitor, mattis nulla accumsan, ullamcorper est. Vivamus ac hendrerit orci, eget tincidunt ligula. Morbi ac nunc sit amet tellus euismod aliquam. Donec iaculis metus quis tortor vulputate dictum. Integer semper cursus tincidunt.',
    'Donec posuere est vel felis consectetur, sit amet pharetra erat volutpat. Aliquam suscipit fermentum justo, tincidunt tincidunt enim hendrerit id. Praesent eleifend, ipsum ac volutpat ullamcorper, elit purus tristique lorem, in maximus mauris dolor volutpat orci. Phasellus gravida ut turpis quis vehicula. Cras mattis, velit sed sagittis rhoncus, urna est interdum massa, eget ultricies justo erat ut tortor. Curabitur rutrum lorem augue. Maecenas ipsum odio, iaculis ac placerat ut, sollicitudin vel nunc. Aliquam erat volutpat. Aliquam vitae velit placerat, pharetra lectus a, semper risus. Vivamus in lobortis nibh, in finibus risus. Aenean condimentum dapibus tortor, eget condimentum dolor commodo nec. Morbi eu dui lectus. Nullam congue ullamcorper orci. Ut laoreet rutrum sodales. In hac habitasse platea dictumst. Sed magna libero, ultrices vitae facilisis a, lobortis sed turpis.',
    'Nullam eu orci nunc. Sed at suscipit ante. Mauris nunc dui, pulvinar eu nibh nec, consequat semper felis. In accumsan consequat malesuada. Proin sem ex, porta ut massa ac, feugiat luctus nisi. Proin faucibus maximus nibh id vehicula. Mauris vel nisl condimentum, tristique nisl et, euismod purus. Integer ut dui libero. Nam ultricies felis et erat vulputate, non egestas nisl accumsan. Phasellus imperdiet tempus nulla sed vestibulum. Nunc vulputate dui mi, sed pretium diam vehicula a. In in enim pharetra, aliquet magna et, aliquam dolor.'
  ];
  return text.splice(0, paragraphs).join(' ');
};

export const API: StoryObj = {
  render: ({ vertical, alignment }) => {
    return html`
      <sl-tab-group ?vertical=${vertical} .alignment=${alignment}>
        <sl-tab disabled>
          <sl-icon slot="icon" name="star" size="md"></sl-icon>
          Tab 1
          <span slot="subtitle">Tab 1 subtitle</span>
        </sl-tab>
        <sl-tab-panel><p>Contents tab 1</p></sl-tab-panel>

        <sl-tab>
          <sl-icon slot="icon" name="star" size="md"></sl-icon>
          Tab 2
          <span slot="subtitle">Tab 2 subtitle</span>
          <sl-badge slot="badge" size="lg" variant="danger">4</sl-badge>
        </sl-tab>
        <sl-tab-panel>
          <div>Contents tab 2</div>
        </sl-tab-panel>

        <sl-tab>
          <sl-icon slot="icon" name="star" size="md"></sl-icon>
          Tab 3
          <span slot="subtitle">Tab 3 subtitle</span>
          <sl-badge slot="badge" size="lg" variant="danger">100</sl-badge>
        </sl-tab>
        <sl-tab-panel>
          <div>Contents tab 3</div>
        </sl-tab-panel>

        <sl-tab>
          <sl-icon slot="icon" name="star" size="md"></sl-icon>
          Tab 4
        </sl-tab>
        <sl-tab-panel> Contents tab 4 </sl-tab-panel>

        <sl-tab>
          <sl-icon slot="icon" name="star" size="md"></sl-icon>
          Tab 5
        </sl-tab>
        <sl-tab-panel>Contents tab 5</sl-tab-panel>
      </sl-tab-group>
    `;
  }
};

export const LongTitles: StoryObj = {
  render: ({ vertical, alignment }) => html` <sl-tab-group ?vertical=${vertical} .alignment=${alignment}>
    <sl-tab selected>This is the first tab a very looong example of the tab</sl-tab>
    <sl-tab-panel>Contents tab 1 ${createLipsumParagraphs(10)}</sl-tab-panel>

    <sl-tab>This is the second tab</sl-tab>
    <sl-tab-panel>Contents tab 2 ${createLipsumParagraphs(3)}</sl-tab-panel>

    <sl-tab>This is the third tab</sl-tab>
    <sl-tab-panel>Contents tab 3 ${createLipsumParagraphs(2)}</sl-tab-panel>

    <sl-tab disabled>This is the fourth tab (disabled)</sl-tab>
    <sl-tab-panel>Contents tab 4</sl-tab-panel>

    <sl-tab>This is the fifth tab</sl-tab>
    <sl-tab-panel>Contents tab 5</sl-tab-panel>

    <sl-tab>This is the sixth tab</sl-tab>
    <sl-tab-panel>Contents tab 6</sl-tab-panel>

    <sl-tab>This is the seventh tab</sl-tab>
    <sl-tab-panel>Contents tab 7</sl-tab-panel>

    <sl-tab>This is the eighth tab</sl-tab>
    <sl-tab-panel>Contents tab 8</sl-tab-panel>

    <sl-tab>This is the nineth tab</sl-tab>
    <sl-tab-panel>Contents tab 9</sl-tab-panel>

    <sl-tab>This is the tenth tab</sl-tab>
    <sl-tab-panel>Contents tab 10</sl-tab-panel>
  </sl-tab-group>`
};

export const StickyTabs: StoryObj = {
  render: ({ vertical, alignment }) => html` <style>
      sl-tab-group::part(container) {
        position: sticky;
      }

      sl-tab-group[vertical]::part(container) {
        inset-block-start: 16px;
        align-self: start;
      }

      sl-tab-group::part(container) {
        inset-block-start: -4px;
      }
    </style>
    <div class="tab-wrapper">
      <sl-tab-group ?vertical=${vertical} .alignment=${alignment}>
        <sl-tab selected>This is the first tab</sl-tab>
        <sl-tab-panel>Contents tab 1 ${createLipsumParagraphs(10)}</sl-tab-panel>

        <sl-tab>This is the second tab</sl-tab>
        <sl-tab-panel>Contents tab 2 ${createLipsumParagraphs(3)}</sl-tab-panel>

        <sl-tab>This is the third tab</sl-tab>
        <sl-tab-panel>Contents tab 3 ${createLipsumParagraphs(2)}</sl-tab-panel>

        <sl-tab disabled>This is the fourth tab (disabled)</sl-tab>
        <sl-tab-panel>Contents tab 4</sl-tab-panel>

        <sl-tab>This is the fifth tab</sl-tab>
        <sl-tab-panel>Contents tab 5</sl-tab-panel>

        <sl-tab>This is the sixth tab</sl-tab>
        <sl-tab-panel>Contents tab 6</sl-tab-panel>

        <sl-tab>This is the seventh tab</sl-tab>
        <sl-tab-panel>Contents tab 7</sl-tab-panel>

        <sl-tab>This is the eighth tab</sl-tab>
        <sl-tab-panel>Contents tab 8</sl-tab-panel>

        <sl-tab>This is the nineth tab</sl-tab>
        <sl-tab-panel>Contents tab 9</sl-tab-panel>

        <sl-tab>This is the tenth tab</sl-tab>
        <sl-tab-panel>Contents tab 10</sl-tab-panel>
      </sl-tab-group>
    </div>`
};

export const VerticalInSmallContainer: StoryObj = {
  render: ({ alignment }) => html` <style>
      sl-tab-group {
        block-size: 300px;
      }

      sl-tab-panel {
        overflow: auto;
      }

      sl-tab-group::part(wrapper) {
        position: sticky;
        inset-block-start: 0;
        align-self: flex-start;
      }

      .tab-wrapper {
        border: 4px dashed #c6c6c6;
        padding: 20px;
      }
    </style>
    <div class="tab-wrapper">
      <sl-tab-group vertical .alignment=${alignment}>
        <sl-tab selected>This is the first tab</sl-tab>
        <sl-tab-panel>Contents tab 1 ${createLipsumParagraphs(10)}</sl-tab-panel>

        <sl-tab>This is the second tab</sl-tab>
        <sl-tab-panel>Contents tab 2 ${createLipsumParagraphs(3)}</sl-tab-panel>

        <sl-tab>This is the third tab</sl-tab>
        <sl-tab-panel>Contents tab 3 ${createLipsumParagraphs(2)}</sl-tab-panel>

        <sl-tab disabled>This is the fourth tab (disabled)</sl-tab>
        <sl-tab-panel>Contents tab 4</sl-tab-panel>

        <sl-tab>This is the fifth tab</sl-tab>
        <sl-tab-panel>Contents tab 5</sl-tab-panel>

        <sl-tab>This is the sixth tab</sl-tab>
        <sl-tab-panel>Contents tab 6</sl-tab-panel>

        <sl-tab>This is the seventh tab</sl-tab>
        <sl-tab-panel>Contents tab 7</sl-tab-panel>

        <sl-tab>This is the eighth tab</sl-tab>
        <sl-tab-panel>Contents tab 8</sl-tab-panel>

        <sl-tab>This is the nineth tab</sl-tab>
        <sl-tab-panel>Contents tab 9</sl-tab-panel>

        <sl-tab>This is the tenth tab</sl-tab>
        <sl-tab-panel>Contents tab 10</sl-tab-panel>
      </sl-tab-group>
    </div>`
};

export const ExternalInteraction: StoryObj = {
  render: ({ vertical }) => html`
    <sl-tab-group ?vertical=${vertical} id="externalInteraction" @sl-tab-change=${tabChange}>
      <sl-tab selected>Tab 1</sl-tab>
      <sl-tab>Tab 2</sl-tab>
      <sl-tab disabled>Tab 3</sl-tab>
      <sl-tab>Tab 4</sl-tab>
      <sl-tab>Tab 5</sl-tab>
    </sl-tab-group>
    <hr />
    <sl-button @click="${() => activateTab(1)}"> Activate tab 2</sl-button>
    <sl-button @click="${() => activateTab(3)}"> Activate tab 4</sl-button>
    <h2 id="output">Active tab:</h2>
  `
};

export const SingleTab: StoryObj = {
  render: ({ vertical }) => html`
    <sl-tab-group ?vertical=${vertical} id="singleTab" @sl-tab-change=${tabChange}>
      <sl-tab>Tab 1</sl-tab>
      <sl-tab>Tab 2</sl-tab>
      <sl-tab selected>Tab 3</sl-tab>
      <sl-tab>Tab 4</sl-tab>
      <sl-tab>Tab 5</sl-tab>
      <sl-tab-panel>
        <p>place your router-outlet in this panel</p>
        <h2 id="output">Active tab:</h2>
      </sl-tab-panel>
    </sl-tab-group>
  `
};
