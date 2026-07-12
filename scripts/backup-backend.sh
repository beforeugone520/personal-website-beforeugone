#!/usr/bin/env bash
# Create a WAL-consistent SQLite backup for the Phase 1 API.
set -euo pipefail

umask 077

DB_PATH="${DATABASE_PATH:-/var/lib/beforeu-api/beforeu.db}"
BACKUP_DIR="${BEFOREU_BACKUP_DIR:-/var/backups/beforeu-api}"
DAILY_RETENTION_DAYS="${BEFOREU_BACKUP_DAILY_DAYS:-14}"
WEEKLY_RETENTION_DAYS="${BEFOREU_BACKUP_WEEKLY_DAYS:-84}"

for command in sqlite3 gzip sha256sum flock; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "required command not found: $command" >&2
    exit 1
  fi
done

if [[ ! -f "$DB_PATH" ]]; then
  echo "database not found: $DB_PATH" >&2
  exit 1
fi

if [[ ! "$DAILY_RETENTION_DAYS" =~ ^[1-9][0-9]*$ ]] ||
  [[ ! "$WEEKLY_RETENTION_DAYS" =~ ^[1-9][0-9]*$ ]]; then
  echo "backup retention values must be positive whole days" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR/daily" "$BACKUP_DIR/weekly"
exec 9>"$BACKUP_DIR/.backup.lock"
if ! flock -n 9; then
  echo "another backup is already running" >&2
  exit 1
fi

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
basename="beforeu-${timestamp}.sqlite3"
work_dir="$(mktemp -d "$BACKUP_DIR/.backup.XXXXXX")"
snapshot="$work_dir/$basename"

cleanup() {
  rm -rf "$work_dir"
}
trap cleanup EXIT

# SQLite's online backup command includes committed WAL pages without stopping
# the API. Doubling apostrophes keeps the destination a single SQL string.
sqlite_snapshot=${snapshot//\'/\'\'}
sqlite3 -batch -bail "$DB_PATH" ".timeout 10000" ".backup '$sqlite_snapshot'"

check_result="$(sqlite3 -batch -bail "$snapshot" 'PRAGMA quick_check;')"
if [[ "$check_result" != "ok" ]]; then
  echo "backup failed SQLite quick_check: $check_result" >&2
  exit 1
fi

daily_archive="$BACKUP_DIR/daily/${basename}.gz"
gzip -c "$snapshot" >"${daily_archive}.tmp"
mv "${daily_archive}.tmp" "$daily_archive"
sha256sum "$daily_archive" >"${daily_archive}.sha256"

if [[ "$(date -u +%u)" == "7" ]]; then
  weekly_archive="$BACKUP_DIR/weekly/${basename}.gz"
  cp "$daily_archive" "$weekly_archive"
  sha256sum "$weekly_archive" >"${weekly_archive}.sha256"
fi

find "$BACKUP_DIR/daily" -type f -mtime "+$DAILY_RETENTION_DAYS" -delete
find "$BACKUP_DIR/weekly" -type f -mtime "+$WEEKLY_RETENTION_DAYS" -delete

echo "backup created: $daily_archive"
