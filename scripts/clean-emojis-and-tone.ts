import fs from 'fs';
import path from 'path';

const dir = 'src/content/learnings';

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]/gu;

function cleanHeaderLine(line: string): string {
  const match = line.match(/^(#{1,6}\s+)(.*)$/);
  if (!match) return line;

  const prefix = match[1];
  let text = match[2];

  // Remove emojis from header
  text = text.replace(emojiRegex, '').trim();

  // Normalize all-caps labels
  if (/^CONCEPT(\s*&.*)?$/i.test(text)) {
    text = text.replace(/^CONCEPT/i, 'Concept');
    text = text.replace(/FORMAL DEFINITION/i, 'Formal Definition');
  } else if (/^INTUITION(:.*)?$/i.test(text)) {
    text = text.replace(/^INTUITION/i, 'Intuition');
  } else if (/^THE THEOREM/i.test(text)) {
    text = text.replace(/^THE THEOREM/i, 'Theorem');
  } else if (/^THE SOLUTION/i.test(text)) {
    text = text.replace(/^THE SOLUTION/i, 'Solution');
  } else if (/^THE HARDWARE PROBLEM/i.test(text)) {
    text = text.replace(/^THE HARDWARE PROBLEM/i, 'Hardware Performance Bottleneck');
  }

  // Tone cleanup in headers
  text = text.replace(/The Achilles Heel:\s*/gi, 'Primary Clustering: ');
  text = text.replace(/The Achilles Heel/gi, 'Vulnerability');
  text = text.replace(/Achilles Heel of\s*/gi, 'Degradation of ');
  text = text.replace(/The Inviolable Precondition:\s*/gi, 'Required Precondition: ');
  text = text.replace(/Inviolable (Rules?|Invariants?|Preconditions?)/gi, (m, g1) => {
    return `Structural ${g1}`;
  });
  text = text.replace(/The (\d+) Inviolable/gi, 'The $1 Structural');
  text = text.replace(/The Magic of `i & \(-i\)`/gi, 'Low-Bit Isolation (`i & (-i)`)');

  return `${prefix}${text}`.trimEnd();
}

function cleanBodyTone(content: string): string {
  let res = content;

  // Replace tone phrases in body text
  res = res.replace(/Achilles Heel of standard BSTs/gi, 'worst-case $\\Theta(n)$ degradation of standard BSTs');
  res = res.replace(/The Achilles Heel: Primary Clustering/gi, 'Primary Clustering Degradation');
  res = res.replace(/Inviolable BST Invariant/gi, 'BST Structural Invariant');
  res = res.replace(/Inviolable Precondition/gi, 'Structural Precondition');
  res = res.replace(/Inviolable Rule/gi, 'Structural Rule');
  res = res.replace(/The 5 Inviolable RBT Invariants/gi, 'The 5 Structural Red-Black Tree Properties');
  res = res.replace(/DEFINITION & THE 5 INVIOLABLE INVARIANTS/gi, 'DEFINITION & THE 5 RED-BLACK TREE PROPERTIES');

  return res;
}

function applyClean() {
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  let modifiedCount = 0;

  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const fullPath = path.join(dir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');

    let fileChanged = false;
    const newLines = lines.map((line) => {
      if (/^#{1,6}\s/.test(line)) {
        const cleaned = cleanHeaderLine(line);
        if (cleaned !== line) {
          fileChanged = true;
          return cleaned;
        }
      }
      return line;
    });

    let newContent = newLines.join('\n');
    const bodyCleaned = cleanBodyTone(newContent);
    if (bodyCleaned !== newContent) {
      fileChanged = true;
      newContent = bodyCleaned;
    }

    if (fileChanged) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      modifiedCount++;
      console.log(`Updated: ${f}`);
    }
  }

  console.log(`\nSuccessfully updated ${modifiedCount} files.`);
}

applyClean();
