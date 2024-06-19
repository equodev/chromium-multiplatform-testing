#!/bin/bash

root=$(pwd)

path="$root/node_modules/playwright-core/lib/server/chromium/crBrowser.js"

if [ -f "$path" ]; then
    tmpfile=$(mktemp)

    lineno=0
    while IFS= read -r line; do
        if [ "$lineno" -ge 300 ] && [ "$lineno" -le 307 ]; then
            echo "// $line" >> "$tmpfile"
        else
            echo "$line" >> "$tmpfile"
        fi
        lineno=$((lineno + 1))
    done < "$path"

    mv "$tmpfile" "$path"
else
    echo "file does not exist."
fi