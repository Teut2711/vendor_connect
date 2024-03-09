#!/bin/bash

# Check if directory argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 directory_path"
    exit 1
fi

# Directory to search
directory=$1

# Check if directory exists
if [ ! -d "$directory" ]; then
    echo "Directory not found: $directory"
    exit 1
fi

# Search for "8.1.1" in all files within the directory
echo "Files containing '8.1.1':"
grep -rnw "$directory" -e "8.1.1" 2>/dev/null | cut -d ":" -f1
