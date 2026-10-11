#!/usr/bin/env bash
set -euo pipefail
: "${FTP_HOST:?}" "${FTP_USER:?}" "${FTP_PASS:?}"
command -v lftp >/dev/null || { echo "lftp not installed"; exit 1; }
REMOTE_PATH="${FTP_REMOTE_PATH:-/www/}"
export LFTP_PASSWORD="$FTP_PASS"
npm run build
lftp -u "$FTP_USER" "$FTP_HOST" -e "mirror -R --delete out/ \"$REMOTE_PATH\"; bye"
