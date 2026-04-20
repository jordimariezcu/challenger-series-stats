#!/usr/bin/env python3
"""
Challenger Series PDF Parser
Parses tournament PDFs from /results and outputs structured JSON to /data/tournaments.json
Run: python scripts/parse_pdfs.py
"""

import pdfplumber
import re
import json
import unicodedata
from pathlib import Path

RESULTS_DIR = Path(__file__).parent.parent / "results"
DATA_DIR = Path(__file__).parent.parent / "data"

# ---------------------------------------------------------------------------
# Name normalisation – fix PDF encoding artefacts (e.g. ö → \ufffd)
# ---------------------------------------------------------------------------
NAME_FIXES = {
    "L\ufffdffler": "Löffler",
    "M\ufffdller": "Müller",
    "K\ufffdnig": "König",
    "Sch\ufffdfer": "Schäfer",
    "G\ufffdnter": "Günter",
    "B\ufffdttner": "Büttner",
    "Fl\ufffdgel": "Flügel",
    "Kr\ufffdger": "Krüger",
    "Kl\ufffdver": "Klüver",
    "H\ufffdbler": "Höbler",
    "R\ufffdder": "Röder",
    "B\ufffdhm": "Böhm",
    "P\ufffdtz": "Pütz",
    "St\ufffdck": "Stück",
}


def fix_name(name: str) -> str:
    """Apply known encoding fixes and strip extra whitespace."""
    name = " ".join(name.split())
    for bad, good in NAME_FIXES.items():
        name = name.replace(bad, good)
    return name


def fix_encoding(name: str) -> str:
    """
    pdfplumber sometimes yields Latin-1 chars for UTF-8 sequences.
    The triple \xef\xbf\xbd is the Latin-1 decoding of the UTF-8
    replacement character bytes (EF BF BD).  Attempt to recover by
    re-encoding as Latin-1 and decoding as UTF-8.
    """
    if '\xef' in name or '\xbf' in name or '\xbd' in name:
        try:
            return name.encode('latin-1').decode('utf-8')
        except (UnicodeDecodeError, UnicodeEncodeError):
            pass
    return fix_name(name)


# ---------------------------------------------------------------------------
# Date parsing from filename
# ---------------------------------------------------------------------------
def parse_date_from_filename(filename: str):
    """
    Extract start/end date from filenames like:
      Timetable-Tournament-02.04.-03.04.2026.pdf
      Tournament-24.06.-25.06.2024.pdf
    Returns (start_date, end_date) as ISO strings, or (None, None).
    """
    stem = Path(filename).stem
    # Find all DD.MM. or DD.MM.YYYY groups
    tokens = re.findall(r'(\d{2})\.(\d{2})\.(\d{4})?', stem)
    if not tokens:
        return None, None

    # Grab year from the last token that has one
    year = None
    for d, m, y in reversed(tokens):
        if y:
            year = y
            break
    if not year:
        return None, None

    d0, m0, _ = tokens[0]
    d1, m1, y1 = tokens[-1] if len(tokens) > 1 else tokens[0]
    end_year = y1 if y1 else year

    return f"{year}-{m0}-{d0}", f"{end_year}-{m1}-{d1}"


# ---------------------------------------------------------------------------
# Player-name splitting
# ---------------------------------------------------------------------------
def split_two_player_names(text: str):
    """
    Split a string that contains two player names in "Last, First [Mid]" format.
    E.g. "Smith, John Jones, Jane" -> ("Smith, John", "Jones, Jane")
    Strategy: there are exactly 2 commas; find the word-boundary between them.
    """
    text = text.strip()
    comma_positions = [i for i, c in enumerate(text) if c == ',']
    if len(comma_positions) < 2:
        return None, None

    c1 = comma_positions[0]
    c2 = comma_positions[1]

    # Search for the last space between the two commas
    between = text[c1:c2]
    last_space = between.rfind(' ')
    if last_space == -1:
        return None, None

    split_pos = c1 + last_space
    p1 = fix_encoding(text[:split_pos].strip())
    p2 = fix_encoding(text[split_pos:].strip())
    return p1, p2


# ---------------------------------------------------------------------------
# Overview page – extract player roster from the ranking table
# ---------------------------------------------------------------------------
def parse_players_from_overview(text: str):
    """
    Extract the ranking list from the overview page.
    Ranking lines look like (possibly with garbage after from the adjacent column):
      1 Bertrand, Irvin 6 : 0 18 : 4 +6 +14
    """
    players = []
    lines = text.split('\n')
    in_ranking = False

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if re.search(r'\bRanking\b', line):
            in_ranking = True
            continue
        if not in_ranking:
            continue

        # Ranking entry: starts with a digit, then a name (has comma), then stats
        m = re.match(
            r'^(\d+)\s+'                    # rank
            r'([\w\-\., \u00C0-\u024F]+?)'  # name (lazy)
            r'\s+(\d+)\s*:\s*(\d+)'         # matches won:lost
            r'\s+(\d+)\s*:\s*(\d+)'         # sets won:lost
            r'\s+([+\-]\d+)'                # match diff
            r'\s+([+\-]\d+)',               # set diff
            line
        )
        if m:
            players.append({
                "rank": int(m.group(1)),
                "name": fix_name(m.group(2).strip()),
                "matches_won": int(m.group(3)),
                "matches_lost": int(m.group(4)),
                "sets_won": int(m.group(5)),
                "sets_lost": int(m.group(6)),
                "match_diff": int(m.group(7)),
                "set_diff": int(m.group(8)),
            })

    return players


# ---------------------------------------------------------------------------
# Results page – extract match set scores
# ---------------------------------------------------------------------------
def parse_results_page(text: str, player_names: list):
    """
    Parse the results page.  For each played match extracts:
      player1, player2, sets (list of [p1_pts, p2_pts]), phase.
    """
    matches = []
    lines = text.split('\n')
    phase = 'round_robin'

    # Build a lookup: lower-cased name -> canonical name
    name_lookup = {n.lower(): n for n in player_names}

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Phase markers
        ll = line.lower()
        if 'semifinal' in ll:
            phase = 'semifinal'
            continue
        if '3rd place' in ll or 'third place' in ll:
            phase = 'third_place'
            continue
        if 'final' in ll and 'semi' not in ll and 'loser' not in ll and 'winner' not in ll:
            phase = 'final'
            continue
        if 'matches of' in ll:
            phase = 'round_robin'
            continue

        # Extract set scores at end of line:  \d+ : \d+
        raw_scores = re.findall(r'(\d+)\s*:\s*(\d+)', line)
        if len(raw_scores) < 3:
            continue

        sets = [[int(a), int(b)] for a, b in raw_scores]

        # Strip all score patterns, time (HH:MM), match numbers (N vs. M), headers
        clean = re.sub(r'\d+\s*:\s*\d+', '', line)
        # Remove trailing empty set placeholders "  :  :  :"
        clean = re.sub(r'(\s*:\s*)+$', '', clean)
        clean = re.sub(r'^\d{2}:\d{2}\s*', '', clean.strip())
        clean = re.sub(r'^\d+\s+vs\.\s+\d+\s*', '', clean.strip())
        clean = re.sub(r'\s+', ' ', clean).strip()

        # Remove trailing header words that sometimes bleed in
        clean = re.sub(r'\s*(1st|2nd|3rd|4th|5th)\s+Set.*$', '', clean).strip()
        # Remove any remaining trailing colons or spaces
        clean = clean.strip(': ').strip()

        p1, p2 = split_two_player_names(clean)

        if not p1 or not p2:
            continue

        # Normalise to canonical names if possible
        p1 = name_lookup.get(p1.lower(), p1)
        p2 = name_lookup.get(p2.lower(), p2)

        p1_sets = sum(1 for s in sets if s[0] > s[1])
        p2_sets = sum(1 for s in sets if s[1] > s[0])

        matches.append({
            "player1": p1,
            "player2": p2,
            "sets": sets,
            "p1_sets": p1_sets,
            "p2_sets": p2_sets,
            "phase": phase,
        })

    return matches


# ---------------------------------------------------------------------------
# Single tournament parser
# ---------------------------------------------------------------------------
def parse_tournament(pdf_path: Path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            if len(pdf.pages) < 2:
                return None
            page1_text = pdf.pages[0].extract_text() or ''
            page2_text = pdf.pages[1].extract_text() or ''

        start_date, end_date = parse_date_from_filename(pdf_path.name)
        players = parse_players_from_overview(page1_text)
        player_names = [p['name'] for p in players]
        matches = parse_results_page(page2_text, player_names)

        return {
            "id": pdf_path.stem,
            "filename": pdf_path.name,
            "date_start": start_date,
            "date_end": end_date,
            "players": players,
            "matches": matches,
        }
    except Exception as e:
        print(f"  ERROR: {e}")
        import traceback; traceback.print_exc()
        return None


# ---------------------------------------------------------------------------
# Aggregated statistics
# ---------------------------------------------------------------------------
def compute_stats(tournaments: list):
    """Pre-compute all player stats across all tournaments."""
    from collections import defaultdict

    player_data = defaultdict(lambda: {
        "name": "",
        "matches": [],          # list of {tournament_id, date, opponent, result, sets, phase}
        "tournament_results": [],  # list of {tournament_id, date, rank, matches_won, matches_lost}
    })

    for t in tournaments:
        tid = t["id"]
        date = t["date_start"]

        # Tournament rankings
        for p in t["players"]:
            name = p["name"]
            player_data[name]["name"] = name
            player_data[name]["tournament_results"].append({
                "tournament_id": tid,
                "date": date,
                "rank": p["rank"],
                "matches_won": p["matches_won"],
                "matches_lost": p["matches_lost"],
                "sets_won": p["sets_won"],
                "sets_lost": p["sets_lost"],
            })

        # Individual matches
        for m in t["matches"]:
            p1, p2 = m["player1"], m["player2"]
            for pname, oname, my_sets, opp_sets in [
                (p1, p2, m["p1_sets"], m["p2_sets"]),
                (p2, p1, m["p2_sets"], m["p1_sets"]),
            ]:
                if not pname:
                    continue
                # Flip sets for player2 perspective
                if pname == p2:
                    sets_view = [[b, a] for a, b in m["sets"]]
                else:
                    sets_view = m["sets"]

                player_data[pname]["name"] = pname
                player_data[pname]["matches"].append({
                    "tournament_id": tid,
                    "date": date,
                    "opponent": oname,
                    "won": my_sets > opp_sets,
                    "my_sets": my_sets,
                    "opp_sets": opp_sets,
                    "sets": sets_view,
                    "phase": m["phase"],
                })

    # Compute derived stats per player
    players_out = {}
    for name, data in player_data.items():
        matches = data["matches"]
        if not matches:
            continue

        # --- Deuce sets (both players reached 10) ---
        deuce_won = deuce_total = 0
        for m in matches:
            for s in m["sets"]:
                if min(s[0], s[1]) >= 10:
                    deuce_total += 1
                    if s[0] > s[1]:
                        deuce_won += 1

        # --- Overall set stats ---
        sets_won = sum(1 for m in matches for s in m["sets"] if s[0] > s[1])
        sets_lost = sum(1 for m in matches for s in m["sets"] if s[1] > s[0])

        # --- Match stats ---
        total_matches = len(matches)
        wins = sum(1 for m in matches if m["won"])

        # --- First-set impact ---
        first_set_total = first_set_win_match_win = 0
        for m in matches:
            if m["sets"]:
                fs = m["sets"][0]
                if fs[0] != fs[1]:  # not a draw (shouldn't happen but safety)
                    first_set_total += 1
                    if fs[0] > fs[1] and m["won"]:
                        first_set_win_match_win += 1
                    elif fs[0] < fs[1] and not m["won"]:
                        # Lost first set, also lost match
                        pass

        # --- Comebacks: won match after losing first set ---
        comeback_chances = comeback_wins = 0
        for m in matches:
            if len(m["sets"]) >= 2 and m["sets"][0][1] > m["sets"][0][0]:  # lost first set
                comeback_chances += 1
                if m["won"]:
                    comeback_wins += 1

        # --- Head-to-head ---
        h2h = defaultdict(lambda: {"wins": 0, "losses": 0, "sets_won": 0, "sets_lost": 0})
        for m in matches:
            opp = m["opponent"]
            if m["won"]:
                h2h[opp]["wins"] += 1
            else:
                h2h[opp]["losses"] += 1
            h2h[opp]["sets_won"] += m["my_sets"]
            h2h[opp]["sets_lost"] += m["opp_sets"]

        # --- Recent form (last 5 matches by date) ---
        sorted_matches = sorted(matches, key=lambda x: x["date"] or "", reverse=True)
        recent_5 = [
            {"date": m["date"], "opponent": m["opponent"], "won": m["won"],
             "score": f"{m['my_sets']}:{m['opp_sets']}", "tournament_id": m["tournament_id"]}
            for m in sorted_matches[:5]
        ]

        # --- Tournament wins (rank 1) ---
        tournament_wins = sum(1 for tr in data["tournament_results"] if tr["rank"] == 1)
        tournaments_played = len(data["tournament_results"])

        players_out[name] = {
            "name": name,
            "total_matches": total_matches,
            "wins": wins,
            "losses": total_matches - wins,
            "win_rate": round(wins / total_matches * 100, 1) if total_matches else 0,
            "sets_won": sets_won,
            "sets_lost": sets_lost,
            "deuce_won": deuce_won,
            "deuce_total": deuce_total,
            "deuce_win_rate": round(deuce_won / deuce_total * 100, 1) if deuce_total else None,
            "first_set_total": first_set_total,
            "first_set_win_match_win": first_set_win_match_win,
            "comeback_chances": comeback_chances,
            "comeback_wins": comeback_wins,
            "comeback_rate": round(comeback_wins / comeback_chances * 100, 1) if comeback_chances else None,
            "tournament_wins": tournament_wins,
            "tournaments_played": tournaments_played,
            "h2h": {k: dict(v) for k, v in h2h.items()},
            "recent_5": recent_5,
            "tournament_results": sorted(
                data["tournament_results"], key=lambda x: x["date"] or "", reverse=True
            ),
        }

    return players_out


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    DATA_DIR.mkdir(exist_ok=True)
    pdf_files = sorted(RESULTS_DIR.glob("*.pdf"))
    print(f"Found {len(pdf_files)} PDF files\n")

    tournaments = []
    errors = []

    for i, pdf_path in enumerate(pdf_files):
        print(f"[{i+1:03d}/{len(pdf_files)}] {pdf_path.name}", end=" ... ")
        result = parse_tournament(pdf_path)
        if result and result["matches"]:
            tournaments.append(result)
            print(f"OK ({len(result['matches'])} matches, {len(result['players'])} players)")
        elif result:
            print(f"WARN: 0 matches extracted")
            errors.append(pdf_path.name)
        else:
            print("FAILED")
            errors.append(pdf_path.name)

    print(f"\n--- Summary ---")
    print(f"Parsed:  {len(tournaments)}")
    print(f"Errors:  {len(errors)}")
    if errors:
        print("  " + "\n  ".join(errors))

    # Sort tournaments by date
    tournaments.sort(key=lambda t: t["date_start"] or "")

    print("\nComputing player stats...")
    players = compute_stats(tournaments)
    print(f"Players found: {len(players)}")

    output = {
        "generated_at": __import__('datetime').datetime.now().isoformat(),
        "total_tournaments": len(tournaments),
        "total_players": len(players),
        "tournaments": tournaments,
        "players": players,
    }

    out_path = DATA_DIR / "tournaments.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    size_mb = out_path.stat().st_size / 1_048_576
    print(f"\nSaved -> {out_path}  ({size_mb:.1f} MB)")

    # Quick validation print
    top_players = sorted(players.values(), key=lambda p: p["wins"], reverse=True)[:5]
    print("\nTop 5 players by wins:")
    for p in top_players:
        print(f"  {p['name']:30s}  {p['wins']}W / {p['losses']}L  "
              f"Deuce: {p['deuce_win_rate']}%  Comeback: {p['comeback_rate']}%")


if __name__ == "__main__":
    main()
