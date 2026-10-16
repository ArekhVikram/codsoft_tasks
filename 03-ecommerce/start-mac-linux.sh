#!/usr/bin/env bash
echo "==================================================="
echo "  NOVA SUPPLY - CODSOFT Level 3 E-Commerce Platform"
echo "==================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not found on your system!"
    echo "Please install Node.js from https://nodejs.org/ to run the full-stack server."
    echo ""
    echo "In the meantime, you can double-click 'double-click-to-run.html'"
    echo "to preview and interact with the full store immediately in your browser!"
    exit 1
fi

echo "[1/3] Installing dependencies for server and client..."
npm run install:all

echo ""
echo "[2/3] Building production client..."
npm run build

echo ""
echo "[3/3] Starting NOVA SUPPLY server on http://localhost:5000 ..."
# Open browser depending on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:5000 &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:5000 &> /dev/null &
fi

node server/server.js
