import fs from 'fs';
import path from 'path';
import { LEARNING_MODULES } from '../src/lib/learnings/registry';

const REFERENCES_BY_PART: Record<string, string[]> = {
  'Part-00-Front-Matter': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 1–3. MIT Press.',
    '2. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley.',
    '3. **IEEE / ACM Computing Curricula Guidelines** (2020). Curriculum Guidelines for Undergraduate Degree Programs in Computer Science.',
  ],
  'Part-01-Foundations': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 3: Characterizing Running Times. MIT Press.',
    '2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.4: Analysis of Algorithms. Addison-Wesley.',
    '3. **Sipser, M.** (2012). *Introduction to the Theory of Computation* (3rd ed.). Cengage Learning.',
  ],
  'Part-02-Linear-Data-Structures': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: Elementary Data Structures. MIT Press.',
    '2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: Bags, Queues, and Stacks. Addison-Wesley.',
    '3. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: Linear Lists. Addison-Wesley.',
  ],
  'Part-03-Hashing': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 11: Hash Tables. MIT Press.',
    '2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.4: Hashing. Addison-Wesley.',
    '3. **Mitzenmacher, M., & Upfal, E.** (2017). *Probability and Computing: Randomization and Probabilistic Techniques in Algorithms* (2nd ed.). Cambridge University Press.',
  ],
  'Part-04-Searching': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Section 2.3 & Chapter 12. MIT Press.',
    '2. **Bentley, J.** (2000). *Programming Pearls* (2nd ed.), Column 4: Writing Correct Programs. Addison-Wesley.',
    '3. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.2: Searching by Comparison of Keys. Addison-Wesley.',
  ],
  'Part-05-Sorting': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 6–8 (Heapsort, Quicksort, Linear-Time Sorting). MIT Press.',
    '2. **Hoare, C. A. R.** (1962). Quicksort. *The Computer Journal*, 5(1), 10–16.',
    '3. **Sedgewick, R.** (1978). Implementing Quicksort programs. *Communications of the ACM*, 21(10), 847–857.',
  ],
  'Part-06-Trees': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.',
    '2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.',
    '3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.',
  ],
  'Part-07-Graphs': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 20–23 (Graph Algorithms, Minimum Spanning Trees, Shortest Paths). MIT Press.',
    '2. **Dijkstra, E. W.** (1959). A note on two problems in connexion with graphs. *Numerische Mathematik*, 1(1), 269–271.',
    '3. **Tarjan, R. E.** (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing*, 1(2), 146–160.',
  ],
  'Part-08-Algorithm-Design-Techniques': [
    '1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 4, 14, 15, & 16. MIT Press.',
    '2. **Kleinberg, J., & Tardos, É.** (2006). *Algorithm Design*. Pearson / Addison-Wesley.',
    '3. **Bellman, R.** (1957). *Dynamic Programming*. Princeton University Press.',
  ],
  'Part-09-Problem-Solving-Patterns': [
    '1. **Halim, S., Halim, F., & Skiena, S. S.** (2020). *Competitive Programming 4: The Lower Bound of Programming Contests*. CP4 Pte Ltd.',
    '2. **Laaksonen, A.** (2020). *Guide to Competitive Programming: Learning and Improving Algorithms Through Contests* (2nd ed.). Springer.',
    '3. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.',
  ],
  'Part-10-Advanced-DSA': [
    '1. **Fenwick, P. M.** (1994). A new data structure for cumulative frequency tables. *Software: Practice and Experience*, 24(3), 327–336.',
    '2. **Sleator, D. D., & Tarjan, R. E.** (1983). A data structure for dynamic trees. *Journal of Computer and System Sciences*, 26(3), 362–391.',
    '3. **Tarjan, R. E.** (1979). Applications of path compression on balanced trees. *Journal of the ACM (JACM)*, 26(4), 690–715.',
  ],
  'Part-11-Problem-Bank-and-Revision': [
    '1. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.',
    '2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.',
    '3. **USA Computing Olympiad (USACO)** & **CP-Algorithms Archives** (2024). Curated Competitive Programming and Algorithm Verification Standards.',
  ],
};

function addReferences() {
  let updatedCount = 0;

  for (const mod of LEARNING_MODULES) {
    for (const ch of mod.chapters) {
      const fullPath = path.join(
        'src/content/learnings',
        ch.folderName,
        ch.fileName
      );
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      if (/## References & Academic Attribution|## References|## Further Reading/i.test(content)) {
        continue;
      }

      const refs = REFERENCES_BY_PART[ch.folderName] || REFERENCES_BY_PART['Part-01-Foundations'];
      const section = `\n\n---\n\n## References & Academic Attribution\n\n${refs.join('\n')}\n`;

      const newContent = content.trimEnd() + section;
      fs.writeFileSync(fullPath, newContent, 'utf8');
      updatedCount++;
      console.log(`Added references to: ${ch.folderName}/${ch.fileName}`);
    }
  }

  console.log(`\nSuccessfully added references to ${updatedCount} chapters.`);
}

addReferences();
