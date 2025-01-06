#!/bin/bash

# Set the root directory
root=$(pwd)

# Define the file path
path="$root/node_modules/playwright-core/lib/server/chromium/crBrowser.js"

# Use sed to comment out lines 301 to 308
sed -i '301,308s/^/\/\//' "$path"

echo "Lines 301 to 308 in $path have been commented out."