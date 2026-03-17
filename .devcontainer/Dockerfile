FROM mcr.microsoft.com/devcontainers/base:ubuntu

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

USER root

RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl gnupg openssh-server \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
      | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g @openai/codex @google/gemini-cli \
    && curl -fsSL https://raw.githubusercontent.com/dagger/container-use/main/install.sh | bash \
    && mkdir -p /run/sshd \
    && rm -rf /var/lib/apt/lists/*
