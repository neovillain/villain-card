#!/usr/bin/env bash
# Деплой villain-card на VPS.
# Использование: ./deploy/deploy.sh user@1.2.3.4
set -euo pipefail

VPS="${1:?Укажи адрес VPS: ./deploy/deploy.sh user@1.2.3.4}"
SSH_KEY="$HOME/.ssh/villain_vps"
REMOTE_DIR="/opt/villain"

cd "$(dirname "$0")/.."

echo "==> Сборка..."
npm run build

echo "==> Заливка на $VPS..."
ssh -i "$SSH_KEY" "$VPS" "mkdir -p $REMOTE_DIR"
rsync -az --delete -e "ssh -i $SSH_KEY" dist/ "$VPS:$REMOTE_DIR/dist/"
rsync -az -e "ssh -i $SSH_KEY" deploy/Caddyfile deploy/docker-compose.yml "$VPS:$REMOTE_DIR/"

echo "==> Запуск Caddy..."
ssh -i "$SSH_KEY" "$VPS" "cd $REMOTE_DIR && docker compose up -d && docker compose ps"

echo "==> Готово: https://neovillain.space"
