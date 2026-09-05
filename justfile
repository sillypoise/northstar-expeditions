set shell := ["bash", "-euo", "pipefail", "-c"]

# List the supported project commands.
default:
    @just --list

# Install exactly the dependencies recorded in the lockfile.
install:
    pnpm install --frozen-lockfile

# Start the local static-site development server.
develop:
    ASTRO_TELEMETRY_DISABLED=1 pnpm develop

# Create the production static-site build.
build:
    ASTRO_TELEMETRY_DISABLED=1 pnpm build

# Format supported project files.
format:
    pnpm format

# Verify formatting without changing files.
format-check:
    pnpm format:check

# Run type-aware static checks with warnings denied.
lint:
    pnpm lint

# Validate Astro content, components, and strict TypeScript.
typecheck:
    ASTRO_TELEMETRY_DISABLED=1 pnpm typecheck

# Run the bounded unit test suite once.
test:
    pnpm test

# Run one unit test file.
test-one test_file:
    pnpm vitest run --config vitest.config.ts {{ quote(test_file) }}

# Verify the production artifact's routes, bounds, semantics, and script-free baseline.
validate-build: build
    pnpm validate:build

# Serve the production static build for local browser checks.
preview:
    ASTRO_TELEMETRY_DISABLED=1 pnpm exec astro preview --host 127.0.0.1 --port 4322

# Install the locked Chromium browser used by browser tests.
browser-install:
    pnpm exec playwright install chromium

# Exercise the production site in Chromium.
test-browser: validate-build
    pnpm exec playwright test

# Run every required non-mutating check.
check: format-check lint typecheck test test-browser

# Print the active project tool versions.
runtime:
    @echo "Node.js $(node --version)"
    @echo "pnpm $(pnpm --version)"
    @just --version
