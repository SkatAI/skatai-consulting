#!/usr/bin/env python3
"""Remove duplicate YAML keys, keeping only the first occurrence."""

import re
from pathlib import Path

def remove_duplicate_keys(file_path):
    """Remove duplicate YAML keys from front matter."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if not content.startswith('---'):
        return False

    # Find front matter bounds
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

    # Track seen keys and remove duplicates
    seen_keys = set()
    new_fm_lines = []
    in_multiline = False
    multiline_depth = 0

    for line in fm_lines:
        # Skip empty lines
        if not line.strip():
            new_fm_lines.append(line)
            continue

        # Check if line starts with a key (not indented)
        if not line.startswith(' ') and not line.startswith('\t'):
            key_match = re.match(r'^([a-zA-Z_][a-zA-Z0-9_-]*):', line)
            if key_match:
                key = key_match.group(1)
                if key in seen_keys:
                    # Skip this duplicate key
                    continue
                seen_keys.add(key)

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
        if remove_duplicate_keys(md_file):
            print(f"Fixed: {md_file.name}")
            fixed_count += 1

    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
