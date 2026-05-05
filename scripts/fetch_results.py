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

EVENTS_URLS = [
    "https://www.challengerseries.net/events/category/tournaments/list/?eventDisplay=past",
    "https://www.challengerseries.net/events/category/tournaments/list/",
    "https://www.challengerseries.net/tournaments/",
]
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
    """Return links to individual tournament event pages from all list pages."""
    links = []
    for base_url in EVENTS_URLS:
        try:
            r = session.get(base_url, headers=HEADERS, timeout=30)
            r.raise_for_status()
        except Exception as e:
            print(f"  Warning: could not fetch {base_url} — {e}")
            continue

        soup = BeautifulSoup(r.text, "html.parser")
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if ("/events/" in href or "/tournament/" in href) and href not in EVENTS_URLS and href not in links:
                links.append(href)

    return links


def fetch_all_pdf_links(session: requests.Session) -> list[str]:
    """
    Two-level scrape across both list URLs:
    1. Check all events list pages directly for PDF links
    2. If none found, follow each individual event page
    """
    pdf_links = []

    for url in EVENTS_URLS:
        print(f"Scanning: {url}")
        pdf_links.extend(get_pdf_links_from_page(url, session))

    if not pdf_links:
        print("No PDFs found on list pages — following individual event pages...")
        event_links = get_event_links(session)
        print(f"Found {len(event_links)} event pages to check")
        for i, event_url in enumerate(event_links, 1):
            print(f"  [{i}/{len(event_links)}] {event_url}")
            pdf_links.extend(get_pdf_links_from_page(event_url, session))
            time.sleep(0.5)

    # Deduplicate preserving order
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

        print(f"  Downloading: {filename}")
        try:
            r = session.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            (RESULTS_DIR / filename).write_bytes(r.content)
            new_count += 1
            time.sleep(0.5)
        except Exception as e:
            print(f"    Error downloading {filename}: {e}")

    print(f"\n{new_count} new PDF(s) downloaded")
    return new_count


if __name__ == "__main__":
    n = download_new_pdfs()
    sys.exit(0 if n >= 0 else 1)
