#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PY="${PYTHON_BIN:-python3}"
if ! command -v "$PY" >/dev/null 2>&1; then
  echo 'Python 3.11 or 3.12 is required. Install Python, then rerun this script.' >&2
  exit 1
fi
"$PY" - <<'PY'
import sys
if sys.version_info[:2] not in ((3,11),(3,12)):
    raise SystemExit(f'CrewAI workshop expects Python 3.11 or 3.12, found {sys.version.split()[0]}. Set PYTHON_BIN to a supported executable.')
PY
"$PY" -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r agent_demo/requirements.txt
if [ ! -f .env ]; then cp .env.example .env; fi
printf '\nDependencies installed. Put your private GROQ_API_KEY and GEMINI_API_KEY into .env.\n'
printf 'Then run ./run-workshop.sh and open http://127.0.0.1:4173/office\n'
