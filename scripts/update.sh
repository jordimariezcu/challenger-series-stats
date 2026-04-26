#!/bin/bash
# Challenger Series — Update pipeline
# Usage: bash scripts/update.sh
# Fetches new PDFs automatically, parses, builds and deploys.

set -e  # stop on any error

echo "🏓 Challenger Series — Update pipeline"
echo "======================================="

# 1. Fetch new PDFs from challengerseries.net
echo ""
echo "🌐 Step 1/4 — Fetching new PDFs from website..."
python scripts/fetch_results.py

# 2. Parse PDFs → tournaments.json
echo ""
echo "📄 Step 2/4 — Parsing PDFs..."
python scripts/parse_pdfs.py

# 3. Build check
echo ""
echo "🔨 Step 3/4 — Building..."
npm run build --silent

# 4. Commit + push
echo ""
echo "🚀 Step 4/4 — Deploying..."
git add data/tournaments.json
git commit -m "Update tournament data — $(date '+%d.%m.%Y')" || echo "Nothing new to commit"
git push

echo ""
echo "✅ Done! Vercel will deploy in ~30 seconds."
echo "   https://cs-stats.com"
