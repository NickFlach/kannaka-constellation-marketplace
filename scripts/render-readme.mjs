#!/usr/bin/env node
// Regenerate the plugin listing in README.md from the marketplace manifest.
// Zero dependencies — plain Node (>=20).
//
// The generated block lives between these HTML-comment markers in README.md:
//   <!-- plugins:begin -->  ...generated...  <!-- plugins:end -->
// Everything outside the markers (banner, intro, install, contributing) is
// hand-maintained and left untouched.
//
// Usage:
//   node scripts/render-readme.mjs          # rewrite README.md in place
//   node scripts/render-readme.mjs --check   # exit 1 if README is stale

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const MANIFEST = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const README = path.join(ROOT, 'README.md');
const BEGIN = '<!-- plugins:begin -->';
const END = '<!-- plugins:end -->';
const CHECK = process.argv.includes('--check');

// First sentence of a description, for the summary table.
function firstSentence(text) {
  const s = String(text).replace(/\s+/g, ' ').trim();
  const m = s.match(/^(.+?[.!?])(\s|$)/);
  return (m ? m[1] : s).replace(/\|/g, '\\|');
}

function render(manifest) {
  const plugins = manifest.plugins;
  const lines = [];

  lines.push(`> Generated from \`.claude-plugin/marketplace.json\` (marketplace v${manifest.version}) by \`scripts/render-readme.mjs\` — do not edit by hand.`);
  lines.push('');

  // Summary table.
  lines.push('| Plugin | Version | Category | What it does |');
  lines.push('| --- | --- | --- | --- |');
  for (const p of plugins) {
    const name = p.homepage ? `[\`${p.name}\`](${p.homepage})` : `\`${p.name}\``;
    lines.push(`| ${name} | \`${p.version ?? '—'}\` | ${p.category ?? '—'} | ${firstSentence(p.description)} |`);
  }
  lines.push('');

  // Per-plugin detail sections.
  for (const p of plugins) {
    lines.push(`### ${p.name}${p.version ? ` (v${p.version})` : ''}`);
    lines.push('');
    lines.push(String(p.description).replace(/\s+/g, ' ').trim());
    lines.push('');
    lines.push('```');
    lines.push(`/plugin install ${p.name}@${manifest.name}`);
    lines.push('```');
    lines.push('');
    if (p.homepage) lines.push(`Source: ${p.homepage}`);
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function inject(readme, block) {
  const b = readme.indexOf(BEGIN);
  const e = readme.indexOf(END);
  if (b === -1 || e === -1 || e < b) {
    throw new Error(`README.md is missing the ${BEGIN} / ${END} markers`);
  }
  const head = readme.slice(0, b + BEGIN.length);
  const tail = readme.slice(e);
  return `${head}\n${block}\n${tail}`;
}

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
const current = await readFile(README, 'utf8');
const next = inject(current, render(manifest));

if (CHECK) {
  if (current !== next) {
    console.error('README.md plugin section is out of date. Run: node scripts/render-readme.mjs');
    process.exit(1);
  }
  console.log('README.md plugin section is up to date.');
} else {
  if (current === next) {
    console.log('README.md already up to date.');
  } else {
    await writeFile(README, next);
    console.log('README.md plugin section regenerated.');
  }
}
