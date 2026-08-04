import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("production audit accessibility contracts", () => {
  test("graph editor exposes a modal, focus containment, inert background, and safe import boundary", () => {
    const modal = source("src/components/visualizer/controls/GraphEditorModal.tsx");
    const controls = source("src/components/visualizer/controls/GraphInputControls.tsx");

    expect(modal).toContain('role="dialog"');
    expect(modal).toContain('aria-modal="true"');
    expect(modal).toContain('aria-labelledby="graph-editor-title"');
    expect(modal).toContain('aria-label="Close graph editor"');
    expect(modal).toContain('event.key === "Escape"');
    expect(modal).toContain('event.key !== "Tab"');
    expect(modal).toContain("element.inert = true");
    expect(modal).toContain("returnFocusRef?.current");
    expect(modal).toContain("MAX_IMPORT_BYTES");
    expect(modal).toContain("parseImportedGraph");
    expect(modal).toContain("window.confirm");
    expect(controls).toContain("returnFocusRef={editGraphButtonRef}");
  });

  test("landing code selector uses the WAI-ARIA tab contract without stale exit content", () => {
    const codeLanguages = source("src/components/landing/CodeLanguages.tsx");

    expect(codeLanguages).toContain('role="tablist"');
    expect(codeLanguages).toContain('role="tab"');
    expect(codeLanguages).toContain("aria-selected={isActive}");
    expect(codeLanguages).toContain('role="tabpanel"');
    expect(codeLanguages).toContain('event.key !== "ArrowLeft"');
    expect(codeLanguages).not.toContain("AnimatePresence");
  });

  test("matrix custom input and linked-list position have persistent programmatic labels", () => {
    const matrix = source("src/components/visualizer/controls/MatrixInputControls.tsx");
    const linkedList = source("src/components/visualizer/controls/LinkedListInputControls.tsx");

    expect(matrix).toContain("Custom matrix values");
    expect(matrix).toContain("aria-invalid={Boolean(error)}");
    expect(matrix).toContain('role="alert"');
    expect(linkedList).toContain('htmlFor="linked-list-position"');
    expect(linkedList).toContain('aria-invalid={Boolean(error)}');
  });

  test("registration policy and consent controls are active", () => {
    const signup = source("src/app/(auth)/signup/page.tsx");
    const policy = source("src/lib/legal/policy-versions.ts");

    expect(policy).toContain("ACCOUNT_REGISTRATION_AVAILABLE = true");
    expect(signup).toContain('name="first_name"');
    expect(signup).toContain('name="last_name"');
    expect(signup).toContain('name="gender"');
    expect(signup).toContain('name="legal_accepted"');
    expect(signup).not.toContain('name="age_confirmed"');
    expect(signup).toContain("minLength={8}");
  });
});
