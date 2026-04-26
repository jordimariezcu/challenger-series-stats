#!/usr/bin/env python3
"""
Challenger Series — PDF fetcher
Scrapes challengerseries.net for new tournament PDFs and downloads them to /results/
Run standalone: python scripts/fetch_results.py
"""

import requests
from bs4 import BeautifulSoup
from pathlib import Path
import time
import sys

EVENTS_URL  = "https://www.challengerseries.net/events/category/tournaments/list/?eventDisplay=past"
RESULTS_DIR = Path(__file__).parent.parent / "results"
HEADERS     = {"User-Agent": "Mozilla/5.0 (compatible; cs-stats-bot/1.0)"}


def get_pdf_links_from_page(url: str, session: requests.Session) -> list[str]:
    """Return all PDF links found on a given page."""
    try:
        r = session.get(url, headers=HEADERS, timeout=30)
        r.raise_for_status()
    except Exception as e:
        print(f"    Warning: could not fetch {url} — {e}")
        return []

    soup = BeautifulSoup(r.text, "html.parser")
    return [
        a["href"] for a in soup.find_all("a", href=True)
        if a["href"].endswith(".pdf") and "wp-content/uploads" in a["href"]
    ]


def get_event_links(session: requests.Session) -> list[str]:
    """Return links to individual tournament event pages from the list page."""
    try:
        r = session.get(EVENTS_URL, headers=HEADERS, timeout=30)
        r.raise_for_status()
    except Exception as e:
        print(f"Error fetching events page: {e}")
        return []

    soup = BeautifulSoup(r.text, "html.parser")
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "/events/" in href and href not in (EVENTS_URL,) and href not in links:
            links.append(href)
    return links


def fetch_all_pdf_links(session: requests.Session) -> list[str]:
    """
    Two-level scrape:
    1. Check the events list page directly for PDF links
    2. Follow each event page and look for PDF links there
    """
    print("Scanning events list page...")
    pdf_links = get_pdf_links_from_page(EVENTS_URL, session)

    if not pdf_links:
        print("No PDFs on list page — following individual event pages...")
        event_links = get_event_links(session)
        print(f"Found {len(event_links)} event pages to check")
        for i, event_url in enumerate(event_links, 1):
            print(f"  [{i}/{len(event_links)}] {event_url}")
            links = get_pdf_links_from_page(event_url, session)
            pdf_links.extend(links)
            time.sleep(0.5)  # polite crawling

    # Deduplicate
    return list(dict.fromkeys(pdf_links))


def download_new_pdfs() -> int:
    RESULTS_DIR.mkdir(exist_ok=True)
    existing = {f.name for f in RESULTS_DIR.glob("*.pdf")}

    session = requests.Session()
    all_links = fetch_all_pdf_links(session)

    if not all_links:
        print("No PDF links found on the website.")
        return 0

    print(f"\nFound {len(all_links)} PDFs on website ({len(existing)} already downloaded)")

    new_count = 0
    for url in all_links:
        filename = url.split("/")[-1]
        if filename in existing:
            continue

        print(f"  ↓ Downloading: {filename}")
        try:
            r = session.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            (RESULTS_DIR / filename).write_bytes(r.content)
            new_count += 1
            time.sleep(0.5)
        except Exception as e:
            print(f"    Error downloading {filename}: {e}")

    print(f"\n{'✓' if new_count > 0 else '—'} {new_count} new PDF(s) downloaded")
    return new_count


if __name__ == "__main__":
    n = download_new_pdfs()
    sys.exit(0 if n >= 0 else 1)
