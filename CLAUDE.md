# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Uses **bun** as the package manager (`bun.lock`, `bunfig.toml`).

- `bun install` — install dependencies. `bunfig.toml` enforces a 24h supply-chain guard (`minimumReleaseAge`); confirm with the user before adding a package to `minimumReleaseAgeExcludes`.
- `bun run dev` — start the Vite dev server
- `bun run build` — production build (Nitro, Cloudflare default target)
- `bun run lint` — ESLint
- `bun run format` — Prettier (write mode)

There is no test suite.

## Lovable integration

This project is connected to [Lovable](https://lovable.dev) (see `AGENTS.md`). **Never rewrite published git history** — no force pushes, rebases, amends, or squashes of pushed commits. Pushed commits sync back to the Lovable editor, so keep the branch in a working state.

## What this app is

"Autonomy Blackbox" — a single-page **scripted demo UI** of an autonomous-vehicle debugging workspace (replay a drive, diagnose, trace to code, prepare a Cursor fix, run regression). There is no backend and no real data: all "agent" behavior is simulated with `setTimeout` sequences and hardcoded content.

## Architecture

Stack: TanStack Start (SSR) + TanStack Router (file-based) + React 19 + Tailwind CSS v4 + shadcn/ui + framer-motion + sonner.

- `vite.config.ts` — wraps `@lovable.dev/vite-tanstack-config`, which already bundles tanstackStart, React, Tailwind, tsconfig paths, Nitro, etc. **Do not re-add those plugins manually** — duplicates break the app.
- `src/routes/` — file-based routes; see `src/routes/README.md` for conventions (TanStack, not Next.js — no `src/pages/` or `app/layout.tsx`). `routeTree.gen.ts` is auto-generated; never edit it.
- `src/routes/__root.tsx` — app shell: head/meta, QueryClientProvider, Toaster, 404 and error boundaries. Preserve its `<Outlet />`.
- `src/routes/index.tsx` — the entire demo. Owns all state (nav, diagnosis timers, drawer, regression status) and composes the `src/components/blackbox/` pieces: `TopBar`, `LeftRail`, `PromptBar`, `ReplayCanvas`, `ProgressRail`, `ValidationStrip`, `AgentPanel`, `TechnicalDrawer`.
- `src/lib/blackbox.ts` — shared demo constants: agent step labels, progress steps, metrics, root-cause file/function strings. Change scripted content here, not inline in components.
- `src/server.ts` + `src/start.ts` + `src/lib/error-*.ts` — SSR error-handling wrapper around TanStack Start's server entry (catches errors h3 would swallow and renders a friendly error page). Rarely needs touching.
- `src/components/ui/` — stock shadcn/ui components; import via the `@/` alias.

## Styling

Tailwind v4 CSS-first config lives in `src/styles.css` — there is no `tailwind.config`. Semantic colors are CSS variables defined in `:root`/`.dark` and mapped to utilities in the `@theme inline` block. To add a semantic color, add the variable to both `:root` and `.dark`, then register it as `--color-<name>` in `@theme inline`. Besides the shadcn tokens there are domain tokens: `replay`, `anomaly`, `success` (each with a `-soft` variant) and `surface-muted`.
