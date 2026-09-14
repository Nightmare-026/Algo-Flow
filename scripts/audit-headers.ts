import fs from 'fs';
import path from 'path';

function listAllEmojiHeaders() {
  const dir = 'src/content/learnings';
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/u;

  const results: { file: string; line: number; text: string }[] = [];

  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const fullPath = path.join(dir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (/^#{1,6}\s/.test(line) && emojiRegex.test(line)) {
        results.push({ file: f, line: idx + 1, text: line });
      }
    });
  }

  console.log(`Total emoji headers found: ${results.length}`);
  for (const r of results) {
    console.log(`${r.file}:${r.line} -> ${r.text}`);
  }
}

listAllEmojiHeaders();
