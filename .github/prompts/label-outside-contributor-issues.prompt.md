---
description: 'Create a GitHub Actions workflow script that labels external contributor issues weekly. Adds "cfa-submitted" label to issues from non-core-team members to identify outside CFA submissions.'
agent: 'agent'
tools: [github, execute/runInTerminal, read/readFile, create/createFile]
---

# Label Outside Contributor Issues

Create a GitHub Actions workflow that runs weekly to identify open issues posted by people outside the core team and apply the "cfa-submitted" label.

## Context

The GitHub Projects dashboard already displays the creation date, so the label itself serves as the identifier for external contributions. Age tracking can be sorted directly in the project view.

**Core team definition**: Members of the `@sl-design-system/core-team` GitHub team in the sl-design-system organization.

**Exclusions**: Skip issues that are already labeled as `duplicate`, `invalid`, `wontfix`, or `external`.

**Label strategy**: Add the `cfa-submitted` label to all open issues from non-core-team members. Remove the label if a core team member is marked as the author.

## Steps

### 1. Gather Requirements

Confirm the following:

- The `@sl-design-system/core-team` GitHub team exists and is current
- The `cfa-submitted` label exists in the repository
- The workflow should run against all open issues in the `sl-design-system/components` repository

### 2. Design the Workflow Structure

Create a GitHub Actions workflow file:

**File location**: `.github/workflows/label-outside-contributors.yml`

**Triggers**:

- **Scheduled**: Weekly (e.g., Monday at 9:00 AM UTC) for periodic updates
- **On issue opened**: Immediately when a new issue is submitted to label external contributions in real-time

**Key sections**:

- Fetch all open issues (or just the triggered issue if opened via the `issues` event)
- Filter for those authored by non-core-team members (and not already excluded)
- Apply or maintain `cfa-submitted` label

### 3. Implement Core Logic

The script should:

```pseudocode
1. List all open issues in the repository
2. For each issue:
   a. Check if the author is a member of @sl-design-system/core-team
   b. If NOT a core team member:
      - Check if issue has exclusion labels (skip if found)
      - Add label: "cfa-submitted"
   c. If IS a core team member:
      - Remove "cfa-submitted" label if present
3. Report results (optional: number of issues updated)
```

### 4. Handle Edge Cases

Consider:

- **Recently merged branches**: If an issue author is just added to the core team, the next run will remove the `cfa-submitted` label
- **Rate limits**: GitHub API has rate limits; implement pagination if handling many issues
- **Concurrent updates**: Use issue locks if needed to prevent race conditions

### 5. Create the Workflow File

Structure the workflow YAML with:

**Permissions needed**:

```yaml
permissions:
  issues: write
  contents: read
  organization-teams: read
```

**Triggers**:

```yaml
on:
  schedule:
    - cron: '0 9 * * 1' # Weekly Monday at 9:00 AM UTC
  issues:
    types: [opened]
```

**Implementation option**:

### 7. Test the Workflow

Before scheduling:

- Test the **on-issue-opened trigger**: Create a test issue as a non-core-team member and verify the `cfa-submitted` label is applied immediately
- Test the **scheduled trigger**: Run the workflow manually against existing issues
- Verify the `cfa-submitted` label is applied correctly to external contributor issues
- Check that core team members' issues are not labeled
- Confirm that the label is removed if an issue author is added to the core team

### 8. Validate and Deploy

- Merge the workflow file
- Enable the scheduled trigger
- Monitor the first run for errors
- Set up a brief summary (optional: post a workflow run summary to a channel or as a discussion post)

## Output / Communication

The labeled issues will be discoverable via:

- GitHub advanced search: `repo:sl-design-system/components label:"cfa-submitted" is:open`
- Saved filter: Can be bookmarked for quick access in GitHub
- GitHub Projects dashboard: Filter by the `cfa-submitted` label and sort by creation date to see age

**Real-time labeling**: External contributor issues are labeled immediately upon submission via the `issues: opened` trigger, so your team sees external contributions right away. The weekly scheduled run ensures any missed issues or newly-promoted core team members are handled during the periodic update.

No additional notification is sent; the labels themselves serve as the tracking mechanism. The projects dashboard's built-in creation date column replaces the need for week-based labels.

## Files to Create/Modify

1. `.github/workflows/label-outside-contributors.yml` — The main workflow file
2. `.github/scripts/label-outside-contributors.sh` — The logic script (if using bash)

## Questions to Resolve

- **Team member status**: Should bot accounts (e.g., Dependabot) be treated as core team or outside?
