/**
 * Lighthouse on the live site, N runs per page and form factor, median reported
 * (pm/UI_UX_REPORT_2026-09-30.md). Needs Chrome; run with:
 *   node tests/audit/lighthouse-median.mjs <baseUrl> [runs] [mobile,desktop] [paths]
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [base, runsArg = "3", modesArg = "mobile,desktop", pathsArg] = process.argv.slice(2);
const runs = Number(runsArg);
const paths = (pathsArg ?? "/,/about,/education/aapc-certification-pakistan,/education/cpc").split(
  ",",
);
const dir = mkdtempSync(join(tmpdir(), "lh-"));
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

for (const path of paths) {
  for (const mode of modesArg.split(",")) {
    const rows = [];
    for (let i = 0; i < runs; i++) {
      const out = join(dir, `r.json`);
      const args = [
        "-y",
        "lighthouse",
        base + path,
        "--quiet",
        "--chrome-flags=--headless=new",
        "--output=json",
        `--output-path=${out}`,
      ];
      if (mode === "desktop") args.push("--preset=desktop");
      rmSync(out, { force: true });
      try {
        execFileSync("npx", args, { stdio: "ignore", shell: true });
      } catch (error) {
        // On Windows Lighthouse often fails deleting Chrome's temp profile after writing the
        // report; only a missing report is a real failure.
        if (!existsSync(out)) throw error;
      }
      const r = JSON.parse(readFileSync(out, "utf8"));
      const a = r.audits;
      rows.push({
        perf: Math.round(r.categories.performance.score * 100),
        a11y: Math.round(r.categories.accessibility.score * 100),
        bp: Math.round(r.categories["best-practices"].score * 100),
        seo: Math.round(r.categories.seo.score * 100),
        lcp: a["largest-contentful-paint"].numericValue / 1000,
        cls: a["cumulative-layout-shift"].numericValue,
        tbt: a["total-blocking-time"].numericValue,
        fcp: a["first-contentful-paint"].numericValue / 1000,
      });
    }
    const m = (k) => median(rows.map((r) => r[k]));
    process.stdout.write(
      `${path}\t${mode}\tP ${m("perf")} (${rows.map((r) => r.perf).join("/")})\tA ${m("a11y")}\tBP ${m("bp")}\tSEO ${m("seo")}\tFCP ${m("fcp").toFixed(2)}s\tLCP ${m("lcp").toFixed(2)}s\tCLS ${m("cls").toFixed(3)}\tTBT ${Math.round(m("tbt"))}ms\n`,
    );
  }
}
