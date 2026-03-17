#!/usr/bin/env bash

set -euo pipefail

npm install -g @openai/codex @google/gemini-cli
curl -fsSL https://raw.githubusercontent.com/dagger/container-use/main/install.sh | bash
