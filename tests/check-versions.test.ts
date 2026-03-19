import { describe, test, expect } from "bun:test";
import {
  toVersionsJsonFormat,
  isMajorBump,
  loadVersionsJson,
  applyUpdates,
  fetchNpmVersion,
  fetchPypiVersion,
  checkAllVersions,
} from "../scripts/check-versions";

// ============================================================================
// Unit Tests (no network)
// ============================================================================

describe("toVersionsJsonFormat", () => {
  test("major only: '19' -> new major", () => {
    expect(toVersionsJsonFormat("20.1.0", "19")).toBe("20");
  });

  test("major only: same major", () => {
    expect(toVersionsJsonFormat("19.2.0", "19")).toBe("19");
  });

  test("major.x format", () => {
    expect(toVersionsJsonFormat("7.0.1", "6.x")).toBe("7.x");
  });

  test("major.x same major", () => {
    expect(toVersionsJsonFormat("6.3.2", "6.x")).toBe("6.x");
  });

  test("major.x-beta format", () => {
    expect(toVersionsJsonFormat("4.0.0-rc.1", "3.x-beta")).toBe("4.x-rc.1");
  });

  test("major.x-beta -> stable", () => {
    expect(toVersionsJsonFormat("4.0.0", "3.x-beta")).toBe("4.x");
  });

  test("major.minor format", () => {
    expect(toVersionsJsonFormat("2.1.3", "2.0")).toBe("2.1");
  });

  test("full semver with pre-release", () => {
    expect(toVersionsJsonFormat("2.0.0-beta.3", "1.0.0-beta")).toBe("2.0.0-beta.3");
  });

  test("plus suffix format", () => {
    expect(toVersionsJsonFormat("0.115.0", "0.110+")).toBe("0.115+");
  });

  test("'latest' stays as latest", () => {
    expect(toVersionsJsonFormat("1.2.3", "latest")).toBe("latest");
  });

  test("default fallback to major.x", () => {
    expect(toVersionsJsonFormat("3.2.1", "something-weird")).toBe("3.x");
  });
});

describe("isMajorBump", () => {
  test("detects major bump", () => {
    expect(isMajorBump("6.x", "7.0.0")).toBe(true);
  });

  test("same major is not a bump", () => {
    expect(isMajorBump("6.x", "6.3.2")).toBe(false);
  });

  test("major only format", () => {
    expect(isMajorBump("19", "20.0.0")).toBe(true);
  });

  test("zero to one", () => {
    expect(isMajorBump("0.110+", "1.0.0")).toBe(true);
  });
});

describe("loadVersionsJson", () => {
  test("loads real versions.json", () => {
    const json = loadVersionsJson();
    expect(json).toBeDefined();
    expect(json.core).toBeDefined();
    expect((json.core as Record<string, string>).vite).toBeDefined();
  });

  test("throws on missing file", () => {
    expect(() => loadVersionsJson("/nonexistent/versions.json")).toThrow("not found");
  });
});

describe("applyUpdates", () => {
  test("applies updates to matching entries", () => {
    const json = {
      core: { vite: "6.x", react: "19" },
    };
    const entries = [
      {
        category: "core",
        key: "vite",
        currentVersion: "6.x",
        latestVersion: "7.x",
        needsUpdate: true,
      },
      {
        category: "core",
        key: "react",
        currentVersion: "19",
        latestVersion: "19",
        needsUpdate: false,
      },
    ];

    const updated = applyUpdates(json, entries);
    expect((updated.core as Record<string, string>).vite).toBe("7.x");
    expect((updated.core as Record<string, string>).react).toBe("19");
  });

  test("does not mutate original", () => {
    const json = { core: { vite: "6.x" } };
    const entries = [
      {
        category: "core",
        key: "vite",
        currentVersion: "6.x",
        latestVersion: "7.x",
        needsUpdate: true,
      },
    ];

    applyUpdates(json, entries);
    expect((json.core as Record<string, string>).vite).toBe("6.x");
  });

  test("skips entries with errors", () => {
    const json = { core: { vite: "6.x" } };
    const entries = [
      {
        category: "core",
        key: "vite",
        currentVersion: "6.x",
        latestVersion: null,
        needsUpdate: false,
        error: "fetch failed",
      },
    ];

    const updated = applyUpdates(json, entries);
    expect((updated.core as Record<string, string>).vite).toBe("6.x");
  });
});

// ============================================================================
// Integration Tests (network required)
// ============================================================================

const describeNetwork = process.env.RUN_NETWORK_TESTS === "1" ? describe : describe.skip;

describeNetwork("npm registry", () => {
  test("fetches vite latest version", async () => {
    const version = await fetchNpmVersion("vite");
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  test("fetches react latest version", async () => {
    const version = await fetchNpmVersion("react");
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  test("throws on non-existent package", async () => {
    await expect(
      fetchNpmVersion("this-package-definitely-does-not-exist-xyz-123")
    ).rejects.toThrow();
  });
});

describeNetwork("pypi registry", () => {
  test("fetches fastapi latest version", async () => {
    const version = await fetchPypiVersion("fastapi");
    expect(version).toMatch(/^\d+\.\d+/);
  });

  test("throws on non-existent package", async () => {
    await expect(
      fetchPypiVersion("this-package-definitely-does-not-exist-xyz-123")
    ).rejects.toThrow();
  });
});

describeNetwork("checkAllVersions", () => {
  test("checks core category only", async () => {
    const json = loadVersionsJson();
    const results = await checkAllVersions(json, { category: "core" });

    expect(results.length).toBeGreaterThan(0);
    for (const entry of results) {
      expect(entry.category).toBe("core");
      expect(entry.latestVersion).not.toBeNull();
    }
  }, 30_000);
});
