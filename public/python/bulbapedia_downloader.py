#!/usr/bin/env python3
"""
Simple Bulbapedia content downloader using the MediaWiki API.
Works with any MediaWiki-based wiki by changing BASE_URL.
"""

import json
import requests
import argparse
from pathlib import Path

BASE_URL = "https://bulbapedia.bulbagarden.net"
API_ENDPOINT = f"{BASE_URL}/w/api.php"


BASE_URL = "https://dragonball.fandom.com"        # ← votre wiki
API_ENDPOINT = f"{BASE_URL}/api.php"               # ← adapter le chemin si nécessaire

def get_page(title: str, fmt: str = "text") -> dict:
    """Fetch a single wiki page by title.

    Args:
        title: Page title (e.g. "Pikachu", "Bulbasaur").
        fmt: "text" for plain text, "html" for parsed HTML, "wikitext" for raw markup.
    """
    if fmt == "html":
        params = {
            "action": "parse",
            "page": title,
            "prop": "text",
            "format": "json",
        }
        resp = requests.get(API_ENDPOINT, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return {
            "title": data["parse"]["title"],
            "content": data["parse"]["text"]["*"],
            "format": "html",
        }
    else:
        prop = "extracts"
        params = {
            "action": "query",
            "titles": title,
            "prop": prop,
            "explaintext": fmt == "text",
            "format": "json",
        }
        resp = requests.get(API_ENDPOINT, params=params, timeout=30)
        resp.raise_for_status()
        pages = resp.json()["query"]["pages"]
        page = next(iter(pages.values()))
        return {
            "title": page.get("title", title),
            "content": page.get("extract", ""),
            "format": fmt,
        }


def search_pages(query: str, limit: int = 10) -> list[dict]:
    """Search for pages matching a query string."""
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srlimit": limit,
        "format": "json",
    }
    resp = requests.get(API_ENDPOINT, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()["query"]["search"]


def get_category_members(category: str, limit: int = 50) -> list[str]:
    """List page titles in a category (without 'Category:' prefix)."""
    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": f"Category:{category}",
        "cmlimit": limit,
        "format": "json",
    }
    resp = requests.get(API_ENDPOINT, params=params, timeout=30)
    resp.raise_for_status()
    return [m["title"] for m in resp.json()["query"]["categorymembers"]]


def save(content: str, filepath: str) -> None:
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    Path(filepath).write_text(content, encoding="utf-8")
    print(f"Saved → {filepath}")


def main():
    parser = argparse.ArgumentParser(description="Download content from Bulbapedia")
    sub = parser.add_subparsers(dest="command", required=True)

    # --- page ---
    p_page = sub.add_parser("page", help="Download a single page")
    p_page.add_argument("title", help="Page title, e.g. 'Pikachu'")
    p_page.add_argument("--format", choices=["text", "html", "wikitext"], default="text")
    p_page.add_argument("-o", "--output", help="Save to file instead of printing")

    # --- search ---
    p_search = sub.add_parser("search", help="Search for pages")
    p_search.add_argument("query", help="Search query")
    p_search.add_argument("-n", "--limit", type=int, default=10)

    # --- category ---
    p_cat = sub.add_parser("category", help="List pages in a category")
    p_cat.add_argument("name", help="Category name (without 'Category:' prefix)")
    p_cat.add_argument("-n", "--limit", type=int, default=50)

    # --- bulk ---
    p_bulk = sub.add_parser("bulk", help="Download multiple pages (one file each)")
    p_bulk.add_argument("titles", nargs="+", help="Page titles")
    p_bulk.add_argument("--format", choices=["text", "html", "wikitext"], default="text")
    p_bulk.add_argument("-d", "--dir", default="bulbapedia_pages", help="Output directory")

    args = parser.parse_args()

    if args.command == "page":
        result = get_page(args.title, args.format)
        if args.output:
            save(result["content"], args.output)
        else:
            print(result["content"])

    elif args.command == "search":
        results = search_pages(args.query, args.limit)
        for r in results:
            print(f"  {r['title']:30s}  (id={r['pageid']})")

    elif args.command == "category":
        titles = get_category_members(args.name, args.limit)
        for t in titles:
            print(f"  {t}")

    elif args.command == "bulk":
        ext = {"text": ".txt", "html": ".html", "wikitext": ".wiki"}[args.format]
        for title in args.titles:
            result = get_page(title, args.format)
            slug = title.replace(" ", "_").replace("/", "_")
            save(result["content"], f"{args.dir}/{slug}{ext}")


if __name__ == "__main__":
    main()
