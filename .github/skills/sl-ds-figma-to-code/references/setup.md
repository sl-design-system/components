# Setup fixes

Read this when a line of the setup check is not `ok`.
Give the developer the fix for their client, wait, then check the line again.

## Figma MCP server

The remote server is `https://mcp.figma.com/mcp`.
`whoami` exists only on the remote server; with Figma's desktop server, ask the developer for their seat.

- Not installed, no Figma tools even after a tool search:
  - VS Code: install the Figma plugin for GitHub Copilot from the awesome-copilot marketplace, which includes Figma's skills; or run `MCP: Open User Configuration` and add `"figma": {"type": "http", "url": "https://mcp.figma.com/mcp"}` under `servers`.
  - Claude Code: `claude plugin install figma@claude-plugins-official`, then restart Claude Code.
  - Copilot CLI: `copilot plugin install figma@awesome-copilot`.
  - It pays off with a Dev or Full seat; with a View or Collab seat, the screenshot path is the usual choice.
- Signed out, with only `authenticate` and `complete_authentication` or an authentication error:
  - VS Code: `MCP: List Servers`, select figma, Start Server, then Allow access in the browser.
  - Claude Code: `/mcp`, select figma, Authenticate, then Allow access in the browser.
  - Other clients: sign in to Figma when the client prompts.
- No access, the file or node is not found or not allowed: ask the file's owner for access, or work from images.
- Limit reached: View and Collab seats get 20 calls a month, Dev and Full seats 200 a day (600 on Enterprise) plus a per-minute limit; `whoami` does not count.
- Fallback for each: the screenshot path.

## Figma's skills

`figma-design-to-code` comes with Figma's plugin above; without the plugin, install it from https://github.com/figma/mcp-server-guide next to this skill.
Fallback: the Figma MCP output alone, or the screenshot path.

## Design images

- "Copy as PNG": in Figma, right-click the frame, Copy/Paste as, Copy as PNG; then paste it into the chat.
- When copying is blocked, because the file's "Viewers can copy, share, and export from this file" setting is off (changing it needs edit access), ask the designer or the ticket's author to export the frames.
- Jira attachments: only the Atlassian MCP v2 server has `downloadJiraIssueAttachment`; on v1, the developer pastes the images.
- Images attached to GitHub issues in private repositories cannot be read by a tool; the developer pastes them.

## Atlassian MCP (Jira)

The remote server is `https://mcp.atlassian.com/v2/mcp`; v1 has no attachment tools, and a v1 sign-in does not carry over to v2.

- Not installed:
  - VS Code: Extensions view, search `@mcp Atlassian`, Install.
  - Claude Code: `claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp`.
  - Copilot CLI: `copilot mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp`.
- Signed out: as for Figma (VS Code `MCP: List Servers`, Claude Code `/mcp`), then sign in in the browser.
- No access: ask for access to the Jira project.
- Fallback: the developer pastes the ticket's text and images.

## GitHub issues

- `gh`: install it from https://cli.github.com, then `gh auth login`.
- Or the GitHub MCP server: built into Copilot CLI; in VS Code, add `https://api.githubcopilot.com/mcp/` as an HTTP server and sign in.
- Fallback: the developer pastes the issue's text and images.

## Browser tool

- VS Code: the built-in browser tools (`openBrowserPage`, `screenshotPage` and others), on by default through `workbench.browser.enableChatTools`; if they are off, turn them on in the chat's Configure Tools.
- Claude Code and Copilot CLI: `npm install -g @playwright/cli@latest` (command `playwright-cli`), or a Playwright MCP server that is already set up.
- Fallback: the developer checks the screen and says what they see.

## App not running

Ask the developer to start it, with the command from the context file or `package.json`, and for its URL; never start servers or backends yourself without their OK.
Fallback: no visual check, only if the developer agrees.
