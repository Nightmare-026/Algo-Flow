import { algorithms } from "./src/data/seed/algorithms";

let missing = 0;
let total = 0;

for (const algo of algorithms) {
  if (algo.isPublished) {
    total++;
    if (!algo.pseudocode) {
      console.log(`[Missing Pseudocode] ${algo.slug} (${algo.name})`);
      missing++;
    }
  }
}

console.log(`Total: ${total}, Missing Pseudocode: ${missing}`);
