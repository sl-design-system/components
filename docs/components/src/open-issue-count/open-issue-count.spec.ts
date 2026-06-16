import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { OpenIssueCount: OpenIssueCountClass } = await import(
  '@sl-design-system/doc-components/open-issue-count/open-issue-count'
);

try {
  customElements.define('doc-open-issue-count', OpenIssueCountClass);
} catch {
  /* empty */
}

const mockSubIssues = (issues: Array<{ state: string }>): void => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(issues), { status: 200, headers: { 'Content-Type': 'application/json' } })
  );
};

describe('doc-open-issue-count', () => {
  let el: InstanceType<typeof OpenIssueCountClass>;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-open-issue-count></doc-open-issue-count>`);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(OpenIssueCountClass);
    });

    it('should render nothing when no issue is set', () => {
      const count = el.renderRoot.querySelector('.count');
      expect(count).to.not.exist;
    });
  });

  describe('with issue number', () => {
    beforeEach(async () => {
      mockSubIssues([{ state: 'open' }, { state: 'open' }, { state: 'closed' }]);
      el = await fixture(html`<doc-open-issue-count .issue=${42}></doc-open-issue-count>`);
    });

    it('should render the count of open sub-issues', () => {
      const count = el.renderRoot.querySelector('.count');
      expect(count).to.exist;
      expect(count).to.have.trimmed.text('2');
    });

    it('should fetch sub-issues from the GitHub API', () => {
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/sl-design-system/components/issues/42/sub_issues',
        expect.objectContaining({ headers: expect.objectContaining({ Accept: 'application/vnd.github+json' }) })
      );
    });
  });

  describe('with all issues closed', () => {
    beforeEach(async () => {
      mockSubIssues([{ state: 'closed' }, { state: 'closed' }]);
      el = await fixture(html`<doc-open-issue-count .issue=${10}></doc-open-issue-count>`);
    });

    it('should render 0 open sub-issues', () => {
      const count = el.renderRoot.querySelector('.count');
      expect(count).to.exist;
      expect(count).to.have.trimmed.text('0');
    });
  });

  describe('with no sub-issues', () => {
    beforeEach(async () => {
      mockSubIssues([]);
      el = await fixture(html`<doc-open-issue-count .issue=${99}></doc-open-issue-count>`);
    });

    it('should render 0', () => {
      const count = el.renderRoot.querySelector('.count');
      expect(count).to.exist;
      expect(count).to.have.trimmed.text('0');
    });
  });

  describe('on API error', () => {
    beforeEach(async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }));
      el = await fixture(html`<doc-open-issue-count .issue=${1}></doc-open-issue-count>`);
    });

    it('should render nothing on error', () => {
      const count = el.renderRoot.querySelector('.count');
      expect(count).to.not.exist;
    });
  });

  describe('on network failure', () => {
    beforeEach(async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
      el = await fixture(html`<doc-open-issue-count .issue=${1}></doc-open-issue-count>`);
    });

    it('should render nothing on network failure', () => {
      const count = el.renderRoot.querySelector('.count');
      expect(count).to.not.exist;
    });
  });

  describe('issue change', () => {
    beforeEach(async () => {
      mockSubIssues([{ state: 'open' }]);
      el = await fixture(html`<doc-open-issue-count .issue=${1}></doc-open-issue-count>`);
    });

    it('should re-fetch when the issue number changes', async () => {
      mockSubIssues([{ state: 'open' }, { state: 'open' }, { state: 'open' }]);
      el.issue = 2;
      await el.updateComplete;

      const count = el.renderRoot.querySelector('.count');
      expect(count).to.have.trimmed.text('3');
    });
  });
});
