#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then echo 'Node.js 20+ is required.' >&2; exit 1; fi
if [ -x .venv/bin/python ]; then export PYTHON="$(pwd)/.venv/bin/python"; fi
printf '\nCAMPUSBITES · live workshop launcher\n'
node scripts/verify.mjs --starter
node scripts/verify.mjs --reference
"${PYTHON:-python3}" scripts/doctor.py
printf '\nOpen the shop:       http://127.0.0.1:%s/\n' "${PORT:-4173}"
printf 'Open the AI office:  http://127.0.0.1:%s/office\n' "${PORT:-4173}"
printf 'Type: Implement the student discount section in my cart.\n\n'
exec node server.mjs
