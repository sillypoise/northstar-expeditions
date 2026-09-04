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

# Run every required non-mutating check.
check: format-check lint typecheck test validate-build

# Print the active project tool versions.
runtime:
    @echo "Node.js $(node --version)"
    @echo "pnpm $(pnpm --version)"
    @just --version
