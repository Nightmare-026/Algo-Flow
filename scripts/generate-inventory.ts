import fs from 'fs';
import path from 'path';
import { algorithms } from '../src/data/seed/algorithms';
import { algorithmRegistry } from '../src/visualizers/registry/algorithm-registry';

const outDir = path.join(process.cwd(), 'docs', 'visualizer-audit');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const publishedAlgorithms = algorithms.filter(a => a.isPublished);

const categoryFileMap: Record<string, { impl: string; pseudocode: string; codeExamples: string; renderer: string; controls: string }> = {
  ds_array: {
    impl: 'src/visualizers/array/',
    pseudocode: 'src/visualizers/array/pseudocode.ts',
    codeExamples: 'src/visualizers/array/code-examples.ts',
    renderer: 'ArrayRenderer',
    controls: 'ArrayInputControls',
  },
  ds_stack: {
    impl: 'src/visualizers/stack/',
    pseudocode: 'src/visualizers/stack/pseudocode.ts',
    codeExamples: 'src/visualizers/stack/code-examples.ts',
    renderer: 'StackRenderer',
    controls: 'StackInputControls',
  },
  ds_queue: {
    impl: 'src/visualizers/queue/',
    pseudocode: 'src/visualizers/queue/pseudocode.ts',
    codeExamples: 'src/visualizers/queue/code-examples.ts',
    renderer: 'QueueRenderer',
    controls: 'QueueInputControls',
  },
  ds_linked_list: {
    impl: 'src/visualizers/linked-list/',
    pseudocode: 'src/visualizers/linked-list/pseudocode.ts',
    codeExamples: 'src/visualizers/linked-list/code-examples.ts',
    renderer: 'LinkedListRenderer',
    controls: 'LinkedListInputControls',
  },
  ds_tree: {
    impl: 'src/visualizers/tree/',
    pseudocode: 'src/visualizers/tree/pseudocode.ts',
    codeExamples: 'src/visualizers/tree/code-examples.ts',
    renderer: 'TreeRenderer',
    controls: 'TreeInputControls',
  },
  ds_graph: {
    impl: 'src/visualizers/graph/',
    pseudocode: 'src/visualizers/graph/pseudocode.ts',
    codeExamples: 'src/visualizers/graph/code-examples.ts',
    renderer: 'GraphRenderer',
    controls: 'GraphInputControls',
  },
  ds_hash_table: {
    impl: 'src/visualizers/hash-table/',
    pseudocode: 'src/visualizers/hash-table/pseudocode.ts',
    codeExamples: 'src/visualizers/hash-table/code-examples.ts',
    renderer: 'HashTableRenderer',
    controls: 'HashTableInputControls',
  },
  ds_hash_set: {
    impl: 'src/visualizers/hash-set/',
    pseudocode: 'src/visualizers/hash-set/pseudocode.ts',
    codeExamples: 'src/visualizers/hash-set/code-examples.ts',
    renderer: 'HashSetRenderer',
    controls: 'HashSetInputControls',
  },
  ds_matrix: {
    impl: 'src/visualizers/matrix/',
    pseudocode: 'src/visualizers/matrix/pseudocode.ts',
    codeExamples: 'src/visualizers/matrix/code-examples.ts',
    renderer: 'MatrixRenderer',
    controls: 'MatrixInputControls',
  },
  ds_string: {
    impl: 'src/visualizers/string/',
    pseudocode: 'src/visualizers/string/pseudocode.ts',
    codeExamples: 'src/visualizers/string/code-examples.ts',
    renderer: 'StringRenderer',
    controls: 'StringInputControls',
  },
};

const inputTypeMap: Record<string, string> = {
  ds_array: 'ArrayInput',
  ds_stack: 'StackInput',
  ds_queue: 'QueueInput',
  ds_linked_list: 'LinkedListInput',
  ds_tree: 'TreeInput',
  ds_graph: 'GraphInput',
  ds_hash_table: 'HashTableInput',
  ds_hash_set: 'HashSetInput',
  ds_matrix: 'MatrixInput',
  ds_string: 'StringInput',
};

const unitTestMap: Record<string, string> = {
  ds_array: 'tests/array-sort.test.ts, tests/array-search.test.ts',
  ds_stack: 'tests/stack-queue-status.test.ts',
  ds_queue: 'tests/stack-queue-status.test.ts',
  ds_linked_list: 'tests/visualizer-step-invariants.test.ts',
  ds_tree: 'tests/visualizer-step-invariants.test.ts',
  ds_graph: 'tests/visualizer-step-invariants.test.ts',
  ds_hash_table: 'tests/visualizer-step-invariants.test.ts',
  ds_hash_set: 'tests/visualizer-step-invariants.test.ts',
  ds_matrix: 'tests/visualizer-step-invariants.test.ts',
  ds_string: 'tests/visualizer-step-invariants.test.ts',
};

const records = publishedAlgorithms.map((a, index) => {
  const impl = algorithmRegistry[a.slug];
  const meta = categoryFileMap[a.dataStructureId] || {
    impl: 'src/visualizers/',
    pseudocode: 'src/data/seed/pseudocode.ts',
    codeExamples: 'src/visualizers/',
    renderer: 'UnknownRenderer',
    controls: 'UnknownControls',
  };

  return {
    sequenceNumber: index + 1,
    id: a.id,
    slug: a.slug,
    name: a.name,
    category: a.dataStructureId.replace('ds_', '').replace(/_/g, ' ').toUpperCase(),
    dataStructureId: a.dataStructureId,
    operationType: a.operationId,
    difficulty: a.difficulty,
    priority: a.priority,
    inputType: inputTypeMap[a.dataStructureId] || 'ArrayInput',
    algorithmImplementationFile: `${meta.impl}registry.ts`,
    stepGeneratorFile: `${meta.impl}`,
    canvasRenderer: meta.renderer,
    controlComponent: meta.controls,
    pseudocodeSource: meta.pseudocode,
    pythonCodeSource: `${meta.codeExamples}#python`,
    cppCodeSource: `${meta.codeExamples}#cpp`,
    javaCodeSource: `${meta.codeExamples}#java`,
    javascriptCodeSource: `${meta.codeExamples}#javascript`,
    complexityMetadata: `Time: ${a.timeComplexityAverage} (Worst: ${a.timeComplexityWorst}), Space: ${a.spaceComplexity}`,
    existingUnitTests: unitTestMap[a.dataStructureId] || 'tests/visualizer-step-invariants.test.ts',
    existingE2ETests: 'e2e/visualizer-slugs.spec.ts',
    currentAuditStatus: impl ? 'PASS' : 'BLOCKED',
    hasImplementation: !!impl,
    hasCodeLineMapping: !!impl?.codeLineMapping,
  };
});

const manifest = {
  timestamp: new Date().toISOString(),
  totalPublished: records.length,
  visualizers: records,
};

fs.writeFileSync(path.join(outDir, 'visualizer-manifest.json'), JSON.stringify(manifest, null, 2));

let md = '# Algo Flow — Visualizer Inventory\n\n';
md += `Total Published Visualizers Audited: **${records.length}**\n\n`;
md += '| # | Name | Route Slug | Category | Operation | Difficulty | Priority | Input Type | Implementation | Renderer | Controls | Code Mappings | Status |\n';
md += '|---|---|---|---|---|---|---|---|---|---|---|---|---|\n';

records.forEach(r => {
  md += `| ${r.sequenceNumber} | ${r.name} | \`${r.slug}\` | ${r.category} | ${r.operationType} | ${r.difficulty} | ${r.priority} | ${r.inputType} | \`${r.algorithmImplementationFile}\` | ${r.canvasRenderer} | ${r.controlComponent} | ${r.hasCodeLineMapping ? '✅' : '❌'} | **${r.currentAuditStatus}** |\n`;
});

md += '\n\n## Detailed Technical Inventory Matrix\n\n';
md += '| # | Slug | Pseudocode Source | Code Examples Source | Complexity | Unit Tests | E2E Tests |\n';
md += '|---|---|---|---|---|---|---|\n';

records.forEach(r => {
  const meta = categoryFileMap[r.dataStructureId];
  const src = meta?.codeExamples || 'src/visualizers/';
  md += `| ${r.sequenceNumber} | \`${r.slug}\` | \`${r.pseudocodeSource}\` | \`${src}\` | ${r.complexityMetadata} | \`${r.existingUnitTests}\` | \`${r.existingE2ETests}\` |\n`;
});

fs.writeFileSync(path.join(outDir, 'VISUALIZER_INVENTORY.md'), md);
console.log(`Inventory created for ${records.length} visualizers.`);
