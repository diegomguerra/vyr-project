#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const filePath = resolve("ios/App/App/Info.plist");
const SHARE_KEY = "NSHealthShareUsageDescription";
const UPDATE_KEY = "NSHealthUpdateUsageDescription";
const SHARE_VALUE = "Precisamos acessar seus dados do Apple Health para gerar métricas e relatórios no app.";
const UPDATE_VALUE = "Precisamos gravar alguns dados no Apple Health para integrar e sincronizar suas métricas.";

function upsertStringKey(xml, key, value) {
  const pairRegex = new RegExp(`<key>${key}</key>\\s*<string>([\\s\\S]*?)<\\/string>`);
  if (pairRegex.test(xml)) {
    return xml.replace(pairRegex, `<key>${key}</key>\n\t<string>${value}</string>`);
  }

  const dictClose = "</dict>";
  const idx = xml.indexOf(dictClose);
  if (idx === -1) {
    throw new Error("Invalid Info.plist: missing </dict>");
  }

  const insert = `\t<key>${key}</key>\n\t<string>${value}</string>\n`;
  return `${xml.slice(0, idx)}${insert}${xml.slice(idx)}`;
}

function validateNonEmpty(xml, key) {
  const match = xml.match(new RegExp(`<key>${key}</key>\\s*<string>([\\s\\S]*?)<\\/string>`));
  const value = match?.[1]?.trim();
  if (!value) {
    throw new Error(`${key} is missing or empty in ${filePath}`);
  }
}

let xml = readFileSync(filePath, "utf8");
xml = upsertStringKey(xml, SHARE_KEY, SHARE_VALUE);
xml = upsertStringKey(xml, UPDATE_KEY, UPDATE_VALUE);
validateNonEmpty(xml, SHARE_KEY);
validateNonEmpty(xml, UPDATE_KEY);

writeFileSync(filePath, xml, "utf8");
console.log("[ios:plist:patch] Info.plist HealthKit keys are present and non-empty.");
