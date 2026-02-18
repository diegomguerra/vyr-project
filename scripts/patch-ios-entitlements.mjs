#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const filePath = resolve("ios/App/App/App.entitlements");
const KEY = "com.apple.developer.healthkit";

const EMPTY_ENTITLEMENTS = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n</dict>\n</plist>\n`;

if (!existsSync(filePath)) {
  writeFileSync(filePath, EMPTY_ENTITLEMENTS, "utf8");
}

let xml = readFileSync(filePath, "utf8");
const pairRegex = new RegExp(`<key>${KEY}</key>\\s*<(true\\/|false\\/)>`);

if (pairRegex.test(xml)) {
  xml = xml.replace(pairRegex, `<key>${KEY}</key>\n\t<true/>`);
} else {
  const dictClose = "</dict>";
  const idx = xml.indexOf(dictClose);
  if (idx === -1) {
    throw new Error("Invalid App.entitlements: missing </dict>");
  }

  const insert = `\t<key>${KEY}</key>\n\t<true/>\n`;
  xml = `${xml.slice(0, idx)}${insert}${xml.slice(idx)}`;
}

if (!new RegExp(`<key>${KEY}</key>\\s*<true\\/>`).test(xml)) {
  throw new Error(`${KEY} is missing or not true in ${filePath}`);
}

writeFileSync(filePath, xml, "utf8");
console.log("[ios:entitlements:patch] App.entitlements includes HealthKit entitlement.");
