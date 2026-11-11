/**
 * i18n parity guard: en.json and sq.json must expose identical key trees.
 * Runs in Node context (not the browser). Fails the suite on any drift,
 * so a catalog edit that only translated one language cannot slip through.
 */
import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

function flatten(obj: unknown, prefix = ""): string[] {
  if (obj == null || typeof obj !== "object") return [prefix];
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) => flatten(v, `${prefix}${i}.`));
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatten(v, `${prefix}${k}.`),
  );
}

test("en/sq catalogs have identical key trees", () => {
  const root = process.cwd();
  const en = JSON.parse(
    readFileSync(join(root, "src/messages/en.json"), "utf8"),
  ) as Record<string, unknown>;
  const sq = JSON.parse(
    readFileSync(join(root, "src/messages/sq.json"), "utf8"),
  ) as Record<string, unknown>;

  const enKeys = flatten(en)
    .map((k) => k.replace(/\.$/, ""))
    .sort();
  const sqKeys = flatten(sq)
    .map((k) => k.replace(/\.$/, ""))
    .sort();

  const missingInSq = enKeys.filter((k) => !sqKeys.includes(k));
  const missingInEn = sqKeys.filter((k) => !enKeys.includes(k));

  expect(
    missingInSq,
    `keys missing in sq.json: ${missingInSq.join(", ")}`,
  ).toEqual([]);
  expect(
    missingInEn,
    `keys missing in en.json: ${missingInEn.join(", ")}`,
  ).toEqual([]);
  expect(enKeys.length).toBeGreaterThan(250);
});

test("no catalog value is an empty string", () => {
  const root = process.cwd();
  for (const file of ["en.json", "sq.json"]) {
    const raw = readFileSync(join(root, "src/messages", file), "utf8");
    const check = (obj: unknown, path: string[] = []) => {
      if (typeof obj === "string" && obj.trim() === "") {
        throw new Error(`${file}: empty value at ${path.join(".")}`);
      }
      if (obj && typeof obj === "object") {
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
          check(v, [...path, k]);
        }
      }
    };
    check(JSON.parse(raw));
  }
});
