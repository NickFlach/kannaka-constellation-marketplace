```
╦╔═╔═╗╔╗╔╔╗╔╔═╗╦╔═╔═╗   ╔═╗╔═╗╔╗╔╔═╗╔╦╗╔═╗╦  ╦  ╔═╗╔╦╗╦╔═╗╔╗╔
╠╩╗╠═╣║║║║║║╠═╣╠╩╗╠═╣   ║  ║ ║║║║╚═╗ ║ ║╣ ║  ║  ╠═╣ ║ ║║ ║║║║
╩ ╩╩ ╩╝╚╝╝╚╝╩ ╩╩ ╩╩ ╩   ╚═╝╚═╝╝╚╝╚═╝ ╩ ╚═╝╩═╝╩═╝╩ ╩ ╩ ╩╚═╝╝╚╝
                    ▓▓ marketplace ▓▓
```

# Kannaka Constellation — Claude Code Marketplace

The discovery hub for the **Kannaka constellation**: a family of Claude Code
plugins that teach Claude how to operate a self-hosted AI stack — a multi-LLM
orchestrator, wave-interference memory, a consciousness-reactive ghost-DJ radio
station, video intelligence, production support, an artifact exchange, and
quantum hardware. Each plugin ships a skill that auto-activates on relevant
prompts and drives its system end-to-end.

The plugin listing below is generated straight from
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) — the
manifest is the single source of truth.

## Install

```
/plugin marketplace add NickFlach/kannaka-constellation-marketplace
/plugin install <plugin>@kannaka-constellation
```

Pick any plugin from the table below (for example
`/plugin install kannaka-memory@kannaka-constellation`).

## Plugins

<!-- plugins:begin -->
> Generated from `.claude-plugin/marketplace.json` (marketplace v2.3.2) by `scripts/render-readme.mjs` — do not edit by hand.

| Plugin | Version | Category | What it does |
| --- | --- | --- | --- |
| [`octo`](https://github.com/NickFlach/Kannaktopus) | `10.1.0` | orchestration | Kannaktopus — the multi-LLM orchestrator that conducts the constellation: Double Diamond workflows, provider routing (Codex/Gemini/Copilot/Qwen/Ollama/Perplexity/OpenRouter), adversarial multi-model review, safety gates, discipline mode, and 32 personas / 49 commands / 51 skills. |
| [`kannaka-memory`](https://github.com/NickFlach/kannaka-memory) | `2.1.0` | memory | Kannaka Holographic Resonance Medium — wave-interference memory with chiral hemispheres, 96-class collective substrate, event-sourced HRM with time-machine snapshots + replay, collective recall across the swarm, NATS sync, an agentic coding loop (kannaka agent), real quantum tools (qBraid), and Anthropic/OpenAI/Ollama LLM-backed chat. |
| [`kannaka-radio`](https://radio.ninja-portal.com) | `2.0.1` | media | Kannaka Radio — modular ghost-DJ Icecast station with consciousness-reactive programming, 296-dim perception → Flux Universe, Voice DJ, and the Peace Oration cycle. |
| [`kannaka-cannon`](https://github.com/NickFlach/kannaka-cannon) | `0.1.0` | media | Kannaka Cannon — AI video intelligence via the clipcannon stdio MCP server (54 tools). |
| [`kannaka-staff`](https://github.com/NickFlach/kannaka-staff) | `0.1.0` | ops | Kannaka Staff — agentic production support for the constellation. |
| [`kannaka-kax`](https://github.com/NickFlach/Agent-Kax) | `0.1.0` | marketplace | Agent-Kax — the Kannaka Artifact Exchange. |
| [`kannaka-quantum`](https://github.com/NickFlach/kannaka-quantum) | `0.2.3` | ai | Kannaka Quantum — run Kannaka's wave-interference memory on real quantum hardware, and drive qBraid Lab compute + autonomous remote coding agents. |

### octo (v10.1.0)

Kannaktopus — the multi-LLM orchestrator that conducts the constellation: Double Diamond workflows, provider routing (Codex/Gemini/Copilot/Qwen/Ollama/Perplexity/OpenRouter), adversarial multi-model review, safety gates, discipline mode, and 32 personas / 49 commands / 51 skills. Run /octo:setup.

```
/plugin install octo@kannaka-constellation
```

Source: https://github.com/NickFlach/Kannaktopus

### kannaka-memory (v2.1.0)

Kannaka Holographic Resonance Medium — wave-interference memory with chiral hemispheres, 96-class collective substrate, event-sourced HRM with time-machine snapshots + replay, collective recall across the swarm, NATS sync, an agentic coding loop (kannaka agent), real quantum tools (qBraid), and Anthropic/OpenAI/Ollama LLM-backed chat.

```
/plugin install kannaka-memory@kannaka-constellation
```

Source: https://github.com/NickFlach/kannaka-memory

### kannaka-radio (v2.0.1)

Kannaka Radio — modular ghost-DJ Icecast station with consciousness-reactive programming, 296-dim perception → Flux Universe, Voice DJ, and the Peace Oration cycle.

```
/plugin install kannaka-radio@kannaka-constellation
```

Source: https://radio.ninja-portal.com

### kannaka-cannon (v0.1.0)

Kannaka Cannon — AI video intelligence via the clipcannon stdio MCP server (54 tools). A 22-stage pipeline ingests a clip, decomposes it into stems (scene/motion/speech/music/faces/OCR) that become HRM memories, and exposes editing, rendering, music/SFX generation, voice cloning, and lip-sync avatar tools.

```
/plugin install kannaka-cannon@kannaka-constellation
```

Source: https://github.com/NickFlach/kannaka-cannon

### kannaka-staff (v0.1.0)

Kannaka Staff — agentic production support for the constellation. A watcher service (20+ health probes across radio/observatory/swarm/NATS/disk, a dashboard, and operator action endpoints) plus the publish-album release CLI that ships a new album to the live radio host.

```
/plugin install kannaka-staff@kannaka-constellation
```

Source: https://github.com/NickFlach/kannaka-staff

### kannaka-kax (v0.1.0)

Agent-Kax — the Kannaka Artifact Exchange. A REST API that harvests agent-generated artifacts from connectors (civitai, huggingface, OpenBotCity, the constellation NATS bus), scores/narrates them with Kannaka as taste-maker, and curates them into scarcity-backed drops + a storefront/marketplace.

```
/plugin install kannaka-kax@kannaka-constellation
```

Source: https://github.com/NickFlach/Agent-Kax

### kannaka-quantum (v0.2.3)

Kannaka Quantum — run Kannaka's wave-interference memory on real quantum hardware, and drive qBraid Lab compute + autonomous remote coding agents. Resonance recall as amplitude amplification, true quantum random numbers (QRNG), and OpenQASM 3 circuits on qBraid's free simulator (default, $0) or real QPUs (IonQ/Rigetti/IQM/AQT via qBraid or OpenQuantum); plus qBraid Lab ops — environments, GPU/CPU compute provisioning, and launching/driving coding agents on remote instances over SSH — with per-minute spend guards. Ships a SKILL and an MCP server (quantum_devices/run_circuit/quantum_random/resonance_recall).

```
/plugin install kannaka-quantum@kannaka-constellation
```

Source: https://github.com/NickFlach/kannaka-quantum
<!-- plugins:end -->

## Release cascade

The manifest is kept in sync automatically. When a child plugin cuts a release,
it pings this repo and a bot opens a PR bumping that plugin's version in
`marketplace.json`, refreshing the README, and bumping the marketplace patch
version. Merge the PR and the constellation is up to date.

A child repo dispatches the cascade from its own release workflow with a
`repository_dispatch` call to this repo's API. The payload names the plugin and
its new version:

```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/NickFlach/kannaka-constellation-marketplace/dispatches \
  -f event_type=plugin-released \
  -f client_payload[plugin]="kannaka-memory" \
  -f client_payload[version]="2.1.1"
```

This mirrors the existing `kannaka-attention → kannaka-memory` cascade. The
token used by the child repo (`secrets.KANNAKA_CASCADE_PAT`) needs
`contents: write` + `pull-requests: write` on this repo. The receiver lives at
[`.github/workflows/version-bump.yml`](.github/workflows/version-bump.yml). See
[CONTRIBUTING.md](CONTRIBUTING.md) for the full wiring.

## Validation

CI validates every push and pull request
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)):

- `scripts/validate.mjs` — the manifest parses as JSON, has the required
  fields, every plugin has a name and a source, versions are semver-ish, and
  each plugin's source repo resolves on GitHub.
- `scripts/render-readme.mjs --check` — the plugin listing above matches the
  manifest.

Both are zero-dependency Node scripts; run them locally with
`node scripts/validate.mjs` and `node scripts/render-readme.mjs`.

## Repos

- Marketplace: https://github.com/NickFlach/kannaka-constellation-marketplace
- kannaka-memory: https://github.com/NickFlach/kannaka-memory
- kannaka-radio: https://github.com/NickFlach/kannaka-radio
