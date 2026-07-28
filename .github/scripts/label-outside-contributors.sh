#!/bin/bash

# Label Outside Contributor Issues
# This script identifies open issues from non-core-team members and applies/removes the "cfa-submitted" label

set -e

# Configuration
REPO="sl-design-system/components"
CORE_TEAM="@sl-design-system/core-team"
LABEL="cfa-submitted"
EXCLUSION_LABELS=("duplicate" "invalid" "wontfix" "external")
UPDATED_COUNT=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Starting label workflow for $REPO..."
echo "Looking for issues to label with '$LABEL'"
echo ""

# Get all open issues
echo "Fetching open issues..."
ISSUES=$(gh issue list \
  --repo "$REPO" \
  --state open \
  --limit 1000 \
  --json number,author,labels)

# Check if we have any issues
if [ -z "$ISSUES" ] || [ "$ISSUES" == "[]" ]; then
  echo "No open issues found."
  exit 0
fi

# Process each issue
echo "$ISSUES" | jq -r '.[] | @json' | while read -r issue_json; do
  ISSUE_NUMBER=$(echo "$issue_json" | jq -r '.number')
  AUTHOR=$(echo "$issue_json" | jq -r '.author.login')
  CURRENT_LABELS=$(echo "$issue_json" | jq -r '.labels[].name' | tr '\n' '|' | sed 's/|$//')

  echo "Processing issue #$ISSUE_NUMBER (author: $AUTHOR)"

  # Check if author is a core team member
  if gh api \
    --method GET \
    "orgs/sl-design-system/teams/core-team/memberships/$AUTHOR" \
    > /dev/null 2>&1; then

    # Author is a core team member
    echo "  → Core team member"

    # Check if the issue has the "cfa-submitted" label and remove it
    if echo "$CURRENT_LABELS" | grep -q "$LABEL"; then
      echo "  → Removing '$LABEL' label (core team member should not have this)"
      gh issue edit "$ISSUE_NUMBER" \
        --repo "$REPO" \
        --remove-label "$LABEL" \
        2>/dev/null || echo "  ⚠️  Could not remove label (may already be removed)"
      ((UPDATED_COUNT++))
    fi
  else
    # Author is NOT a core team member
    echo "  → External contributor"

    # Check if issue has any exclusion labels
    HAS_EXCLUSION=false
    for exclusion_label in "${EXCLUSION_LABELS[@]}"; do
      if echo "$CURRENT_LABELS" | grep -q "$exclusion_label"; then
        echo "  → Skipping (has exclusion label: $exclusion_label)"
        HAS_EXCLUSION=true
        break
      fi
    done

    if [ "$HAS_EXCLUSION" = false ]; then
      # Check if the issue already has the "cfa-submitted" label
      if ! echo "$CURRENT_LABELS" | grep -q "$LABEL"; then
        echo "  → Adding '$LABEL' label"
        gh issue edit "$ISSUE_NUMBER" \
          --repo "$REPO" \
          --add-label "$LABEL" \
          2>/dev/null || echo "  ⚠️  Could not add label (may already exist)"
        ((UPDATED_COUNT++))
      else
        echo "  → Already labeled with '$LABEL'"
      fi
    fi
  fi

  echo ""
done

echo "============================================"
echo -e "${GREEN}Workflow completed${NC}"
echo "Issues updated: $UPDATED_COUNT"
echo "============================================"
