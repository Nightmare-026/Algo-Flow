import fs from "fs";
import path from "path";
import { LEARNING_MODULES } from "../src/lib/learnings/registry";

function generateManifest() {
  const lines: string[] = [];
  let totalChapters = 0;

  for (const mod of LEARNING_MODULES) {
    const partNumberStr = mod.partNumber.toString().padStart(2, "0");
    lines.push(`## Part ${partNumberStr} — ${mod.title}`);
    for (const ch of mod.chapters) {
      lines.push(`- [ ] ${mod.slug}/${ch.slug} — status: not-started`);
      totalChapters++;
    }
  }

  const content = lines.join("\n") + "\n";
  const manifestPath = path.join(process.cwd(), "REMEDIATION_MANIFEST.md");
  fs.writeFileSync(manifestPath, content, "utf-8");
  console.log(`Successfully generated REMEDIATION_MANIFEST.md with ${totalChapters} chapters across ${LEARNING_MODULES.length} parts.`);
}

generateManifest();
