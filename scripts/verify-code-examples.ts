import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { publicationRegistry } from "../src/visualizers/registry/publication-registry";
import type { RequiredCodeLanguage } from "../src/visualizers/registry/types";

type Fixture = {
  expected: string;
  accessResult?: boolean;
  calls?: Record<RequiredCodeLanguage, string>;
  sortStatements?: Record<RequiredCodeLanguage, string>;
};

const fixtures: Record<string, Fixture> = {
  access: { expected: "8", accessResult: true },
  "access-by-index": { expected: "8", accessResult: true },
  "random-access": { expected: "8", accessResult: true },
  "forward-traversal": { expected: "4 8 15" },
  "reverse-traversal": { expected: "15 8 4" },
  "range-traversal": { expected: "8 15" },
  "linear-search": {
    expected: "2",
    calls: {
      javascript: "linearSearch([4, 8, 15], 15)",
      python: "linear_search([4, 8, 15], 15)",
      cpp: "linearSearch(array, 3, 15)",
      java: "new Main().linearSearch(array, 15)",
    },
  },
  "binary-search": {
    expected: "2",
    calls: {
      javascript: "binarySearch([4, 8, 15], 15)",
      python: "binary_search([4, 8, 15], 15)",
      cpp: "binarySearch(array, 15)",
      java: "new Main().binarySearch(array, 15)",
    },
  },
  "jump-search": {
    expected: "2",
    calls: {
      javascript: "jumpSearch([4, 8, 15], 15)",
      python: "jump_search([4, 8, 15], 15)",
      cpp: "jumpSearch(array, 15)",
      java: "new Main().jumpSearch(array, 15)",
    },
  },
  "interpolation-search": {
    expected: "2",
    calls: {
      javascript: "interpolationSearch([4, 8, 15], 15)",
      python: "interpolation_search([4, 8, 15], 15)",
      cpp: "interpolationSearch(array, 15)",
      java: "new Main().interpolationSearch(array, 15)",
    },
  },
  "bubble-sort": {
    expected: "1 2 3",
    sortStatements: {
      javascript: "bubbleSort(array);",
      python: "bubble_sort(array)",
      cpp: "bubbleSort(array);",
      java: "new Main().bubbleSort(array);",
    },
  },
  "selection-sort": {
    expected: "1 2 3",
    sortStatements: {
      javascript: "selectionSort(array);",
      python: "selection_sort(array)",
      cpp: "selectionSort(array);",
      java: "new Main().selectionSort(array);",
    },
  },
  "insertion-sort": {
    expected: "1 2 3",
    sortStatements: {
      javascript: "insertionSort(array);",
      python: "insertion_sort(array)",
      cpp: "insertionSort(array);",
      java: "new Main().insertionSort(array);",
    },
  },
  "merge-sort": {
    expected: "1 2 3",
    sortStatements: {
      javascript: "array = mergeSort(array);",
      python: "array = merge_sort(array)",
      cpp: "mergeSort(array, 0, array.size() - 1);",
      java: "new Main().mergeSort(array, 0, array.length - 1);",
    },
  },
  "quick-sort": {
    expected: "1 2 3",
    sortStatements: {
      javascript: "quickSort(array);",
      python: "quick_sort(array, 0, len(array) - 1)",
      cpp: "quickSort(array, 0, array.size() - 1);",
      java: "new Main().quickSort(array, 0, array.length - 1);",
    },
  },
  "heap-sort": {
    expected: "1 2 3",
    sortStatements: {
      javascript: "heapSort(array);",
      python: "heap_sort(array)",
      cpp: "heapSort(array);",
      java: "new Main().heapSort(array);",
    },
  },
  "counting-sort": {
    expected: "1 2 3",
    sortStatements: {
      javascript: "countingSort(array);",
      python: "counting_sort(array)",
      cpp: "countingSort(array);",
      java: "new Main().countingSort(array);",
    },
  },
  "radix-sort": {
    expected: "1 2 3",
    sortStatements: {
      javascript: "radixSort(array);",
      python: "radix_sort(array)",
      cpp: "radixSort(array);",
      java: "new Main().radixSort(array);",
    },
  },
};

type RunResult =
  | { status: "pass"; output: string }
  | { status: "not-run"; reason: string }
  | { status: "fail"; reason: string };

function normalize(output: string) {
  return output.trim().split(/\s+/).filter(Boolean).join(" ");
}

function commandAvailable(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    windowsHide: true,
    timeout: 10_000,
  });
  return !result.error && result.status === 0;
}

function findPythonCommand() {
  if (commandAvailable("python", ["--version"])) {
    return { command: "python", prefix: [] as string[] };
  }
  if (commandAvailable("py", ["-3", "--version"])) {
    return { command: "py", prefix: ["-3"] };
  }
  return undefined;
}

const toolchain = {
  python: findPythonCommand(),
  cpp: commandAvailable("g++", ["--version"]),
  java: commandAvailable("javac", ["-version"]),
};

function run(
  command: string,
  args: string[],
  cwd: string
): { ok: true; output: string } | { ok: false; reason: string } {
  let attempts = 0;
  while (attempts < 10) {
    const result = spawnSync(command, args, {
      cwd,
      encoding: "utf8",
      windowsHide: true,
      timeout: 20_000,
    });
    if (result.error) {
      if (process.platform === "win32" && attempts < 9) {
        attempts++;
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 800);
        continue;
      }
      return { ok: false, reason: result.error.message };
    }
    if (result.status !== 0) {
      const reason =
        normalize(result.stderr || result.stdout) || `command exited with status ${result.status}`;
      if (
        process.platform === "win32" &&
        attempts < 9 &&
        /Device Guard|EBUSY|EACCES|UNKNOWN/i.test(reason)
      ) {
        attempts++;
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 800);
        continue;
      }
      return { ok: false, reason };
    }
    return { ok: true, output: normalize(result.stdout) };
  }
  return { ok: false, reason: "spawnSync retry limit exceeded" };
}

function runFreshExecutable(programPath: string, cwd: string) {
  const invoke = () => {
    if (process.platform === "win32" && !programPath.includes("\\") && !programPath.includes("/")) {
      return run(`.\\${programPath}`, [], cwd);
    }
    return run(programPath, [], cwd);
  };

  let result = invoke();
  for (let attempt = 1; attempt < 8 && !result.ok; attempt++) {
    const transientPolicyRace =
      /\b(?:UNKNOWN|EBUSY|EACCES|EPERM)\b/.test(result.reason) ||
      /Device Guard policy/i.test(result.reason) ||
      /spawnSync/i.test(result.reason);
    if (!transientPolicyRace) break;
    waitForExecutablePolicyScan();
    result = invoke();
  }
  return result;
}
function waitForExecutablePolicyScan() {
  // Windows Device Guard / Defender may inspect a freshly linked binary before allowing
  // execution. A short bounded wait avoids racing that scan.
  if (process.platform === "win32") {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
  }
}

function javascriptSource(code: string, fixture: Fixture) {
  if (fixture.sortStatements) {
    return [
      code,
      "let array = [3, 1, 2];",
      fixture.sortStatements.javascript,
      'console.log(array.join(" "));',
    ].join("\n");
  }
  if (fixture.calls) {
    return [code, `console.log(${fixture.calls.javascript});`].join("\n");
  }
  return [
    "const array = [4, 8, 15];",
    "const index = 1;",
    "const start = 1;",
    "const end = 2;",
    code,
    fixture.accessResult ? "console.log(value);" : "",
  ].join("\n");
}

function pythonSource(code: string, fixture: Fixture) {
  if (fixture.sortStatements) {
    return [
      code,
      "array = [3, 1, 2]",
      fixture.sortStatements.python,
      'print(" ".join(map(str, array)))',
    ].join("\n");
  }
  if (fixture.calls) {
    return [code, `print(${fixture.calls.python})`].join("\n");
  }
  return [
    "array = [4, 8, 15]",
    "index = 1",
    "start = 1",
    "end = 2",
    code,
    fixture.accessResult ? "print(value)" : "",
  ].join("\n");
}

function cppSource(code: string, fixture: Fixture) {
  if (fixture.sortStatements) {
    return `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;
${code}
int main() {
  vector<int> array = {3, 1, 2};
  ${fixture.sortStatements.cpp}
  for (int value : array) cout << value << " ";
  return 0;
}`;
  }
  if (fixture.calls) {
    const linearSetup = fixture.calls.cpp.startsWith("linearSearch")
      ? "int array[] = {4, 8, 15};"
      : "vector<int> array = {4, 8, 15};";
    return `#include <algorithm>
#include <cmath>
#include <iostream>
#include <vector>
using namespace std;
${code}
int main() {
  ${linearSetup}
  cout << ${fixture.calls.cpp} << endl;
  return 0;
}`;
  }
  return `#include <iostream>
#include <vector>
using namespace std;
int main() {
  vector<int> array = {4, 8, 15};
  int n = static_cast<int>(array.size());
  int index = 1;
  int start = 1;
  int end = 2;
${code}
  ${fixture.accessResult ? "cout << value << endl;" : ""}
  return 0;
}`;
}

function javaSource(code: string, fixture: Fixture) {
  if (fixture.sortStatements) {
    return `import java.util.Arrays;
public class Main {
${code}
  public static void main(String[] args) {
    int[] array = {3, 1, 2};
    ${fixture.sortStatements.java}
    for (int value : array) System.out.print(value + " ");
  }
}`;
  }
  if (fixture.calls) {
    return `public class Main {
${code}
  public static void main(String[] args) {
    int[] array = {4, 8, 15};
    System.out.println(${fixture.calls.java});
  }
}`;
  }
  return `public class Main {
  public static void main(String[] args) {
    int[] array = {4, 8, 15};
    int index = 1;
    int start = 1;
    int end = 2;
${code}
    ${fixture.accessResult ? "System.out.println(value);" : ""}
  }
}`;
}

function verifyLanguage(
  language: RequiredCodeLanguage,
  code: string,
  fixture: Fixture,
  directory: string
): RunResult {
  let execution: { ok: true; output: string } | { ok: false; reason: string };

  if (language === "javascript") {
    const source = join(directory, "example.js");
    writeFileSync(source, javascriptSource(code, fixture));
    execution = run(process.execPath, [source], directory);
  } else if (language === "python") {
    const python = toolchain.python;
    if (!python) {
      return {
        status: "not-run",
        reason: "Python interpreter is unavailable",
      };
    }
    const source = join(directory, "example.py");
    writeFileSync(source, pythonSource(code, fixture));
    execution = run(python.command, [...python.prefix, source], directory);
  } else if (language === "cpp") {
    if (!toolchain.cpp) {
      return { status: "not-run", reason: "g++ is unavailable" };
    }
    const source = join(directory, "example.cpp");
    const program = process.platform === "win32" ? "example.exe" : "./example";
    writeFileSync(source, cppSource(code, fixture));
    const compilation = run("g++", [source, "-std=c++11", "-o", program], directory);
    if (compilation.ok) waitForExecutablePolicyScan();
    execution = compilation.ok ? runFreshExecutable(program, directory) : compilation;
  } else {
    if (!toolchain.java) {
      return { status: "not-run", reason: "javac is unavailable" };
    }
    const source = join(directory, "Main.java");
    writeFileSync(source, javaSource(code, fixture));
    const compilation = run("javac", [source], directory);
    execution = compilation.ok ? run("java", ["-cp", directory, "Main"], directory) : compilation;
  }

  if (!execution.ok) return { status: "fail", reason: execution.reason };
  if (execution.output !== fixture.expected) {
    return {
      status: "fail",
      reason: `expected "${fixture.expected}", received "${execution.output}"`,
    };
  }
  return { status: "pass", output: execution.output };
}

const tempDir = join(process.cwd(), ".tmp");
mkdirSync(tempDir, { recursive: true });
const tempBase = process.platform === "win32" ? tempDir : tmpdir();
const root = mkdtempSync(join(tempBase, "algo-flow-code-examples-"));
const failures: string[] = [];
const notRun: string[] = [];
let passed = 0;

try {
  for (const [slug, fixture] of Object.entries(fixtures)) {
    const definition = publicationRegistry[slug];
    if (!definition) {
      failures.push(`${slug}: publication definition is missing`);
      continue;
    }

    for (const language of ["javascript", "python", "cpp", "java"] as const) {
      const example = definition.codeExamples[language];
      if (!example) {
        failures.push(`${slug}/${language}: code example is missing`);
        continue;
      }
      const directory = join(root, `${slug}-${language}`);
      mkdirSync(directory, { recursive: true });
      const result = verifyLanguage(language, example.code, fixture, directory);
      if (result.status === "pass") {
        passed += 1;
        console.log(`[PASS] ${slug}/${language}: ${result.output || "(no output)"}`);
      } else if (result.status === "not-run") {
        notRun.push(`${slug}/${language}: ${result.reason}`);
        console.log(`[NOT RUN] ${slug}/${language}: ${result.reason}`);
      } else {
        failures.push(`${slug}/${language}: ${result.reason}`);
        console.error(`[FAIL] ${slug}/${language}: ${result.reason}`);
      }
    }
  }
} finally {
  try {
    rmSync(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    // Ignore cleanup failure on Windows if files locked by OS scanner
  }
}

console.log(
  `\nCode-example summary: ${passed} passed, ${notRun.length} not run, ${failures.length} failed.`
);

if (notRun.length > 0) {
  console.log("Not run:");
  for (const item of notRun) console.log(`- ${item}`);
}
if (failures.length > 0) {
  console.error("Failures:");
  for (const item of failures) console.error(`- ${item}`);
  process.exitCode = 1;
}
if (process.argv.includes("--require-all") && notRun.length > 0) {
  console.error("--require-all failed because at least one language was not run.");
  process.exitCode = 1;
}
