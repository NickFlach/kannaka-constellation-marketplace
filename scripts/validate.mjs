#!/usr/bin/env node
// Validate .claude-plugin/marketplace.json for the Kannaka Constellation
// marketplace. Zero dependencies — plain Node (>=20) with global fetch.
//
// Checks:
//   1. The manifest parses as JSON.
//   2. Required top-level fields exist (name, owner{name}, plugins[]).
//   3. Every plugin has a name (unique) and a resolvable source.
//   4. Marketplace + plugin versions are semver-ish.
//   5. Each plugin's source repo exists on GitHub (404 -> failure,
//      rate-limit / 5xx / network error -> warning, not failure).
//
// Usage:
//   node scripts/validate.mjs            # full validation (hits the network)
//   node scripts/validate.mjs --offline  # skip the repo-existence check
//
// Exit code is non-zero if any error is found. Warnings never fail the run.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const MANIFEST = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const OFFLINE = process.argv.includes('--offline');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// Lenient semver: MAJOR.MINOR.PATCH with optional -prerelease / +build.
const SEMVER = /^\d+\.\d+\.\d+([-+][0-9A-Za-z.-]+)?$/;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

// Pull an { owner, repo } off whatever shape a plugin `source` takes.
// Returns null when the source is not a recognizable GitHub reference.
function githubRepoFrom(source) {
  let ref = null;
  if (isNonEmptyString(source)) {
    ref = source;
  } else if (source && typeof source === 'object') {
    ref = source.url || source.repo || source.repository || null;
  }
  if (!isNonEmptyString(ref)) return null;

  // https://github.com/owner/repo(.git), git@github.com:owner/repo(.git)
  let m = ref.match(/github\.com[/:]([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/#?].*)?$/i);
  if (m) return { owner: m[1], repo: m[2] };

  // bare "owner/repo" shorthand
  m = ref.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  if (m && !ref.includes('://')) return { owner: m[1], repo: m[2] };

  return null;
}

async function repoExists({ owner, repo }) {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'kannaka-marketplace-validator',
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal });
    if (res.status === 404) return { ok: false };
    if (res.status === 403 || res.status === 429) {
      const remaining = res.headers.get('x-ratelimit-remaining');
      return { warn: `${owner}/${repo}: GitHub API ${res.status}` +
        (remaining === '0' ? ' (rate-limited)' : '') + ' — could not verify' };
    }
    if (res.status >= 500) {
      return { warn: `${owner}/${repo}: GitHub API ${res.status} — could not verify` };
    }
    return { ok: true }; // 2xx / 3xx (redirects on rename still resolve)
  } catch (e) {
    return { warn: `${owner}/${repo}: ${e.name === 'AbortError' ? 'request timed out' : e.message} — could not verify` };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  let raw;
  try {
    raw = await readFile(MANIFEST, 'utf8');
  } catch (e) {
    err(`cannot read ${path.relative(ROOT, MANIFEST)}: ${e.message}`);
    return report();
  }

  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (e) {
    err(`marketplace.json is not valid JSON: ${e.message}`);
    return report();
  }

  // Top-level required fields.
  if (!isNonEmptyString(manifest.name)) err('top-level "name" is missing or empty');
  if (!manifest.owner || typeof manifest.owner !== 'object') {
    err('top-level "owner" object is missing');
  } else if (!isNonEmptyString(manifest.owner.name)) {
    err('"owner.name" is missing or empty');
  }
  if ('version' in manifest && !SEMVER.test(String(manifest.version))) {
    err(`marketplace "version" is not semver-ish: ${manifest.version}`);
  }

  if (!Array.isArray(manifest.plugins) || manifest.plugins.length === 0) {
    err('"plugins" must be a non-empty array');
    return report();
  }

  const seen = new Set();
  const repoChecks = [];

  manifest.plugins.forEach((p, i) => {
    const label = isNonEmptyString(p?.name) ? p.name : `plugins[${i}]`;

    if (!p || typeof p !== 'object') {
      err(`plugins[${i}] is not an object`);
      return;
    }
    if (!isNonEmptyString(p.name)) {
      err(`plugins[${i}] is missing "name"`);
    } else if (seen.has(p.name)) {
      err(`duplicate plugin name: ${p.name}`);
    } else {
      seen.add(p.name);
    }

    if (p.source === undefined || p.source === null) {
      err(`${label}: missing "source"`);
    } else {
      const gh = githubRepoFrom(p.source);
      if (!gh) {
        warn(`${label}: source is not a recognizable GitHub repo — skipping existence check`);
      } else if (!OFFLINE) {
        repoChecks.push({ label, gh });
      }
    }

    if ('version' in p && !SEMVER.test(String(p.version))) {
      err(`${label}: "version" is not semver-ish: ${p.version}`);
    }
  });

  if (!OFFLINE && repoChecks.length) {
    const results = await Promise.all(repoChecks.map((c) => repoExists(c.gh)));
    results.forEach((r, i) => {
      const { label, gh } = repoChecks[i];
      if (r.ok) return;
      if (r.warn) warn(r.warn);
      else err(`${label}: source repo does not exist: ${gh.owner}/${gh.repo} (HTTP 404)`);
    });
  } else if (OFFLINE) {
    warn('offline mode — skipped source repo existence checks');
  }

  report(manifest);
}

function report(manifest) {
  console.log(`Validating ${path.relative(ROOT, MANIFEST)}`);
  if (manifest?.plugins) {
    console.log(`  ${manifest.plugins.length} plugin(s) declared`);
  }
  for (const w of warnings) console.log(`  [warn]  ${w}`);
  for (const e of errors) console.log(`  [error] ${e}`);

  if (errors.length) {
    console.log(`\nFAIL: ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }
  console.log(`\nPASS: 0 errors, ${warnings.length} warning(s).`);
}

await main();
