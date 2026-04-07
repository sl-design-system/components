---
description: 'Create a pull request for the current branch. Use when: you want to open a PR, create a pull request, or submit changes for review.'
agent: 'agent'
tools: [github, execute/runInTerminal, read/readFile]
---

# Create Pull Request

Create a pull request for the current branch against the `main` branch.

## Steps

### 1. Gather Context

Get the current branch name and the list of commits:

```bash
git rev-parse --abbrev-ref HEAD
git log --oneline main..HEAD
```

Then get the diff summary:

```bash
git diff --stat main...HEAD
```

### 2. Determine the PR Title

Derive the title from the branch name and the changes:

- The branch name follows the pattern `feature/<issue-number>-<description>` or `fix/<issue-number>-<description>`
- Write a clear, concise title in imperative mood (e.g. "Add support for invoker API")

### 3. Write the PR Description

Study the actual changes using `git diff main...HEAD` and write a description that:

- Summarizes **what** changed and **why**
- Groups related changes together
- References the issue number using `Closes #<issue-number>` or `Fixes #<issue-number>`
- Uses markdown formatting for readability

### 4. Create the Pull Request

Use the GitHub MCP server to create the pull request in the `sl-design-system` organization, `components` repository:

- **base**: `main`
- **head**: current branch name
- **title**: the title from step 2
- **body**: the description from step 3
- **status**: mark the PR as a draft

### 5. Confirm

Show the user the URL of the created pull request.
