#!/usr/bin/env node
// Bump a single plugin's version in the marketplace manifest and bump the
// marketplace's own patch version. Zero dependencies — plain Node (>=20).
//
// Usage:
//   node scripts/bump.mjs --plugin <name> --version <x.y.z>
//
// Writes .claude-plugin/marketplace.json in place and prints the new
// marketplace version on stdout (for CI to use in the PR title/branch).
// Exits non-zero if the plugin is unknown or the version is not semver-ish.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const MANIFEST = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const SEMVER = /^\d+\.\d+\.\d+([-+][0-9A-Za-z.-]+)?$/;

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const plugin = arg('plugin');
let version = arg('version');
if (!plugin || !version) {
  console.error('usage: node scripts/bump.mjs --plugin <name> --version <x.y.z>');
  process.exit(2);
}
version = String(version).replace(/^v/, '');
if (!SEMVER.test(version)) {
  console.error(`error: version is not semver-ish: ${version}`);
  process.exit(1);
}

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
const target = manifest.plugins.find((p) => p.name === plugin);
if (!target) {
  console.error(`error: no plugin named "${plugin}" in the manifest`);
  console.error(`known plugins: ${manifest.plugins.map((p) => p.name).join(', ')}`);
  process.exit(1);
}

const prevPlugin = target.version;
target.version = version;

// Bump the marketplace's own patch version.
const mv = String(manifest.version).match(/^(\d+)\.(\d+)\.(\d+)$/);
if (!mv) {
  console.error(`error: marketplace version is not x.y.z: ${manifest.version}`);
  process.exit(1);
}
const prevMarket = manifest.version;
manifest.version = `${mv[1]}.${mv[2]}.${Number(mv[3]) + 1}`;

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

console.error(`${plugin}: ${prevPlugin} -> ${version}`);
console.error(`marketplace: ${prevMarket} -> ${manifest.version}`);
// stdout carries only the new marketplace version, for CI capture.
console.log(manifest.version);
