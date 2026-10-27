# CampusBites: watch an AI team ship a feature

CampusBites is a small food-ordering website. You type a feature request in plain English, for example *"Add a Veg only switch above the menu"*, and a team of five AI agents builds it into the shop:

| Agent | Model | Job |
|---|---|---|
| Morgan, Manager | Gemini | Decides who works next. Never writes code. |
| Alex, Architect | Gemini | Turns your request into a spec with testable acceptance criteria. |
| Robin, QA | Gemini | Writes tests **before** any code exists, then runs every test at the end. |
| Sam, Backend | Groq | Writes `api/feature.mjs` until the API tests pass. |
| Riya, Frontend | Groq | Writes `site/feature.js` until the UI tests pass. |

Everything except the live AI run works **without API keys**.

---

## Table of contents

1. [What you need](#1-what-you-need)
2. [Install the tools](#2-install-the-tools) ([macOS](#macos) · [Windows](#windows) · [Linux](#linux))
3. [Get the code](#3-get-the-code)
4. [Run the website](#4-run-the-website-no-keys-needed)
5. [Run the tests](#5-run-the-tests)
6. [Optional: run the real AI agents](#6-optional-run-the-real-ai-agents)
7. [Where the agentic AI lives](#7-where-the-agentic-ai-lives)
8. [Your challenge: Track My Order](#8-your-challenge-track-my-order)
9. [Troubleshooting](#troubleshooting)

**How to read the code blocks:** every grey box is a command. Copy the whole box, paste it into your terminal, press `Enter`. Lines that start with `#` are comments; your terminal ignores them.

**How to open a terminal:**

| OS | How |
|---|---|
| macOS | Press `Cmd + Space`, type `Terminal`, press `Enter` |
| Windows | Press the `Windows` key, type `PowerShell`, press `Enter`. Use **PowerShell**, not the old "Command Prompt" |
| Linux | Press `Ctrl + Alt + T` (Ubuntu), or open "Terminal" from your apps menu |

---

## 1. What you need

| Tool | Version | Needed for |
|---|---|---|
| [Node.js](https://nodejs.org/) | **22 LTS recommended** (20 is the minimum) | The website and tests. Always needed |
| [Git](https://git-scm.com/downloads) | any | Downloading the code. Optional: you can download a ZIP instead |
| [Python](https://www.python.org/downloads/) | **3.11 or 3.12** | Only the real AI agents (step 6) and the Python tests |

No `npm install` is needed. The project has zero Node dependencies.

> **Windows users:** pick Node 22, not 20. `npm test` uses a `*` file pattern that Node 20 on Windows cannot expand.
>
> **Python 3.13 or newer:** may not work with the AI libraries. Use 3.12 if you can.

---

## 2. Install the tools

Already have them? Skip to [Check that everything is installed](#check-that-everything-is-installed).

### macOS

**Option A: Homebrew (recommended).** Homebrew is a free installer for developer tools.

Install Homebrew (skip if `brew --version` already works):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

When it finishes, it prints **"Next steps"** with two or three commands. Copy and run those too, or `brew` won't be found. Then:

```bash
brew install node@22 git python@3.12
brew link --overwrite node@22
```

**Option B: installers from the websites.** Download and run:

- Node.js 22 LTS: https://nodejs.org/
- Python 3.12: https://www.python.org/downloads/macos/
- Git: macOS asks to install it the first time you type `git`. Click **Install**.

Close the Terminal and open a new one after installing.

### Windows

**Option A: winget (recommended).** `winget` is built into Windows 10 (recent updates) and Windows 11. In PowerShell:

```powershell
winget install -e --id OpenJS.NodeJS.LTS
winget install -e --id Git.Git
winget install -e --id Python.Python.3.12
```

Accept any prompts (type `Y` and press `Enter` if asked).

**Option B: installers from the websites.** Download and run:

- Node.js 22 LTS: https://nodejs.org/ (keep all default options)
- Git: https://git-scm.com/download/win (keep all default options)
- Python 3.12: https://www.python.org/downloads/windows/

> **Important (Python installer):** on the first screen, tick **"Add python.exe to PATH"** before clicking *Install Now*. If you forget, uninstall and reinstall.

**Close PowerShell and open a new one** after installing. New tools are not visible in windows that were already open.

> **Tip:** on Windows, the Python command is `python` (or `py`), not `python3`. This README shows the Windows version separately wherever it differs.

### Linux

**Ubuntu 24.04 / Debian 12 / Linux Mint 22** (and other Debian-based):

```bash
sudo apt update
sudo apt install -y git curl python3 python3-venv python3-pip
```

Ubuntu's own `nodejs` package is often too old. Install Node 22 with **nvm** (Node Version Manager) instead:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm install 22
```

> **Ubuntu 22.04 or older** ships Python 3.10, which is too old for the AI agents. Install 3.12:
>
> ```bash
> sudo add-apt-repository -y ppa:deadsnakes/ppa
> sudo apt update
> sudo apt install -y python3.12 python3.12-venv
> ```
>
> Then use `python3.12` wherever this README says `python3`.

**Fedora:**

```bash
sudo dnf install -y nodejs git python3.12
```

**Arch / Manjaro:**

```bash
sudo pacman -S --needed nodejs npm git python
```

### Check that everything is installed

Open a **new** terminal and run:

**macOS / Linux**

```bash
node --version
npm --version
git --version
python3 --version
```

**Windows (PowerShell)**

```powershell
node --version
npm --version
git --version
python --version
```

You should see version numbers, for example `v22.11.0` and `Python 3.12.7`. If you see `command not found` or `is not recognized`, see [Troubleshooting](#troubleshooting).

---

## 3. Get the code

**With Git** (same on every OS):

```bash
git clone https://github.com/SHREY247/agentic-ai-engineering-lab.git CampusBites
cd CampusBites
```

**Without Git:** download the ZIP (green **Code** button → **Download ZIP**), unzip it, then open a terminal inside the unzipped folder:

| OS | How to open a terminal in a folder |
|---|---|
| macOS | Right-click the folder in Finder → **Services** → **New Terminal at Folder**. Or type `cd ` (with a space) in Terminal and drag the folder onto the window, then press `Enter` |
| Windows | Open the folder in File Explorer, click the address bar, type `powershell`, press `Enter` |
| Linux | Right-click inside the folder → **Open in Terminal** |

**Check you are in the right place.** This should list `package.json`, `server.mjs` and `README.md`:

**macOS / Linux**

```bash
ls
```

**Windows (PowerShell)**

```powershell
dir
```

> **Every command from here on must be run from this project folder** (the one that contains `package.json`).

---

## 4. Run the website (no keys needed)

```bash
npm start
```

You should see the server start. Leave this terminal open; the website runs as long as it is open. Now open these in your browser:

| URL | What you'll see |
|---|---|
| http://127.0.0.1:4173 | The food shop |
| http://127.0.0.1:4173/office | The AI team's office: five desks, live events |

**Try it:** add food to your bag. The shop works, but it has no extra features yet: no coupons, no filters, no tips. The shop has an empty **feature slot**; the agents fill it with whatever you ask for.

Without API keys, you can still see the story in `/office`:

- **View scripted preview** plays an animation of a run. No AI is called.
- **Apply reference** installs a hand-written example feature (a `STUDENT10` coupon box in the bag). A human wrote it, not the agents.
- **Reset** empties the feature slot again.

Let the preview finish before clicking another button; the other buttons wait until it's done.

**To stop the server:** click the terminal window and press `Ctrl + C` (on macOS too: `Ctrl`, not `Cmd`).

---

## 5. Run the tests

Open a **second** terminal in the project folder (or stop the server first), then run:

**Node tests (all OSes):**

```bash
npm test
```

Expected from `npm test`: **2 pass, 5 fail.** (The additional six facilitator-owned student-discount checks run in `check:starter` and the live student-discount release gate.) That is correct: no feature is installed yet. Six of these are fixed *contract* tests that every feature must pass; the seventh is a placeholder the QA agent replaces with real acceptance tests during a run.

**Prove a correct solution exists (all OSes):**

```bash
node scripts/verify.mjs --reference
```

Expected: `--reference: 18 passed, 0 failed`. This checks the hand-written example feature in a temporary folder and does not change your files.

**Python tests for the manager's rulebook:**

macOS / Linux:

```bash
python3 -m unittest discover -s tests -p "test_*.py" -v
```

Windows (PowerShell):

```powershell
python -m unittest discover -s tests -p "test_*.py" -v
```

Expected: `Ran 8 tests ... OK`. These need only plain Python, no extra packages.

---

## 6. Optional: run the real AI agents

This is the only part that needs API keys and Python packages.

> **Safety first.** The agents write JavaScript that runs on your machine. Use a virtual machine or a container if you can. **Never commit your `.env` file or share your keys.** It is already listed in `.gitignore`.

> **Windows users:** the live agent run is tested on macOS and Linux. If it fails on Windows, use [WSL](https://learn.microsoft.com/windows/wsl/install) (run `wsl --install` in an admin PowerShell, restart, then follow the **Linux** steps inside Ubuntu).

### 6.1 Get two free API keys

| Provider | Where | Notes |
|---|---|---|
| Groq | https://console.groq.com/keys | Sign in → **Create API Key** → copy it |
| Gemini | https://aistudio.google.com/apikey | Sign in with Google → **Create API key** → copy it |

Keep them somewhere private for a minute. You will paste them into a file in step 6.3.

### 6.2 Create a Python virtual environment and install packages

A *virtual environment* (`.venv`) is a private folder of Python packages just for this project, so nothing gets installed system-wide.

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r agent_demo/requirements.txt
cp .env.example .env
```

(Ubuntu 22.04 with deadsnakes: use `python3.12 -m venv .venv` on the first line.)

**Windows (PowerShell)**

```powershell
python -m venv .venv
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r agent_demo/requirements.txt
copy .env.example .env
```

The `Set-ExecutionPolicy` line lets PowerShell run the activation script. You only need it once per computer.

When the environment is active, your prompt starts with `(.venv)`. The install takes a few minutes.

> **Opened a new terminal later?** Activate the environment again before running any Python command from this section:
> macOS / Linux: `source .venv/bin/activate` · Windows: `.venv\Scripts\Activate.ps1`

### 6.3 Put your keys in `.env`

Open the `.env` file you just created:

| OS | Command |
|---|---|
| macOS | `open -e .env` |
| Windows | `notepad .env` |
| Linux | `nano .env` (save with `Ctrl + O`, `Enter`, exit with `Ctrl + X`) |

Fill in the two keys and the Python path. Leave the other lines as they are.

**macOS / Linux:**

```ini
GROQ_API_KEY=paste-your-groq-key-here
GEMINI_API_KEY=paste-your-gemini-key-here
PYTHON=.venv/bin/python
```

**Windows:**

```ini
GROQ_API_KEY=paste-your-groq-key-here
GEMINI_API_KEY=paste-your-gemini-key-here
PYTHON=.venv\Scripts\python.exe
```

No spaces around `=`, no quotes needed. Save the file.

The `PYTHON` line tells the website which Python to use for the agents, so the packages from step 6.2 are found. On Windows it is required, because the default (`python3`) usually doesn't exist there.

### 6.4 Check your setup

This makes **no** request to the AI providers and never prints your keys:

**macOS / Linux**

```bash
python scripts/doctor.py
```

**Windows (PowerShell)**

```powershell
python scripts\doctor.py
```

You want to see `configured` for both keys and `installed` for `crewai`, `litellm` and `google.genai`. Anything `MISSING`? See [Troubleshooting](#troubleshooting).

### 6.5 Start a real run

```bash
npm start
```

Open http://127.0.0.1:4173/office. Type a feature request in the box (or click an example such as **Veg-only switch** or **Rider tip**), then click **Start real agent run**.

What happens, in order:

1. The Architect writes a spec. If the request needs things the shop can't do (real payments, GPS, logins), it says so and the manager stops.
2. QA writes acceptance tests. The tool **rejects tests that already pass**, because a test that passes before the feature exists tests nothing.
3. Backend and Frontend each write their file. After every save the tool runs the tests and tells the agent exactly which of its tests fail, so it can fix them.
4. QA runs every test. A separate release gate, with no AI in it, decides pass or fail.

A typical run takes 2–4 minutes and about 11 Gemini and 4–6 Groq calls (caps: 16 and 10). When it passes, refresh http://127.0.0.1:4173 to use the new feature.

Not every request will work. When a run fails, the failure is shown honestly; read it, click **Reset**, and try a clearer or smaller request.

### 6.6 Inspect what the agents actually did

In a second terminal (with `.venv` activated):

**macOS / Linux**

```bash
python scripts/audit_run.py latest
```

**Windows (PowerShell)**

```powershell
python scripts\audit_run.py latest
```

Or click each desk in `/office` and open **Changes** or **Tests**. All evidence is saved in `runs/<run-id>/`.

To try again, click **Reset** in `/office`, then start another run.

---

## 7. Where the agentic AI lives

The repo has about 40 files. To understand the agents, read these four:

| # | File | Read it to learn |
|---|---|---|
| 1 | [agent_demo/orchestration.py](agent_demo/orchestration.py) | The rulebook: what the manager may choose at each step (spec → tests first → code → verify). No AI in this file. |
| 2 | [agent_demo/crew.py](agent_demo/crew.py) | The team: agents, their tools, the guardrails on every file write, the call budget and the final release gate. |
| 3 | [agent_demo/FEATURE_CONTRACT.md](agent_demo/FEATURE_CONTRACT.md) | The "plug" every feature must fit. The agents read this; so should you. |
| 4 | [tests/feature.contract.test.mjs](tests/feature.contract.test.mjs) and, after a run, [tests/feature.acceptance.test.mjs](tests/feature.acceptance.test.mjs) | The definition of done: fixed contract tests written by humans, acceptance tests written by the QA agent. |

The agents may write only three files: [site/feature.js](site/feature.js) (Frontend), [api/feature.mjs](api/feature.mjs) (Backend) and `tests/feature.acceptance.test.mjs` (QA). Everything else (`server.mjs`, `office.*`, the rest of `site/`) is the shop and the live dashboard.

**Start here in `crew.py`:** search for `trust deterministic tests`. That one line is the main idea of the whole project: the program checks the tests itself instead of believing what the AI says.

### Project layout

```text
CampusBites/
├── server.mjs              # Local web server (no dependencies)
├── package.json            # npm start / npm test
├── .env.example            # Template for your private .env
├── site/                   # The food shop (HTML, CSS, JS)
│   ├── feature.js          # ← Frontend agent writes this (the feature slot)
│   └── feature-runtime.js  # How the shop plugs a feature in
├── api/
│   └── feature.mjs         # ← Backend agent writes this
├── office.*  studio.*      # The live "AI office" dashboard
├── agent_demo/
│   ├── orchestration.py    # Manager's rulebook (no AI)
│   ├── crew.py             # The AI team (CrewAI)
│   ├── FEATURE_CONTRACT.md # The rules every feature must follow
│   └── requirements.txt    # Python packages for the agents
├── tests/                  # Contract tests, QA's acceptance tests, Python tests
├── scripts/
│   ├── doctor.py           # Setup check (no AI calls)
│   ├── verify.mjs          # Offline test checks
│   └── audit_run.py        # Inspect a finished run
├── facilitator/            # starter/ (empty slot, used by Reset) and reference/ (example feature)
└── docs/                   # Challenge, ticket and run-audit guides
```

---

## 8. Your challenge: Track My Order

Write a feature request the AI team can build, run it, and judge the result like a manager. Then build a bigger one, Track My Order, with any AI tool you like. See [docs/STUDENT_CHALLENGE.md](docs/STUDENT_CHALLENGE.md). Submit the diff and the test output, not the AI's summary.

---

## Troubleshooting

### Installation

| Problem | Fix |
|---|---|
| `node: command not found` / `'node' is not recognized` | Node isn't installed or the terminal was open during install. Install Node 22 ([step 2](#2-install-the-tools)), then **close and reopen** the terminal |
| `node --version` shows v18 or lower | Install Node 22. On Linux, use the nvm steps; on macOS, `brew install node@22 && brew link --overwrite node@22` |
| `brew: command not found` after installing Homebrew | Run the "Next steps" commands Homebrew printed, or reopen Terminal |
| `nvm: command not found` (Linux) | Close and reopen the terminal, or run `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"` |
| Windows: `python` opens the Microsoft Store | Python isn't on PATH. Reinstall from python.org and tick **"Add python.exe to PATH"**, or use `py` instead of `python` |
| `python3: command not found` (macOS / Linux) | Install Python ([step 2](#2-install-the-tools)). On Ubuntu: `sudo apt install -y python3 python3-venv` |
| `The virtual environment was not created successfully because ensurepip is not available` (Ubuntu/Debian) | `sudo apt install -y python3-venv` (or `python3.12-venv`), then delete `.venv` and retry |
| `winget: command not found` / not recognized | Update **App Installer** from the Microsoft Store, or use the installers from the websites (Option B) |

### Running the site and tests

| Problem | Fix |
|---|---|
| `npm ERR! enoent ... package.json` | You're in the wrong folder. `cd` into the project folder (the one with `package.json`) |
| `EADDRINUSE` / port 4173 in use | Another server is running. Stop it with `Ctrl + C`, or use a different port. macOS / Linux: `PORT=4200 npm start`. Windows PowerShell: `$env:PORT=4200; npm start`. Then open `http://127.0.0.1:4200` |
| Browser says "This site can't be reached" | The server isn't running. Check the terminal where you ran `npm start` for errors |
| Windows: `npm test` says "Could not find tests/*.test.mjs" | Your Node is version 20. Install Node 22, or run `node --test tests/feature.contract.test.mjs tests/feature.acceptance.test.mjs` |
| `npm test` shows 5 failures (the starter state) | Expected while the feature slot is empty. See [step 5](#5-run-the-tests) |
| `ModuleNotFoundError: agent_demo` | Run the Python tests from the project root, not inside `agent_demo/` |

### Real AI run

| Problem | Fix |
|---|---|
| Windows: `Activate.ps1 cannot be loaded because running scripts is disabled` | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`, then activate again |
| `crewai: MISSING` in `doctor.py` | Activate `.venv` first, then `pip install -r agent_demo/requirements.txt` |
| `pip install` fails building packages | Check `python --version` is 3.11 or 3.12 (inside `.venv`). Delete `.venv` and recreate it with the right Python |
| `GROQ_API_KEY: MISSING` in `doctor.py` | `.env` is missing, misnamed (e.g. `.env.txt` on Windows) or the key line is empty. Windows: `notepad .env` and save with "All files" as type |
| "Both GROQ_API_KEY and GEMINI_API_KEY are required" in `/office` | Keys not set in `.env`. Fix them, then **restart** `npm start` (keys are read at startup) |
| "Could not launch CrewAI" | The `PYTHON=` line in `.env` is wrong or missing. Check the path from [step 6.3](#63-put-your-keys-in-env) exists, then restart `npm start` |
| "A feature is already installed. Click Reset before a new run." | Click **Reset** in `/office`, then start the run |
| "Provider rate limit: waiting" in the timeline | Normal on free tiers; the run pauses and retries by itself. If it happens a lot, lower `CAMPUSBITES_GROQ_RPM` / `CAMPUSBITES_GEMINI_RPM` in `.env` |
| Model not found / 404 from Gemini | Your key can't use that model. Set `GEMINI_MODEL` in `.env` to a Flash-Lite model listed in Google AI Studio |
| "Request flagged as not feasible" | The Architect decided the shop can't support it (payments, GPS, logins…). Reword it as something the shop can do with its menu data |
| Run stops with "call budget exhausted" or a rate-limit error | Free-tier quota ran out. Wait a few minutes, or check your quota in the Groq and Google AI Studio consoles |
| Feature missing after a run | Read the failure in `/office` or `python scripts/audit_run.py latest`. A failed run is shown as failed on purpose |

### Starting over

Empty the feature slot again: click **Reset** in `/office`.

Delete the Python environment and run evidence, then redo [step 6.2](#62-create-a-python-virtual-environment-and-install-packages):

**macOS / Linux**

```bash
rm -rf .venv runs
```

**Windows (PowerShell)**

```powershell
Remove-Item -Recurse -Force .venv, runs
```

---

How to check a finished run step by step: [docs/AUDIT_GUIDE.md](docs/AUDIT_GUIDE.md)
#   C a m p u s _ b i t e s  
 # Campus_bites
# Campus_bites
# Campus_bites
