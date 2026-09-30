#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# generate-npm-token.sh
#
# Generates a Nexus npm auth token and sets NEXUS_AUTH_TOKEN in your shell
# profile so the project .npmrc can resolve ${NEXUS_AUTH_TOKEN} properly.
#
# The project .npmrc contains:
#   //nexus.build.edubase.malmberg.nl/repository/npm/:_authToken=${NEXUS_AUTH_TOKEN}
#
# This script sets that env var locally (same as CI/CD sets it in Bitbucket).
# =============================================================================

NEXUS_URL="https://nexus.build.edubase.malmberg.nl"
NPM_REPO_PATH="/repository/npm/"

# Detect shell profile
if [ -n "${ZSH_VERSION:-}" ] || [ "$(basename "$SHELL")" = "zsh" ]; then
  SHELL_PROFILE="$HOME/.zshrc"
else
  SHELL_PROFILE="$HOME/.bashrc"
fi

read -rp "Enter Nexus username (e.g., slaixtools-deploy): " NEXUS_USER
read -rsp "Enter password for ${NEXUS_USER}: " NEXUS_PASS
echo ""

# Step 1: Clean up existing auth tokens from global ~/.npmrc
echo "Cleaning up existing auth tokens from global ~/.npmrc..."
npm config delete //nexus.build.edubase.malmberg.nl/repository/npm/:_authToken 2>/dev/null || true
npm config delete //nexus.build.edubase.malmberg.nl/repository/npm/:_auth 2>/dev/null || true

# Step 2: Temporarily move the project .npmrc out of the way.
# The project .npmrc references ${NEXUS_AUTH_TOKEN} which is unset,
# causing npm login to send an empty/invalid token → 401.
PROJECT_NPMRC="$(pwd)/.npmrc"
PROJECT_NPMRC_BAK="${PROJECT_NPMRC}.bak"
if [ -f "$PROJECT_NPMRC" ]; then
  echo "Temporarily moving project .npmrc aside..."
  mv "$PROJECT_NPMRC" "$PROJECT_NPMRC_BAK"
  # Ensure we restore it even if the script fails
  trap 'if [ -f "$PROJECT_NPMRC_BAK" ]; then mv "$PROJECT_NPMRC_BAK" "$PROJECT_NPMRC"; fi' EXIT
fi

# Step 3: Generate npm login token (writes to ~/.npmrc temporarily)
echo "Performing npm login to obtain auth token..."

# Escape the password for expect
ESCAPED_PASS=$(printf '%s\n' "$NEXUS_PASS" | sed 's/[[\.*^$()+?{|]/\\&/g')

expect -c '
set timeout 30
spawn npm login --registry='"${NEXUS_URL}${NPM_REPO_PATH}"'
expect "Username:"
send "'"${NEXUS_USER}"'\r"
expect "Password:"
send "'"${ESCAPED_PASS}"'\r"
expect {
    "Email: (this IS public)" {
        send "'"${NEXUS_USER}"'@example.com\r"
        expect eof
    }
    "Logged in" {
        # Already logged in, no email prompt
    }
}
'

# Restore the project .npmrc immediately after login
if [ -f "$PROJECT_NPMRC_BAK" ]; then
  mv "$PROJECT_NPMRC_BAK" "$PROJECT_NPMRC"
  echo "Restored project .npmrc"
fi

# Extract the full auth token (including NpmToken. prefix) from ~/.npmrc
FULL_AUTH_TOKEN=$(grep "_authToken" ~/.npmrc | head -1 | cut -d'=' -f2)

if [ -z "$FULL_AUTH_TOKEN" ]; then
  echo "❌ Failed to retrieve npm auth token from npm login."
  exit 1
fi

echo "✅ npm login token retrieved successfully."

# Step 3: Clean up global ~/.npmrc — we don't need auth there.
# The project .npmrc handles auth via NEXUS_AUTH_TOKEN env var.
echo "Cleaning up global ~/.npmrc (auth will come from project .npmrc)..."
npm config delete //nexus.build.edubase.malmberg.nl/repository/npm/:_authToken 2>/dev/null || true
npm config delete registry 2>/dev/null || true

# Step 4: Set NEXUS_AUTH_TOKEN in shell profile
echo ""
echo "Setting NEXUS_AUTH_TOKEN in ${SHELL_PROFILE}..."

# Remove any existing NEXUS_AUTH_TOKEN export from the profile
sed -i.bak '/^export NEXUS_AUTH_TOKEN=/d' "$SHELL_PROFILE" 2>/dev/null || true
rm -f "${SHELL_PROFILE}.bak"

# Append the new export
echo "export NEXUS_AUTH_TOKEN=${FULL_AUTH_TOKEN}" >> "$SHELL_PROFILE"

# Also export for the current session
export NEXUS_AUTH_TOKEN="${FULL_AUTH_TOKEN}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Local setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "NEXUS_AUTH_TOKEN has been added to ${SHELL_PROFILE}"
echo ""
echo "To activate in your current terminal, run:"
echo "  source ${SHELL_PROFILE}"
echo ""
echo "Then you can run:"
echo "  pnpm install"
echo ""
