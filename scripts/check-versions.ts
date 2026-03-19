#!/usr/bin/env bun
/**
 * Version Checker Script
 *
 * Queries npm registry (and PyPI for Python packages) to find the latest
 * stable versions for all packages in assets/versions.json.
 *
 * Usage:
 *   bun scripts/check-versions.ts              # Show comparison table
 *   bun scripts/check-versions.ts --update      # Update versions.json in place
 *   bun scripts/check-versions.ts --json        # Output as JSON
 *   bun scripts/check-versions.ts --category core  # Check only a specific category
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ============================================================================
// Types
// ============================================================================

export interface VersionEntry {
  category: string;
  key: string;
  currentVersion: string;
  latestVersion: string | null;
  needsUpdate: boolean;
  error?: string;
}

export interface VersionsJson {
  [category: string]: Record<string, string> | string;
}

export interface NpmRegistryResponse {
  "dist-tags"?: { latest?: string };
  versions?: Record<string, unknown>;
}

export interface PypiResponse {
  info?: { version?: string };
}

// ============================================================================
// Constants
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const VERSIONS_FILE = join(__dirname, "..", "assets", "versions.json");

const NPM_REGISTRY = "https://registry.npmjs.org";
const PYPI_API = "https://pypi.org/pypi";

/**
 * Maps versions.json keys to their actual npm/pypi package names.
 * Keys not listed here use the key as-is or with @scope prefix.
 */
const PACKAGE_NAME_MAP: Record<string, { name: string; registry: "npm" | "pypi" }> = {
  // Core
  vite: { name: "vite", registry: "npm" },
  react: { name: "react", registry: "npm" },
  typescript: { name: "typescript", registry: "npm" },
  bun: { name: "bun", registry: "npm" },

  // Routing
  "tanstack-router": { name: "@tanstack/react-router", registry: "npm" },
  "tanstack-query": { name: "@tanstack/react-query", registry: "npm" },
  remix: { name: "@remix-run/react", registry: "npm" },
  "expo-router": { name: "expo-router", registry: "npm" },

  // UI
  "shadcn-ui": { name: "shadcn", registry: "npm" },
  "ant-design": { name: "antd", registry: "npm" },
  "ant-design-x": { name: "@ant-design/x", registry: "npm" },
  "ant-design-pro": { name: "@ant-design/pro-components", registry: "npm" },
  tailwindcss: { name: "tailwindcss", registry: "npm" },
  nativewind: { name: "nativewind", registry: "npm" },
  "heroui-native": { name: "@heroui/react-native", registry: "npm" },
  heroui: { name: "@heroui/react", registry: "npm" },

  // State
  zustand: { name: "zustand", registry: "npm" },
  jotai: { name: "jotai", registry: "npm" },

  // Backend
  hono: { name: "hono", registry: "npm" },
  fastapi: { name: "fastapi", registry: "pypi" },
  sqlalchemy: { name: "sqlalchemy", registry: "pypi" },

  // Mobile
  "react-native": { name: "react-native", registry: "npm" },
  expo: { name: "expo", registry: "npm" },

  // Frameworks
  umijs: { name: "umi", registry: "npm" },
  astro: { name: "astro", registry: "npm" },
  turborepo: { name: "turbo", registry: "npm" },

  // Web3
  wagmi: { name: "wagmi", registry: "npm" },
  viem: { name: "viem", registry: "npm" },
  connectkit: { name: "connectkit", registry: "npm" },
  hardhat: { name: "hardhat", registry: "npm" },
  openzeppelin: { name: "@openzeppelin/contracts", registry: "npm" },

  // Astro UI
  "starwind-ui": { name: "@starwind-ui/cli", registry: "npm" },

  // Enhancement
  shikijs: { name: "shiki", registry: "npm" },
  "dnd-kit": { name: "@dnd-kit/core", registry: "npm" },
  "framer-motion": { name: "framer-motion", registry: "npm" },
  lexical: { name: "lexical", registry: "npm" },
  d3: { name: "d3", registry: "npm" },

  // Tools
  biome: { name: "@biomejs/biome", registry: "npm" },
  vitest: { name: "vitest", registry: "npm" },
  playwright: { name: "@playwright/test", registry: "npm" },
};

// ============================================================================
// Registry Queries
// ============================================================================

/**
 * Fetch latest stable version from npm registry.
 */
export async function fetchNpmVersion(packageName: string): Promise<string> {
  const url = `${NPM_REGISTRY}/${encodeURIComponent(packageName)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`npm registry returned ${response.status} for ${packageName}`);
  }

  const data = (await response.json()) as NpmRegistryResponse;
  const latest = data?.["dist-tags"]?.latest;

  if (!latest) {
    throw new Error(`No latest dist-tag found for ${packageName}`);
  }

  return latest;
}

/**
 * Fetch latest stable version from PyPI.
 */
export async function fetchPypiVersion(packageName: string): Promise<string> {
  const url = `${PYPI_API}/${encodeURIComponent(packageName)}/json`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`PyPI returned ${response.status} for ${packageName}`);
  }

  const data = (await response.json()) as PypiResponse;
  const version = data?.info?.version;

  if (!version) {
    throw new Error(`No version found for ${packageName} on PyPI`);
  }

  return version;
}

/**
 * Fetch latest version for a package key.
 */
export async function fetchLatestVersion(key: string): Promise<string> {
  const mapping = PACKAGE_NAME_MAP[key];

  if (!mapping) {
    throw new Error(`No package mapping found for "${key}". Add it to PACKAGE_NAME_MAP.`);
  }

  if (mapping.registry === "pypi") {
    return fetchPypiVersion(mapping.name);
  }

  return fetchNpmVersion(mapping.name);
}

// ============================================================================
// Version Comparison
// ============================================================================

/**
 * Convert a full semver (e.g., "6.3.2") to the format used in versions.json (e.g., "6.x").
 * Preserves the style of the current version string.
 */
export function toVersionsJsonFormat(fullVersion: string, currentFormat: string): string {
  const parts = fullVersion.split(/[.-]/);
  const major = parts[0];
  const minor = parts[1];

  // "latest" -> keep as latest
  if (currentFormat === "latest") return "latest";

  // "19" (major only) -> major only
  if (/^\d+$/.test(currentFormat)) return major;

  // "6.x" -> major.x
  if (/^\d+\.x$/.test(currentFormat)) return `${major}.x`;

  // "3.x-beta" -> major.x-suffix (keep suffix from latest if pre-release)
  if (/^\d+\.x-/.test(currentFormat)) {
    const preRelease = fullVersion.includes("-") ? fullVersion.split("-").slice(1).join("-") : null;
    return preRelease ? `${major}.x-${preRelease}` : `${major}.x`;
  }

  // "2.0" -> major.minor
  if (/^\d+\.\d+$/.test(currentFormat)) return `${major}.${minor}`;

  // "1.0.0-beta" -> full version with pre-release
  if (/^\d+\.\d+\.\d+-/.test(currentFormat)) return fullVersion;

  // "0.110+" -> major.minor+
  if (/^\d+\.\d+\+$/.test(currentFormat)) return `${major}.${minor}+`;

  // "0.84+" -> major.minor+
  if (/\+$/.test(currentFormat)) return `${major}.${minor}+`;

  // Default: major.x
  return `${major}.x`;
}

/**
 * Check if the latest version represents a major version bump compared to current.
 */
export function isMajorBump(currentFormat: string, latestFull: string): boolean {
  const currentMajor = parseInt(currentFormat.match(/^(\d+)/)?.[1] ?? "0", 10);
  const latestMajor = parseInt(latestFull.match(/^(\d+)/)?.[1] ?? "0", 10);
  return latestMajor > currentMajor;
}

// ============================================================================
// Core Logic
// ============================================================================

/**
 * Load and parse versions.json.
 */
export function loadVersionsJson(path: string = VERSIONS_FILE): VersionsJson {
  if (!existsSync(path)) {
    throw new Error(`versions.json not found at ${path}`);
  }
  return JSON.parse(readFileSync(path, "utf-8")) as VersionsJson;
}

/**
 * Check all versions against registries.
 */
export async function checkAllVersions(
  versionsJson: VersionsJson,
  options: { category?: string; concurrency?: number } = {}
): Promise<VersionEntry[]> {
  const { category: filterCategory, concurrency = 6 } = options;
  const entries: { category: string; key: string; currentVersion: string }[] = [];

  for (const [category, items] of Object.entries(versionsJson)) {
    if (category.startsWith("$")) continue;
    if (typeof items !== "object" || items === null) continue;
    if (filterCategory && category !== filterCategory) continue;

    for (const [key, value] of Object.entries(items as Record<string, string>)) {
      entries.push({ category, key, currentVersion: value });
    }
  }

  // Fetch in batches to respect rate limits
  const results: VersionEntry[] = [];

  for (let i = 0; i < entries.length; i += concurrency) {
    const batch = entries.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (entry): Promise<VersionEntry> => {
        try {
          const latestFull = await fetchLatestVersion(entry.key);
          const latestFormatted = toVersionsJsonFormat(latestFull, entry.currentVersion);
          const needsUpdate = latestFormatted !== entry.currentVersion;

          return {
            ...entry,
            latestVersion: latestFormatted,
            needsUpdate,
          };
        } catch (error) {
          return {
            ...entry,
            latestVersion: null,
            needsUpdate: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );

    results.push(...batchResults);
  }

  return results;
}

/**
 * Apply version updates to versions.json object.
 */
export function applyUpdates(
  versionsJson: VersionsJson,
  entries: VersionEntry[]
): VersionsJson {
  const updated = JSON.parse(JSON.stringify(versionsJson)) as VersionsJson;

  for (const entry of entries) {
    if (!entry.needsUpdate || !entry.latestVersion) continue;

    const category = updated[entry.category];
    if (typeof category === "object" && category !== null) {
      (category as Record<string, string>)[entry.key] = entry.latestVersion;
    }
  }

  return updated;
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatTable(entries: VersionEntry[]): string {
  const lines: string[] = [];

  lines.push("");
  lines.push("  Package                    Current       Latest        Status");
  lines.push("  ─────────────────────────  ────────────  ────────────  ──────");

  let currentCategory = "";

  for (const entry of entries) {
    if (entry.category !== currentCategory) {
      currentCategory = entry.category;
      lines.push(`  [${currentCategory}]`);
    }

    const pkg = entry.key.padEnd(27);
    const current = entry.currentVersion.padEnd(14);
    const latest = (entry.latestVersion ?? "???").padEnd(14);

    let status: string;
    if (entry.error) {
      status = `\x1b[33mERROR\x1b[0m`;
    } else if (!entry.needsUpdate) {
      status = `\x1b[32mOK\x1b[0m`;
    } else if (entry.latestVersion && isMajorBump(entry.currentVersion, entry.latestVersion)) {
      status = `\x1b[31mMAJOR\x1b[0m`;
    } else {
      status = `\x1b[33mUPDATE\x1b[0m`;
    }

    lines.push(`  ${pkg}${current}${latest}${status}`);
  }

  const updateCount = entries.filter((e) => e.needsUpdate).length;
  const errorCount = entries.filter((e) => e.error).length;

  lines.push("");
  lines.push(
    `  Total: ${entries.length} packages, ${updateCount} updates available, ${errorCount} errors`
  );
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// CLI
// ============================================================================

function printHelp() {
  console.log(`
Version Checker - Check and update package versions in versions.json

Usage:
  bun scripts/check-versions.ts [options]

Options:
  --help              Show this help message
  --update            Update versions.json with latest versions
  --json              Output results as JSON
  --category <name>   Only check a specific category (e.g., core, ui, web3)
  --dry-run           Show what would be updated (default without --update)

Examples:
  bun scripts/check-versions.ts                    # Show comparison table
  bun scripts/check-versions.ts --update           # Update versions.json
  bun scripts/check-versions.ts --category core    # Check only core packages
  bun scripts/check-versions.ts --json             # Output as JSON
`);
}

interface CliArgs {
  help: boolean;
  update: boolean;
  json: boolean;
  category?: string;
}

function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {
    help: false,
    update: false,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--help":
      case "-h":
        result.help = true;
        break;
      case "--update":
        result.update = true;
        break;
      case "--json":
        result.json = true;
        break;
      case "--category":
        result.category = args[++i];
        break;
    }
  }

  return result;
}

if (import.meta.main) {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  console.log("\x1b[34m=== Version Checker ===\x1b[0m\n");
  console.log("Fetching latest versions from registries...\n");

  try {
    const versionsJson = loadVersionsJson();
    const entries = await checkAllVersions(versionsJson, { category: args.category });

    if (args.json) {
      console.log(JSON.stringify(entries, null, 2));
    } else {
      console.log(formatTable(entries));
    }

    const updatable = entries.filter((e) => e.needsUpdate);

    if (updatable.length === 0) {
      console.log("\x1b[32mAll versions are up to date!\x1b[0m\n");
    } else if (args.update) {
      const updated = applyUpdates(versionsJson, entries);
      writeFileSync(VERSIONS_FILE, JSON.stringify(updated, null, 2) + "\n", "utf-8");
      console.log(
        `\x1b[32mUpdated ${updatable.length} versions in versions.json\x1b[0m\n`
      );
    } else {
      console.log(
        `Run with \x1b[33m--update\x1b[0m to apply ${updatable.length} updates.\n`
      );
    }
  } catch (error) {
    console.error(
      "\x1b[31mError:\x1b[0m",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}