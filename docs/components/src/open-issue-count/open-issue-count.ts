import { LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

export class OpenIssueCount extends LitElement {
  /** The GitHub issue number to look up sub-issues for. */
  @property({ type: Number }) issue?: number;

  /** @internal The number of open sub-issues, once fetched. */
  @state() count?: number;

  override updated(changes: Map<string, unknown>): void {
    super.updated(changes);

    if (changes.has('issue')) {
      void this.#fetchCount();
    }
  }

  override render(): TemplateResult | typeof nothing {
    return html`${this.count}` ?? nothing;
  }

  async #fetchCount(): Promise<void> {
    if (this.issue === undefined) {
      this.count = undefined;
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/sl-design-system/components/issues/${this.issue}/sub_issues`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );

      if (response.ok) {
        const subIssues = (await response.json()) as Array<{ state: string }>;

        this.count = subIssues.filter(i => i.state === 'open').length;
      }
    } catch {
      // Render nothing on failure
    }
  }
}
