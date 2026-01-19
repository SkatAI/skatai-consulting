#!/bin/bash

# Migration script for course content from Jekyll to Next.js
# Run from the skatai-next directory

JEKYLL_DIR="/Users/alexis/work/skatai/skatai-jekyll"
NEXT_DIR="/Users/alexis/work/skatai/skatai-next"
CONTENT_DIR="$NEXT_DIR/src/content/courses"

# Create content directory
mkdir -p "$CONTENT_DIR"

echo "Migrating courses..."

# Migrate from _pages directory
for course in dbsql iabiz initml inwai ipsadb ml2llm nosql python; do
    if [ -d "$JEKYLL_DIR/_pages/$course" ]; then
        echo "Migrating $course..."
        mkdir -p "$CONTENT_DIR/$course"
        cp "$JEKYLL_DIR/_pages/$course/"*.md "$CONTENT_DIR/$course/" 2>/dev/null || true
        # Count files
        count=$(ls "$CONTENT_DIR/$course/"*.md 2>/dev/null | wc -l)
        echo "  Copied $count files"
    fi
done

# Migrate mlops-dpe from _posts directory
if [ -d "$JEKYLL_DIR/_posts/mlops-dpe" ]; then
    echo "Migrating mlops-dpe..."
    mkdir -p "$CONTENT_DIR/mlops-dpe"
    cp "$JEKYLL_DIR/_posts/mlops-dpe/"*.md "$CONTENT_DIR/mlops-dpe/" 2>/dev/null || true
    count=$(ls "$CONTENT_DIR/mlops-dpe/"*.md 2>/dev/null | wc -l)
    echo "  Copied $count files"
fi

# Also migrate inwai from _posts if exists
if [ -d "$JEKYLL_DIR/_posts/inwai" ]; then
    echo "Migrating inwai from _posts..."
    cp "$JEKYLL_DIR/_posts/inwai/"*.md "$CONTENT_DIR/inwai/" 2>/dev/null || true
fi

echo ""
echo "Migration complete! Total files:"
find "$CONTENT_DIR" -name "*.md" | wc -l
