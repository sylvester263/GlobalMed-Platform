import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Whether a file the client supplies later (slider photos, certificates, portraits) is in
 * public/ yet. Callers show a labelled placeholder slot of the same size until it is.
 */
export function publicAssetExists(src: string): boolean {
  return existsSync(join(process.cwd(), "public", src));
}
