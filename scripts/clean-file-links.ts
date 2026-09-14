import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src", "content", "learnings");

function cleanDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      cleanDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes("file:///")) {
        console.log(`Cleaning file:/// links in: ${path.relative(process.cwd(), fullPath)}`);
        // Remove markdown link lines that contain file:///
        const lines = content.split("\n");
        const filteredLines = lines.filter(line => !line.includes("file:///"));
        // Remove trailing empty lines or trailing horizontal rules left at the bottom
        let cleaned = filteredLines.join("\n").trimEnd() + "\n";
        cleaned = cleaned.replace(/---\s*$/, "").trimEnd() + "\n";
        fs.writeFileSync(fullPath, cleaned, "utf-8");
      }
    }
  }
}

cleanDir(contentDir);
console.log("Done cleaning file:/// links!");
