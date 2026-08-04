import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { algorithms } from '../src/data/seed/algorithms';
import { algorithmRegistry } from '../src/visualizers/registry/algorithm-registry';

const TEMP_DIR = path.join(process.cwd(), '.temp_compile');
if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TEMP_DIR);

const dirs = {
  cpp: path.join(TEMP_DIR, 'cpp'),
  java: path.join(TEMP_DIR, 'java'),
  py: path.join(TEMP_DIR, 'py'),
  js: path.join(TEMP_DIR, 'js')
};

Object.values(dirs).forEach(d => fs.mkdirSync(d));

const publishedAlgorithms = algorithms.filter(a => a.isPublished);

let cppFiles: string[] = [];
let javaFiles: string[] = [];
let pyFiles: string[] = [];
let jsFiles: string[] = [];

for (const algo of publishedAlgorithms) {
  const definition = algorithmRegistry[algo.slug];
  if (!definition || !definition.getCodeExamples) continue;
  
  const examples = definition.getCodeExamples(algo.slug, algo.id);
  
  for (const ex of examples) {
    let code = ex.code;
    
    if (ex.language === 'cpp') {
      let innerCode = code;
      // If no function or class is defined, wrap in main
      if (!code.includes('(') || (!code.includes('void ') && !code.includes('int ') && !code.includes('class ') && !code.includes('struct '))) {
         innerCode = `int main() {\n${code}\nreturn 0;\n}`;
      }
      const wrapper = `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>
using namespace std;

${innerCode}
`;
      const file = path.join(dirs.cpp, `${algo.slug.replace(/-/g, '_')}.cpp`);
      fs.writeFileSync(file, wrapper);
      cppFiles.push(file);
    } 
    else if (ex.language === 'java') {
      let wrapper = `import java.util.*;\n\n`;
      let className = `Test_${algo.slug.replace(/-/g, '_')}`;
      
      // Try to find a constructor name if it's not a full class
      const constructorMatch = code.match(/^\s*([A-Z][a-zA-Z0-9_]*)\s*\(/m);
      if (constructorMatch && !code.includes('class ')) {
         className = constructorMatch[1];
      }
      
      if (!code.includes('class ')) {
         // If it's a naked statement list (no constructor or method), wrap in a method inside the class
         if (!code.includes('(')) {
             wrapper += `public class ${className} {\n  public void run() {\n${code}\n  }\n}`;
         } else {
             wrapper += `public class ${className} {\n${code}\n}`;
         }
      } else {
         const classMatch = code.match(/class\\s+([A-Za-z0-9_]+)/);
         if (classMatch) {
            className = classMatch[1];
         }
         wrapper += code;
      }
      
      const file = path.join(dirs.java, `${className}.java`);
      fs.writeFileSync(file, wrapper);
      javaFiles.push(file);
    }
    else if (ex.language === 'python') {
      const file = path.join(dirs.py, `${algo.slug.replace(/-/g, '_')}.py`);
      fs.writeFileSync(file, code);
      pyFiles.push(file);
    }
    else if (ex.language === 'javascript') {
      let wrapper = code;
      // If code doesn't define a function/class, wrap in a function
      if (!code.trim().startsWith('function') && !code.trim().startsWith('class') && !code.trim().startsWith('const') && !code.trim().startsWith('let') && !code.includes('=>')) {
        wrapper = `function run() {\n${code}\n}`;
      }
      const file = path.join(dirs.js, `${algo.slug.replace(/-/g, '_')}.js`);
      fs.writeFileSync(file, wrapper);
      jsFiles.push(file);
    }
  }
}

console.log(`Generated ${cppFiles.length} C++, ${javaFiles.length} Java, ${pyFiles.length} Python, ${jsFiles.length} JS files.`);

// 1. C++ Syntax Check
console.log('\\n--- Checking C++ ---');
try {
  execSync(`g++ -fsyntax-only "${dirs.cpp}"/*.cpp`, { stdio: 'pipe' });
  console.log('✅ C++ Syntax Check Passed');
} catch (e: any) {
  console.log('❌ C++ Syntax Check Failed');
  console.error(e.stderr?.toString().substring(0, 500) || e.message);
}

// 2. Java Syntax Check
console.log('\\n--- Checking Java ---');
try {
  execSync(`javac "${dirs.java}"/*.java`, { stdio: 'pipe' });
  console.log('✅ Java Syntax Check Passed');
} catch (e: any) {
  console.log('❌ Java Syntax Check Failed');
  console.error(e.stderr?.toString().substring(0, 500) || e.message);
}

// 3. JS Syntax Check
console.log('\\n--- Checking JS ---');
try {
  // Use node to syntax check each file
  jsFiles.forEach(f => {
     execSync(`node --check "${f}"`, { stdio: 'pipe' });
  });
  console.log('✅ JS Syntax Check Passed');
} catch (e: any) {
  console.log('❌ JS Syntax Check Failed');
  console.error(e.stderr?.toString().substring(0, 500) || e.message);
}

// 4. Python Syntax Check
console.log('\\n--- Checking Python ---');
try {
  execSync(`npx pyright "${dirs.py}"`, { stdio: 'pipe' });
  console.log('✅ Python Syntax Check Passed');
} catch (e: any) {
  console.log('❌ Python Syntax Check Failed (Pyright found issues or is not installed)');
  console.error(e.stdout?.toString().substring(0, 500) || e.message);
}
