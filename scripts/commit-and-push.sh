#!/usr/bin/env bash
set -euo pipefail

MESSAGE="${1:-}"

if [[ -z "$MESSAGE" ]]; then
    echo 'Usage: ./scripts/commit-and-push.sh "Commit message"'
    exit 1
fi

if [[ -z "$(git status --porcelain)" ]]; then
    echo "No changes detected."
    exit 1
fi

git add -A
git diff --cached --check
git commit -m "$MESSAGE"

BRANCH=$(git branch --show-current)
git push -u origin "$BRANCH"

echo "Commit and push completed."
