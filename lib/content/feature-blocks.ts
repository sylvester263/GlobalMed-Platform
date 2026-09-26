import { features, type FeatureFlag } from "@/config/features";

const block = /<!--\s*feature:(!?)(\w+)\s*-->\n?([\s\S]*?)<!--\s*\/feature\s*-->\n?/g;

/**
 * Markdown blocks that depend on a feature flag (config/features.ts), so hidden features can
 * keep their copy in the file without showing it:
 *
 *   <!-- feature:learningPlatform -->  shown only while the flag is on
 *   <!-- feature:!learningPlatform --> shown only while the flag is off
 *   <!-- /feature -->
 *
 * Unknown flag names are treated as off, so a typo hides text rather than leaking it.
 */
export function applyFeatureBlocks(
  markdown: string,
  flags: Record<string, boolean> = features,
): string {
  return markdown.replace(block, (_match, negate: string, name: string, body: string) => {
    const on = flags[name as FeatureFlag] === true;
    return (negate ? !on : on) ? body : "";
  });
}
