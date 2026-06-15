// @vitest-environment node

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const sourceRoot = path.resolve("src");
const protectedRoots = [
  path.join(sourceRoot, "generated", "server"),
  path.join(sourceRoot, "lib", "database"),
  path.join(sourceRoot, "modules", "identity", "repositories"),
];

async function listTypeScriptFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listTypeScriptFiles(entryPath);
      }

      return /\.[cm]?[jt]sx?$/.test(entry.name) ? [entryPath] : [];
    }),
  );

  return files.flat();
}

function resolveSourceImport(importer: string, specifier: string) {
  const basePath = specifier.startsWith("@/")
    ? path.join(sourceRoot, specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(importer), specifier)
      : undefined;

  if (!basePath) {
    return undefined;
  }

  return [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.mts`,
    `${basePath}.cts`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];
}

async function sourceImports(filePath: string) {
  const source = await readFile(filePath, "utf8");
  const parsed = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const specifiers: string[] = [];

  for (const statement of parsed.statements) {
    if (
      (ts.isImportDeclaration(statement) ||
        ts.isExportDeclaration(statement)) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      specifiers.push(statement.moduleSpecifier.text);
    }
  }

  return { source, specifiers };
}

describe("database import boundary", () => {
  it("marks database and repository modules as server-only", async () => {
    const expectedModules = [
      path.join(sourceRoot, "lib", "database", "client.ts"),
      path.join(
        sourceRoot,
        "modules",
        "identity",
        "repositories",
        "user-repository.ts",
      ),
      path.join(
        sourceRoot,
        "modules",
        "identity",
        "repositories",
        "learner-profile-repository.ts",
      ),
    ];

    for (const modulePath of expectedModules) {
      const source = await readFile(modulePath, "utf8");
      expect(source).toMatch(/^import "server-only";/);
    }
  });

  it("keeps protected database modules out of every Client Component graph", async () => {
    const files = await listTypeScriptFiles(sourceRoot);
    const clientEntries: string[] = [];

    for (const filePath of files) {
      const { source } = await sourceImports(filePath);
      const parsed = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.Latest,
        true,
      );
      const firstStatement = parsed.statements[0];

      if (
        firstStatement &&
        ts.isExpressionStatement(firstStatement) &&
        ts.isStringLiteral(firstStatement.expression) &&
        firstStatement.expression.text === "use client"
      ) {
        clientEntries.push(filePath);
      }
    }

    const visited = new Set<string>();
    const pending = [...clientEntries];

    while (pending.length > 0) {
      const current = pending.pop()!;

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);
      expect(
        protectedRoots.some((root) => current.startsWith(root)),
        `${path.relative(sourceRoot, current)} is reachable from a Client Component`,
      ).toBe(false);

      const { specifiers } = await sourceImports(current);

      for (const specifier of specifiers) {
        const candidates = resolveSourceImport(current, specifier);

        if (!candidates) {
          continue;
        }

        const resolved = candidates.find((candidate) =>
          files.includes(candidate),
        );

        if (resolved) {
          pending.push(resolved);
        }
      }
    }
  });
});
