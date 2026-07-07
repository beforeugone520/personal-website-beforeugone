#!/usr/bin/env bash
# 重建 theme-slider 产物后，一键把全站 ?v= 缓存戳同步为 js 产物的短哈希。
# 用法：./scripts/bump-cache-stamp.sh   （在仓库任意位置执行均可）
set -euo pipefail
cd "$(dirname "$0")/.."

STAMP=$(shasum -a 256 assets/theme-slider.js | cut -c1-8)

for f in index.html blog.html posts/*.html; do
  [ -f "$f" ] || continue
  sed -i '' -E "s/(theme-slider\.(js|css))\?v=[0-9a-f]+/\1?v=${STAMP}/g" "$f"
done

echo "cache stamp → ${STAMP}"
echo "各页引用现状（应全部一致）："
grep -RhoE 'theme-slider\.(js|css)\?v=[0-9a-f]+' index.html blog.html posts/*.html | sort | uniq -c
