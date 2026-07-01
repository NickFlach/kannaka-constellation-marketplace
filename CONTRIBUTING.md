# Contributing to the Kannaka Constellation marketplace

This repo is the discovery hub for the constellation. It is **manifest-first**:
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) is the
single source of truth, and the README plugin listing is generated from it.

## Local checks

Everything is a zero-dependency Node script (Node >= 20). No `npm install`.

```bash
# Validate the manifest (structure + semver + source repos exist on GitHub)
node scripts/validate.mjs
node scripts/validate.mjs --offline   # skip the network repo-existence check

# Regenerate the README plugin listing from the manifest
node scripts/render-readme.mjs
node scripts/render-readme.mjs --check # fail if the README is stale
```

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs the validator
and `render-readme.mjs --check` on every push and pull request.

## Adding or editing a plugin

1. Edit `.claude-plugin/marketplace.json` (add/modify the `plugins[]` entry —
   each needs at least `name` and a `source`).
2. Run `node scripts/render-readme.mjs` to refresh the README listing.
3. Run `node scripts/validate.mjs` and commit both files together.

## Wiring the release cascade from a child repo

When a child plugin cuts a release, it can auto-update this marketplace. The
receiver is [`.github/workflows/version-bump.yml`](.github/workflows/version-bump.yml),
triggered by a `plugin-released` `repository_dispatch`. On receipt it bumps the
plugin's version in the manifest, bumps the marketplace patch version,
regenerates the README, and opens a PR.

This mirrors the existing `kannaka-attention → kannaka-memory` cascade.

### One-time setup in the child repo

1. Create a fine-scoped Personal Access Token with **`contents: write`** and
   **`pull-requests: write`** on
   `NickFlach/kannaka-constellation-marketplace`.
2. Store it in the child repo's secrets as `KANNAKA_CASCADE_PAT`.

### Sender workflow in the child repo

Add this to the child repo (e.g. `.github/workflows/marketplace-cascade.yml`).
It fires on every `v*` tag and dispatches to this repo. Replace
`<plugin-name>` with the plugin's `name` in `marketplace.json`.

```yaml
name: marketplace cascade
on:
  push:
    tags: ['v*']
  workflow_dispatch:
    inputs:
      version:
        description: 'version (e.g. 2.1.1)'
        required: true
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Resolve version
        id: v
        run: |
          if [ -n "${{ inputs.version }}" ]; then
            v="${{ inputs.version }}"
          else
            v="${GITHUB_REF_NAME#v}"
          fi
          echo "version=$v" >> "$GITHUB_OUTPUT"
      - name: Dispatch to the marketplace
        env:
          GH_TOKEN: ${{ secrets.KANNAKA_CASCADE_PAT }}
        run: |
          if [ -z "$GH_TOKEN" ]; then
            echo "::warning::KANNAKA_CASCADE_PAT not set — cascade is a no-op."
            exit 0
          fi
          gh api --method POST \
            -H "Accept: application/vnd.github+json" \
            /repos/NickFlach/kannaka-constellation-marketplace/dispatches \
            -f event_type=plugin-released \
            -f client_payload[plugin]="<plugin-name>" \
            -f client_payload[version]="${{ steps.v.outputs.version }}"
```

### Triggering it by hand

```bash
gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/NickFlach/kannaka-constellation-marketplace/dispatches \
  -f event_type=plugin-released \
  -f client_payload[plugin]="kannaka-memory" \
  -f client_payload[version]="2.1.1"
```

Or run the receiver directly from the Actions tab
(**Plugin release cascade → Run workflow**) with the plugin name and version.

> Note: PRs opened by the built-in `GITHUB_TOKEN` do not themselves re-trigger
> CI. The bump job runs the validator and README render before committing, so
> the PR is already consistent; review and merge normally.

## Style

The README banner and prose are hand-maintained — only the region between
`<!-- plugins:begin -->` and `<!-- plugins:end -->` is generated. Do not edit
that region by hand; run the render script instead.
