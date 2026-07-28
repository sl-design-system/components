#!/bin/bash

# Label Outside Contributor Issues
# This script identifies open issues from non-core-team members and applies/removes the "cfa-submitted" label
#
# Usage:
#   ./label-outside-contributors.sh              # Process all open issues (scheduled run)
#   ./label-outside-contributors.sh <issue_num>  # Process a single issue (event-triggered run)
#   ./label-outside-contributors.sh --dry-run    # Preview changes without applying them

set -e

# Configuration
REPO="${GITHUB_REPOSITORY:-sl-design-system/components}"
CORE_TEAM="core-team"
LABEL="cfa-submitted"
EXCLUSION_LABELS=("duplicate" "invalid" "wontfix" "external")
UPDATED_COUNT=0
DRY_RUN=false

# Check for --dry-run flag
if [ "$1" == "--dry-run" ]; then
  DRY_RUN=true
  TARGET_ISSUE=""
  echo "🔍 DRY RUN MODE - No changes will be applied"
  echo "Processing all open issues in $REPO (scheduled run)..."
else
  TARGET_ISSUE="$1"
  if [ -n "$TARGET_ISSUE" ]; then
    echo "Processing single issue #$TARGET_ISSUE (triggered by issue event)..."
  else
    echo "Processing all open issues in $REPO (scheduled run)..."
  fi
fi
echo ""

# Determine if we're processing a single issue or all issues
if [ -n "$TARGET_ISSUE" ]; then
  # Single issue mode (event-triggered)
  ISSUES=$(gh issue view "$TARGET_ISSUE" \
    --repo "$REPO" \
    --json number,author,labels)
  # Wrap in an array for consistent processing
  ISSUES="[$ISSUES]"
else
  # All issues mode (scheduled run)
  echo "Fetching open issues..."
  ISSUES=$(gh issue list \
    --repo "$REPO" \
    --state open \
    --limit 1000 \
    --json number,author,labels)
fi

# Check if we have any issues
if [ -z "$ISSUES" ] || [ "$ISSUES" == "[]" ]; then
  echo "No issues to process."
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
    "orgs/sl-design-system/teams/$CORE_TEAM/memberships/$AUTHOR" \
    > /dev/null 2>&1; then

    # Check if the issue has the "cfa-submitted" label and remove it
    if echo "$CURRENT_LABELS" | grep -q "$LABEL"; then
      echo "  → Removing '$LABEL' label (core team member should not have this)"
      if [ "$DRY_RUN" = false ]; then
        gh issue edit "$ISSUE_NUMBER" \
          --repo "$REPO" \
          --remove-label "$LABEL" \
          2>/dev/null || echo "  ⚠️  Could not remove label (may already be removed)"
      else
        echo "     [DRY RUN] Would remove label"
      fi
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
        if [ "$DRY_RUN" = false ]; then
          gh issue edit "$ISSUE_NUMBER" \
            --repo "$REPO" \
            --add-label "$LABEL" \
            2>/dev/null || echo "  ⚠️  Could not add label (may already exist)"
        else
          echo "     [DRY RUN] Would add label"
        fi
        ((UPDATED_COUNT++))
      else
        echo "  → Already labeled with '$LABEL'"
      fi
    fi
  fi

  echo ""
done

echo "============================================"
if [ "$DRY_RUN" = true ]; then
  echo "🔍 DRY RUN COMPLETED - No changes were made"
else
  echo "✅ Workflow completed"
fi
echo "Issues that would be updated: $UPDATED_COUNT"
echo "============================================"
