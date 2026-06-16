import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { OpenIssueCount } from './open-issue-count.js';

type Props = Pick<OpenIssueCount, 'issue'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-open-issue-count', OpenIssueCount);
} catch {
  /* empty */
}

export default {
  title: 'Open Issue Count',
  args: {
    issue: 1
  },
  argTypes: {
    issue: {
      control: 'number'
    }
  },
  render: ({ issue }) => html`<doc-open-issue-count .issue=${issue}></doc-open-issue-count>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const NoIssue: Story = {
  args: {
    issue: undefined
  }
};
