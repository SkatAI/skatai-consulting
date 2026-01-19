#!/usr/bin/env python3
"""Fix duplicate YAML keys in markdown files."""

import os
import re
from pathlib import Path

def fix_yaml_duplicates(file_path):
    """Remove duplicate keys from YAML front matter."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if file has front matter
    if not content.startswith('---'):
        return False

    # Split into front matter and body
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False

    front_matter = parts[1].strip()
    body = parts[2]

    # Parse front matter and remove duplicates
    seen_keys = set()
    new_lines = []
    lines = front_matter.split('\n')

    for line in lines:
        # Check if line starts a new key
        if line and not line.startswith(' ') and not line.startswith('\t'):
            match = re.match(r'^([^:]+):', line)
            if match:
                key = match.group(1).strip()
                if key in seen_keys:
                    print(f"  Removing duplicate key: {key}")
                    continue
                seen_keys.add(key)
        new_lines.append(line)

    new_front_matter = '\n'.join(new_lines)
    new_content = f"---\n{new_front_matter}\n---{body}"

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    content_dir = Path('/Users/alexis/work/skatai/skatai-next/src/content/courses')
    fixed_count = 0

    for md_file in content_dir.rglob('*.md'):
        print(f"Checking: {md_file.name}")
        if fix_yaml_duplicates(md_file):
            print(f"  Fixed: {md_file}")
            fixed_count += 1

    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
