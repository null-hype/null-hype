#!/usr/bin/env bash

set -euo pipefail

if command -v container-use >/dev/null 2>&1; then
  exit 0
fi

curl -fsSL https://raw.githubusercontent.com/dagger/container-use/main/install.sh \
  | sudo env BIN_DIR=/usr/local/bin bash
