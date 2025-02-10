#!/bin/bash

# Set the root directory
root=$(pwd)

# Define the file path
path="$root/node_modules/playwright-core/lib/server/chromium/crBrowser.js"

# Use sed to comment out lines 301 to 308
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS requires an empty string for the -i flag
  sed -i '' '301,308s/^/\/\//' "$path"
else
  # Linux and Windows (Git Bash or WSL)
  sed -i '301,308s/^/\/\//' "$path"
fi

echo "Lines 301 to 308 in $path have been commented out."
