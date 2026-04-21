#!/bin/bash
# Challenger Series — Update pipeline
# Usage: bash scripts/update.sh
# Drops new PDFs in /results, then run this script. That's it.

set -e  # stop on any error

echo "🏓 Challenger Series — Update pipeline"
echo "======================================="

# 1. Parse PDFs → tournaments.json
echo ""
echo "📄 Step 1/3 — Parsing PDFs..."
python scripts/parse_pdfs.py

# 2. Build check
echo ""
echo "🔨 Step 2/3 — Building..."
npm run build --silent

# 3. Commit + push
echo ""
echo "🚀 Step 3/3 — Deploying..."
git add data/tournaments.json
git commit -m "Update tournament data — $(date '+%d.%m.%Y')"
git push

echo ""
echo "✅ Done! Vercel will deploy in ~30 seconds."
echo "   https://challenger-series-stats.vercel.app"
