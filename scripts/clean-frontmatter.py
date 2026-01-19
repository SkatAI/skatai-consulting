#!/usr/bin/env python3
"""Clean up Jekyll-specific front matter fields that cause YAML issues."""

import os
import re
from pathlib import Path

def clean_frontmatter(file_path):
    """Clean up problematic front matter fields."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if file has front matter
    if not content.startswith('---'):
        return False

    # Split into parts - find front matter end
    lines = content.split('\n')
    fm_end = -1
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            fm_end = i
            break

    if fm_end == -1:
        return False

    fm_lines = lines[1:fm_end]
    body_lines = lines[fm_end+1:]

    # Track if we're inside a multi-line value
    new_fm_lines = []
    skip_multiline = False
    quote_char = None

    for line in fm_lines:
        # Check if we're skipping a multi-line value
        if skip_multiline:
            if quote_char and quote_char in line:
                skip_multiline = False
                quote_char = None
            continue

        # Check if this starts a key
        key_match = re.match(r'^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)', line)
        if key_match:
            key = key_match.group(1)
            value = key_match.group(2).strip()

            # Skip problematic fields
            if key in ('toc', 'resources', 'permalink'):
                # Check if it's a multi-line value
                if value.startswith('"'):
                    if value.count('"') < 2:  # Unclosed quote
                        skip_multiline = True
                        quote_char = '"'
                elif value.startswith("'"):
                    if value.count("'") < 2:  # Unclosed quote
                        skip_multiline = True
                        quote_char = "'"
                continue

        new_fm_lines.append(line)

    new_content = '---\n' + '\n'.join(new_fm_lines) + '\n---\n' + '\n'.join(body_lines)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    content_dir = Path('/Users/alexis/work/skatai/skatai-next/src/content/courses')
    fixed_count = 0

    for md_file in content_dir.rglob('*.md'):
        if clean_frontmatter(md_file):
            print(f"Cleaned: {md_file.name}")
            fixed_count += 1

    print(f"\nTotal files cleaned: {fixed_count}")

if __name__ == '__main__':
    main()
