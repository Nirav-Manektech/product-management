#!/bin/sh
branch_name=$(git symbolic-ref --short HEAD)
if ! echo "$branch_name" | grep -Eq '^(feature|bugfix|hotfix|release)/'; then
  echo "❌ Branch name must start with feature/, bugfix/, hotfix/, or release/"
  exit 1
fi
