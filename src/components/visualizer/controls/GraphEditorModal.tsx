"use client";

import { useState, useCallback, useEffect, useRef, type ChangeEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GraphVisualState } from "@/visualizers/graph/types";
import { X, Plus, Trash2, RotateCcw, Save, Settings2, Dices, Upload, Download } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface GraphEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialState?: GraphVisualState;
  isDirected?: boolean;
  isWeighted?: boolean;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
  onSave: (state: GraphVisualState, isDirected: boolean, isWeighted: boolean) => void;
}

// Adapters
const toReactFlowNodes = (state: GraphVisualState): Node[] => {
  return state.nodes.map((n) => ({
    id: n.id,
    position: { x: n.x, y: n.y },
    data: { label: n.value },
    style: {
      background: "var(--color-bg-surface)",
      color: "var(--color-text-primary)",
      border: "2px solid var(--color-border)",
      borderRadius: "50%",
      width: 50,
      height: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
  }));
};

const toReactFlowEdges = (
  state: GraphVisualState,
  isDirected: boolean,
  isWeighted: boolean
): Edge[] => {
  return state.edges.map((e, i) => ({
    id: `e-${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
    label: isWeighted && e.weight !== undefined ? String(e.weight) : undefined,
    markerEnd: isDirected
      ? { type: MarkerType.ArrowClosed, color: "var(--color-border)" }
      : undefined,
    style: { stroke: "var(--color-border)", strokeWidth: 2 },
    labelStyle: { fill: "var(--color-text-primary)", fontWeight: 700 },
    labelBgStyle: { fill: "var(--color-bg-surface-light)" },
  }));
};

const MAX_IMPORT_BYTES = 1_000_000;
const MAX_IMPORT_NODES = 100;
const MAX_IMPORT_EDGES = 500;

function parseImportedGraph(value: unknown): {
  state: GraphVisualState;
  directed: boolean;
  weighted: boolean;
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The imported file must contain one graph object.");
  }
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.nodes) || !Array.isArray(record.edges)) {
    throw new Error("The graph must contain nodes and edges arrays.");
  }
  if (record.nodes.length > MAX_IMPORT_NODES || record.edges.length > MAX_IMPORT_EDGES) {
    throw new Error(`Graphs are limited to ${MAX_IMPORT_NODES} nodes and ${MAX_IMPORT_EDGES} edges.`);
  }

  const nodeIds = new Set<string>();
  const nodes = record.nodes.map((candidate, index) => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new Error(`Node ${index + 1} is not a valid object.`);
    }
    const node = candidate as Record<string, unknown>;
    if (
      typeof node.id !== "string" ||
      node.id.length < 1 ||
      node.id.length > 64 ||
      typeof node.value !== "string" ||
      node.value.length < 1 ||
      node.value.length > 32 ||
      typeof node.x !== "number" ||
      !Number.isFinite(node.x) ||
      Math.abs(node.x) > 10_000 ||
      typeof node.y !== "number" ||
      !Number.isFinite(node.y) ||
      Math.abs(node.y) > 10_000
    ) {
      throw new Error(`Node ${index + 1} has invalid id, label, or coordinates.`);
    }
    if (nodeIds.has(node.id)) throw new Error(`Duplicate node id: ${node.id}`);
    nodeIds.add(node.id);
    return { id: node.id, value: node.value, x: node.x, y: node.y };
  });

  const edges = record.edges.map((candidate, index) => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new Error(`Edge ${index + 1} is not a valid object.`);
    }
    const edge = candidate as Record<string, unknown>;
    if (
      typeof edge.source !== "string" ||
      typeof edge.target !== "string" ||
      !nodeIds.has(edge.source) ||
      !nodeIds.has(edge.target)
    ) {
      throw new Error(`Edge ${index + 1} must reference existing nodes.`);
    }
    if (
      edge.weight !== undefined &&
      (typeof edge.weight !== "number" || !Number.isFinite(edge.weight) || Math.abs(edge.weight) > 1_000_000)
    ) {
      throw new Error(`Edge ${index + 1} has an invalid weight.`);
    }
    return {
      source: edge.source,
      target: edge.target,
      weight: edge.weight as number | undefined,
      isDirected: typeof edge.isDirected === "boolean" ? edge.isDirected : undefined,
    };
  });

  if (record.directed !== undefined && typeof record.directed !== "boolean") {
    throw new Error("The directed setting must be true or false.");
  }
  if (record.weighted !== undefined && typeof record.weighted !== "boolean") {
    throw new Error("The weighted setting must be true or false.");
  }

  return {
    state: { nodes, edges },
    directed: record.directed === true,
    weighted: record.weighted === true,
  };
}

export function GraphEditorModal({
  isOpen,
  onClose,
  initialState,
  isDirected: initDirected = false,
  isWeighted: initWeighted = false,
  returnFocusRef,
  onSave,
}: GraphEditorModalProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [directed, setDirected] = useState(initDirected);
  const [weighted, setWeighted] = useState(initWeighted);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const [editLabel, setEditLabel] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [importError, setImportError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const initializeGraph = useCallback(() => {
    setNodes(initialState ? toReactFlowNodes(initialState) : []);
    setEdges(initialState ? toReactFlowEdges(initialState, initDirected, initWeighted) : []);
    setDirected(initDirected);
    setWeighted(initWeighted);
    setSelectedNode(null);
    setSelectedEdge(null);
    setImportError("");
    setIsDirty(false);
  }, [initialState, initDirected, initWeighted, setNodes, setEdges]);

  // Load state when opening
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      initializeGraph();
    }
  }, [isOpen, initializeGraph]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e-${params.source}-${params.target}-${uuidv4().slice(0, 4)}`,
        markerEnd: directed
          ? { type: MarkerType.ArrowClosed, color: "var(--color-border)" }
          : undefined,
        style: { stroke: "var(--color-border)", strokeWidth: 2 },
        labelStyle: { fill: "var(--color-text-primary)", fontWeight: 700 },
        labelBgStyle: { fill: "var(--color-bg-surface-light)" },
      };
      if (weighted) newEdge.label = "1";
      setEdges((eds) => addEdge(newEdge, eds));
      setIsDirty(true);
    },
    [setEdges, directed, weighted]
  );

  const handleAddNode = () => {
    const nextId = String.fromCharCode(65 + nodes.length); // A, B, C...
    const newNode: Node = {
            id: `node-${Date.now()}`,
      position: { x: Math.random() * 300 + 50, y: Math.random() * 300 + 50 },
      data: { label: nextId },
      style: {
        background: "var(--color-bg-surface)",
        color: "var(--color-text-primary)",
        border: "2px solid var(--color-border)",
        borderRadius: "50%",
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setIsDirty(true);
  };

  const handleClear = () => {
    if (
      isDirty &&
      (nodes.length > 0 || edges.length > 0) &&
      !window.confirm("Clear all unsaved nodes and edges? This cannot be undone.")
    ) {
      return;
    }
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    setIsDirty(true);
  };

  const handleDeleteSelected = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
      );
      setSelectedNode(null);
    }
    if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
    setIsDirty(true);
  };

  const handleRandomGraph = () => {
    const numNodes = Math.floor(Math.random() * 5) + 4; // 4 to 8 nodes
    const newNodes: Node[] = [];
    for (let i = 0; i < numNodes; i++) {
      newNodes.push({
        id: String.fromCharCode(65 + i),
        position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
        data: { label: String.fromCharCode(65 + i) },
        style: {
          background: "var(--color-bg-surface)",
          color: "var(--color-text-primary)",
          border: "2px solid var(--color-border)",
          borderRadius: "50%",
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        },
      });
    }

    const newEdges: Edge[] = [];
    for (let i = 0; i < numNodes; i++) {
      // Connect to 1 or 2 random other nodes
      const numEdges = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numEdges; j++) {
        const targetIdx = Math.floor(Math.random() * numNodes);
        if (targetIdx !== i) {
          const source = newNodes[i].id;
          const target = newNodes[targetIdx].id;
          // Avoid duplicates
          if (!newEdges.some((e) => e.source === source && e.target === target)) {
            newEdges.push({
              id: `e-${source}-${target}-${uuidv4().slice(0, 4)}`,
              source,
              target,
              label: weighted ? String(Math.floor(Math.random() * 10) + 1) : undefined,
              markerEnd: directed
                ? { type: MarkerType.ArrowClosed, color: "var(--color-border)" }
                : undefined,
              style: { stroke: "var(--color-border)", strokeWidth: 2 },
              labelStyle: { fill: "var(--color-text-primary)", fontWeight: 700 },
              labelBgStyle: { fill: "var(--color-bg-surface-light)" },
            });
          }
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setIsDirty(true);
  };

  const handleExport = () => {
    const finalNodes = nodes.map((n) => ({
      id: n.id,
      value: String(n.data.label),
      x: n.position.x,
      y: n.position.y,
    }));
    const finalEdges = edges.map((e) => ({
      source: e.source,
      target: e.target,
      weight: e.label ? parseInt(String(e.label), 10) : undefined,
      isDirected: directed,
    }));
    const payload = JSON.stringify(
      { nodes: finalNodes, edges: finalEdges, directed, weighted },
      null,
      2
    );

    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "algo-flow-graph.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setImportError("Graph files must be smaller than 1 MB.");
      return;
    }

    try {
      const imported = parseImportedGraph(JSON.parse(await file.text()) as unknown);
      setDirected(imported.directed);
      setWeighted(imported.weighted);
      setNodes(toReactFlowNodes(imported.state));
      setEdges(toReactFlowEdges(imported.state, imported.directed, imported.weighted));
      setSelectedNode(null);
      setSelectedEdge(null);
      setImportError("");
      setIsDirty(true);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Invalid graph file.");
    }
  };

  const handleSave = () => {
    const finalNodes = nodes.map((n) => ({
      id: n.id,
      value: String(n.data.label),
      x: n.position.x,
      y: n.position.y,
    }));

    const finalEdges = edges.map((e) => ({
      source: e.source,
      target: e.target,
      weight: e.label ? parseInt(String(e.label), 10) : undefined,
      isDirected: directed,
    }));

    onSave({ nodes: finalNodes, edges: finalEdges }, directed, weighted);
    onClose();
  };

  // Update edge direction dynamically when toggle changes
  useEffect(() => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        markerEnd: directed
          ? { type: MarkerType.ArrowClosed, color: "var(--color-border)" }
          : undefined,
      }))
    );
  }, [directed, setEdges]);

  // Handle properties panel updates
  useEffect(() => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id ? { ...n, data: { ...n.data, label: editLabel } } : n
        )
      );
    }
  }, [editLabel, selectedNode, setNodes]);

  useEffect(() => {
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((e) => (e.id === selectedEdge.id ? { ...e, label: editWeight } : e))
      );
    }
  }, [editWeight, selectedEdge, setEdges]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overlay = overlayRef.current;
    const siblings = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== overlay)
      .map((element) => ({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute("aria-hidden"),
      }));
    siblings.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      siblings.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      window.requestAnimationFrame(() => {
        (returnFocusRef?.current ?? previouslyFocusedRef.current)?.focus();
      });
    };
  }, [isOpen, onClose, returnFocusRef]);
  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-deep/90 p-4 backdrop-blur-sm sm:p-8"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="graph-editor-title"
        tabIndex={-1}
        className="flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-border bg-bg-surface shadow-2xl lg:flex-row"
      >
        {/* Editor Main Canvas */}
        <div className="relative flex-1 bg-bg-surface-light overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border bg-bg-surface p-4 shrink-0">
            <h2 id="graph-editor-title" className="text-lg font-bold">Interactive Graph Editor</h2>
            <div className="flex items-center gap-2">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-text-muted hover:bg-bg-surface-light hover:text-text-primary"
                aria-label="Close graph editor"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={(changes) => {
                onNodesChange(changes);
                setIsDirty(true);
              }}
              onEdgesChange={(changes) => {
                onEdgesChange(changes);
                setIsDirty(true);
              }}
              onConnect={onConnect}
              onNodeClick={(_, node) => {
                setSelectedNode(node);
                setSelectedEdge(null);
                setEditLabel(String(node.data.label));
              }}
              onEdgeClick={(_, edge) => {
                setSelectedEdge(edge);
                setSelectedNode(null);
                setEditWeight(String(edge.label || ""));
              }}
              onPaneClick={() => {
                setSelectedNode(null);
                setSelectedEdge(null);
              }}
              fitView
              colorMode="dark"
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={12}
                size={1}
                color="var(--color-border)"
              />
              <Controls className="bg-bg-surface border-border fill-text-primary" />
              <MiniMap
                className="bg-bg-surface border-border"
                nodeColor="var(--color-primary)"
                maskColor="rgba(0,0,0,0.2)"
              />
            </ReactFlow>
          </div>
        </div>

        {/* Sidebar / Tools */}
        <div className="flex w-full shrink-0 flex-col overflow-y-auto border-t border-border bg-bg-surface p-4 lg:w-80 lg:border-l lg:border-t-0">
          <div className="mb-6 flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Tools</h3>
            <button
              onClick={handleAddNode}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              <Plus className="h-4 w-4" /> Add Vertex
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={!selectedNode && !selectedEdge}
              className="flex items-center justify-center gap-2 rounded-lg bg-error/10 px-4 py-2 text-sm font-bold text-error transition-colors hover:bg-error/20 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Delete Selected
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-2 py-2 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-surface-light"
              >
                <RotateCcw className="h-4 w-4" /> Clear
              </button>
              <button
                onClick={handleRandomGraph}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-2 py-2 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-surface-light"
              >
                <Dices className="h-4 w-4" /> Random
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImport}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-bg-surface-light px-2 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg-surface-light/80"
              >
                <Upload className="h-4 w-4" /> Import
              </button>
              <button
                onClick={handleExport}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-bg-surface-light px-2 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg-surface-light/80"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
            {importError ? (
              <p role="alert" className="text-xs leading-5 text-error">
                {importError}
              </p>
            ) : null}
          </div>

          <div className="mb-6 flex flex-col gap-4 border-t border-border pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">
              Graph Properties
            </h3>

            <label className="flex items-center justify-between gap-2 text-sm font-medium">
              <span>Directed Graph</span>
              <input
                type="checkbox"
                checked={directed}
                onChange={(e) => {
                  setDirected(e.target.checked);
                  setIsDirty(true);
                }}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between gap-2 text-sm font-medium">
              <span>Weighted Edges</span>
              <input
                type="checkbox"
                checked={weighted}
                onChange={(e) => {
                  setWeighted(e.target.checked);
                  setIsDirty(true);
                  // Remove labels if unchecked
                  if (!e.target.checked)
                    setEdges((eds) => eds.map((edge) => ({ ...edge, label: undefined })));
                }}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>
          </div>

          <div className="mb-6 flex flex-col gap-4 border-t border-border pt-6 flex-1">
            <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted flex items-center gap-2">
              <Settings2 className="h-4 w-4" /> Element Properties
            </h3>

            {selectedNode ? (
              <div className="space-y-3">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-text-secondary">Node Label</span>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => {
                      setEditLabel(e.target.value);
                      setIsDirty(true);
                    }}
                    className="rounded-lg border border-border bg-bg-surface-light px-3 py-2 text-text-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    maxLength={3}
                  />
                </label>
              </div>
            ) : selectedEdge ? (
              <div className="space-y-3">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-text-secondary">Edge Weight</span>
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => {
                      setEditWeight(e.target.value);
                      setIsDirty(true);
                    }}
                    disabled={!weighted}
                    className="rounded-lg border border-border bg-bg-surface-light px-3 py-2 text-text-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50"
                  />
                </label>
                {!weighted && (
                  <p className="text-xs text-warning">
                    Enable &apos;Weighted Edges&apos; above to edit.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 rounded-lg border border-dashed border-border bg-bg-surface-light/50 text-text-muted text-center p-4">
                <p className="text-xs">
                  Select a node or edge on the canvas to edit its properties.
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-border pt-4">
            <button
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              <Save className="h-5 w-5" /> Save Graph & Exit
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
