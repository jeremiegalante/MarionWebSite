#!/usr/bin/env bash
set -euo pipefail
: "${FTP_HOST:?}" "${FTP_USER:?}" "${FTP_PASS:?}"
npm run build
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -e "mirror -R --delete out/ /www/; bye"
