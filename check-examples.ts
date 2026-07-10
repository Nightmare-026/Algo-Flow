import * as fs from 'fs';
import * as path from 'path';
import { algorithms } from './src/data/seed/algorithms.js'; // Assuming TS compiles or we run with tsx

const missing = [];
const featuresDir = './src/features/algorithms';

for (const alg of algorithms) {
  const dirMap: Record<string, string> = {
    'ds_array': 'array',
    'ds_stack': 'stack',
    'ds_queue': 'queue',
    'ds_linked_list': 'linked-list',
    'ds_tree': 'tree',
    'ds_graph': 'graph',
    'ds_hash_table': 'hash-table',
    'ds_hash_set': 'hash-set',
    'ds_matrix': 'matrix',
    'ds_string': 'string'
  };
  
  const dsDir = dirMap[alg.dataStructureId];
  if (!dsDir) {
    missing.push({ slug: alg.slug, error: 'No mapped directory' });
    continue;
  }
  
  const codeExamplesPath = path.join(featuresDir, dsDir, 'code-examples.ts');
  if (!fs.existsSync(codeExamplesPath)) {
    missing.push({ slug: alg.slug, ds: alg.dataStructureId, error: 'No code-examples.ts' });
    continue;
  }
  
  const content = fs.readFileSync(codeExamplesPath, 'utf8');
  if (!content.includes('"' + alg.slug + '"') && !content.includes("'" + alg.slug + "'")) {
    missing.push({ slug: alg.slug, ds: alg.dataStructureId, error: 'Missing case in switch' });
  }
}

console.log(JSON.stringify(missing, null, 2));
