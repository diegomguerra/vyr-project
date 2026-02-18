#!/usr/bin/env bash
set -euo pipefail

INFO_PLIST="ios/App/App/Info.plist"
ENTITLEMENTS_PLIST="ios/App/App/App.entitlements"
PLISTBUDDY="/usr/libexec/PlistBuddy"

HEALTH_SHARE_TEXT="Precisamos acessar seus dados do Apple Health para gerar métricas e relatórios no app."
HEALTH_UPDATE_TEXT="Precisamos gravar alguns dados no Apple Health para integrar e sincronizar suas métricas."

if [ ! -f "$INFO_PLIST" ]; then
  echo "Erro: arquivo não encontrado: $INFO_PLIST" >&2
  exit 1
fi

if [ ! -x "$PLISTBUDDY" ]; then
  echo "Erro: PlistBuddy não encontrado em $PLISTBUDDY (execute em macOS)." >&2
  exit 1
fi

escape_plist_value() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

set_or_add_string_key() {
  local plist_file="$1"
  local key="$2"
  local raw_value="$3"
  local value
  value="$(escape_plist_value "$raw_value")"

  if "$PLISTBUDDY" -c "Print :$key" "$plist_file" >/dev/null 2>&1; then
    "$PLISTBUDDY" -c "Set :$key \"$value\"" "$plist_file"
  else
    "$PLISTBUDDY" -c "Add :$key string \"$value\"" "$plist_file"
  fi
}

set_or_add_bool_key() {
  local plist_file="$1"
  local key="$2"
  local value="$3"

  if "$PLISTBUDDY" -c "Print :$key" "$plist_file" >/dev/null 2>&1; then
    "$PLISTBUDDY" -c "Set :$key $value" "$plist_file"
  else
    "$PLISTBUDDY" -c "Add :$key bool $value" "$plist_file"
  fi
}

if [ ! -f "$ENTITLEMENTS_PLIST" ]; then
  cat > "$ENTITLEMENTS_PLIST" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
</dict>
</plist>
PLIST
fi

set_or_add_string_key "$INFO_PLIST" "NSHealthShareUsageDescription" "$HEALTH_SHARE_TEXT"
set_or_add_string_key "$INFO_PLIST" "NSHealthUpdateUsageDescription" "$HEALTH_UPDATE_TEXT"
set_or_add_bool_key "$ENTITLEMENTS_PLIST" "com.apple.developer.healthkit" true

echo "HealthKit patch aplicado com sucesso."
