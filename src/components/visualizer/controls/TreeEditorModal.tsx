"use client";

import { useState, useCallback, useRef, useEffect, startTransition } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TreeVisualState, TreeNodeData } from "@/visualizers/tree/types";
import {
  X,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Settings2,
  Download,
  Upload,
  ShieldCheck,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Pure recursive helpers — extracted outside component so they're stable references
function findNode(root: TreeNodeData | null, id: string): TreeNodeData | null {
  if (!root) return null;
  if (root.id === id) return root;
  const left = findNode(root.left, id);
  if (left) return left;
  return findNode(root.right, id);
}

function findParent(root: TreeNodeData | null, id: string): TreeNodeData | null {
  if (!root) return null;
  if (root.left?.id === id || root.right?.id === id) return root;
  const left = findParent(root.left, id);
  if (left) return left;
  return findParent(root.right, id);
}

function validateBST(node: TreeNodeData | null, min: number | null, max: number | null): boolean {
  if (!node) return true;
  if ((min !== null && node.value <= min) || (max !== null && node.value >= max)) return false;
  return validateBST(node.left, min, node.value) && validateBST(node.right, node.value, max);
}

interface TreeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialState: TreeVisualState | null;
  onSave: (state: TreeVisualState) => void;
}

export function TreeEditorModal({ isOpen, onClose, initialState, onSave }: TreeEditorModalProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [treeRoot, setTreeRoot] = useState<TreeNodeData | null>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isBSTMode, setIsBSTMode] = useState(false);
  const [bstError, setBstError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  const containerRef = useRef<HTMLDivElement>(null);

  // Update React Flow nodes/edges from tree root
  const updateFlowFromTree = useCallback(
    (root: TreeNodeData | null, width: number) => {
      if (!root) {
        setNodes([]);
        setEdges([]);
        return;
      }

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      const traverse = (
        node: TreeNodeData,
        level: number,
        leftBound: number,
        rightBound: number
      ) => {
        const x = (leftBound + rightBound) / 2;
        const y = level * 80 + 40;

        newNodes.push({
          id: node.id,
          position: { x, y },
          data: { label: String(node.value) },
          style: {
            background:
              selectedNodeId === node.id ? "var(--color-primary)" : "var(--color-bg-surface)",
            color:
              selectedNodeId === node.id
                ? "var(--color-primary-foreground)"
                : "var(--color-text-primary)",
            border:
              selectedNodeId === node.id
                ? "2px solid var(--color-primary-muted)"
                : "2px solid var(--color-border)",
            borderRadius: "50%",
            width: 50,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            transition: "all 0.2s ease",
          },
          draggable: false, // We use auto-layout, so no dragging
        });

        if (node.left) {
          newEdges.push({
            id: `e-${node.id}-${node.left.id}`,
            source: node.id,
            target: node.left.id,
            type: "straight",
            style: { stroke: "var(--color-border)", strokeWidth: 2 },
          });
          traverse(node.left, level + 1, leftBound, x);
        }

        if (node.right) {
          newEdges.push({
            id: `e-${node.id}-${node.right.id}`,
            source: node.id,
            target: node.right.id,
            type: "straight",
            style: { stroke: "var(--color-border)", strokeWidth: 2 },
          });
          traverse(node.right, level + 1, x, rightBound);
        }
      };

      traverse(root, 0, 0, width);
      setNodes(newNodes);
      setEdges(newEdges);

      if (isBSTMode) {
        const isValid = validateBST(root, null, null);
        if (!isValid) {
          setBstError("Tree violates Binary Search Tree properties.");
        } else {
          setBstError(null);
        }
      } else {
        setBstError(null);
      }
    },
    [selectedNodeId, isBSTMode, setNodes, setEdges]
  );

  // Handle Resize
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          setContainerWidth(width);
          if (treeRoot) {
            updateFlowFromTree(treeRoot, width);
          }
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [treeRoot, updateFlowFromTree]);

  // Load state when opening — using startTransition to avoid cascading renders
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      // Modal just opened — wrap in startTransition to de-prioritise and prevent cascading
      startTransition(() => {
        if (initialState?.root) {
          setTreeRoot(structuredClone(initialState.root));
        } else {
          setTreeRoot(null);
        }
        setSelectedNodeId(null);
      });
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, initialState]);

  // Sync React Flow graph from tree state
  // Using requestAnimationFrame to batch state updates and avoid cascading renders
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      updateFlowFromTree(treeRoot, containerWidth);
    });
    return () => cancelAnimationFrame(raf);
  }, [treeRoot, selectedNodeId, isBSTMode, containerWidth, updateFlowFromTree]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
  };

  const handlePaneClick = () => {
    setSelectedNodeId(null);
  };

  const handleAddRoot = () => {
    if (!treeRoot) {
      const newVal = Math.floor(Math.random() * 90) + 10;
      setTreeRoot({ id: uuidv4(), value: newVal, left: null, right: null });
    }
  };

  const handleAddChild = useCallback(
    (side: "left" | "right") => {
      if (!selectedNodeId || !treeRoot) return;
      const newRoot = structuredClone(treeRoot);
      const node = findNode(newRoot, selectedNodeId);
      if (node) {
        if (node[side]) {
          alert(`Node already has a ${side} child.`);
          return;
        }
        const newVal = Math.floor(Math.random() * 90) + 10;
        node[side] = { id: uuidv4(), value: newVal, left: null, right: null };
        setTreeRoot(newRoot);
      }
    },
    [selectedNodeId, treeRoot]
  );

  const handleDeleteNode = () => {
    if (!selectedNodeId || !treeRoot) return;
    if (treeRoot.id === selectedNodeId) {
      setTreeRoot(null);
      setSelectedNodeId(null);
      return;
    }
    const newRoot = structuredClone(treeRoot);
    const parent = findParent(newRoot, selectedNodeId);
    if (parent) {
      if (parent.left?.id === selectedNodeId) parent.left = null;
      if (parent.right?.id === selectedNodeId) parent.right = null;
      setTreeRoot(newRoot);
      setSelectedNodeId(null);
    }
  };

  const handleUpdateValue = (newVal: number) => {
    if (!selectedNodeId || !treeRoot || isNaN(newVal)) return;
    const newRoot = structuredClone(treeRoot);
    const node = findNode(newRoot, selectedNodeId);
    if (node) {
      node.value = newVal;
      setTreeRoot(newRoot);
    }
  };

  const handleClear = () => {
    setTreeRoot(null);
    setSelectedNodeId(null);
  };

  const handleRandomTree = () => {
    const buildRandom = (level: number, maxLevel: number): TreeNodeData | null => {
      if (level >= maxLevel) return null;
      const node: TreeNodeData = {
        id: uuidv4(),
        value: Math.floor(Math.random() * 90) + 10,
        left: null,
        right: null,
      };
      if (Math.random() > 0.3) node.left = buildRandom(level + 1, maxLevel);
      if (Math.random() > 0.3) node.right = buildRandom(level + 1, maxLevel);
      return node;
    };
    setTreeRoot(buildRandom(0, 4));
    setSelectedNodeId(null);
  };

  const handleRandomBST = () => {
    const insertBST = (node: TreeNodeData, val: number) => {
      if (val < node.value) {
        if (!node.left) node.left = { id: uuidv4(), value: val, left: null, right: null };
        else insertBST(node.left, val);
      } else {
        if (!node.right) node.right = { id: uuidv4(), value: val, left: null, right: null };
        else insertBST(node.right, val);
      }
    };

    const count = Math.floor(Math.random() * 8) + 5;
    const rootVal = Math.floor(Math.random() * 90) + 10;
    const root: TreeNodeData = { id: uuidv4(), value: rootVal, left: null, right: null };
    for (let i = 1; i < count; i++) {
      insertBST(root, Math.floor(Math.random() * 90) + 10);
    }
    setTreeRoot(root);
    setSelectedNodeId(null);
  };

  const handleExport = () => {
    const payload = JSON.stringify({ root: treeRoot }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "algo-flow-tree.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.root !== undefined) {
            setTreeRoot(data.root);
            setSelectedNodeId(null);
          }
        } catch {
          alert("Invalid tree file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSave = () => {
    if (isBSTMode && bstError) {
      alert("Cannot save: " + bstError);
      return;
    }
    onSave({ root: treeRoot });
    onClose();
  };

  if (!isOpen) return null;

  const selectedNodeData = selectedNodeId ? findNode(treeRoot, selectedNodeId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-bg-base border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-bg-surface">
          <div className="flex items-center gap-3">
            <Settings2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-text-primary">Tree Editor</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-muted transition-colors hover:bg-bg-surface-light hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Canvas */}
          <div className="relative flex-1 bg-bg-base overflow-hidden" ref={containerRef}>
            {!treeRoot ? (
              <div className="flex items-center justify-center w-full h-full text-text-muted flex-col gap-4">
                <p>Tree is empty.</p>
                <button
                  onClick={handleAddRoot}
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg flex gap-2 items-center"
                >
                  <Plus className="h-4 w-4" /> Add Root Node
                </button>
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                fitView
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
              >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
              </ReactFlow>
            )}

            {/* BST Error Banner */}
            {bstError && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-error text-error-foreground px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 text-sm z-10">
                <ShieldCheck className="h-4 w-4" />
                {bstError}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-border bg-bg-surface p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="mb-6 flex flex-col gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">
                  Node Actions
                </h3>

                {selectedNodeData ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-text-secondary mb-2">
                      Editing Node <strong>{selectedNodeData.value}</strong>
                    </p>
                    <label className="flex flex-col gap-1 text-sm font-medium text-text-secondary">
                      Node Value
                      <input
                        type="number"
                        value={selectedNodeData.value}
                        onChange={(e) => handleUpdateValue(parseInt(e.target.value, 10))}
                        className="rounded-lg border border-border bg-bg-surface-light px-3 py-2 text-text-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      />
                    </label>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAddChild("left")}
                        disabled={!!selectedNodeData.left}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-bg-surface-light px-2 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg-surface-light/80 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" /> Left
                      </button>
                      <button
                        onClick={() => handleAddChild("right")}
                        disabled={!!selectedNodeData.right}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-bg-surface-light px-2 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg-surface-light/80 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" /> Right
                      </button>
                    </div>
                    <button
                      onClick={handleDeleteNode}
                      className="flex items-center justify-center gap-2 rounded-lg bg-error/10 px-4 py-2 text-sm font-bold text-error transition-colors hover:bg-error/20 mt-2"
                    >
                      <Trash2 className="h-4 w-4" /> Delete Node{" "}
                      {treeRoot?.id === selectedNodeId && "(Root)"}
                    </button>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center border border-dashed border-border rounded-lg text-text-muted text-sm text-center p-4">
                    Select a node on the canvas to add children or edit its value.
                  </div>
                )}
              </div>

              <div className="mb-6 flex flex-col gap-4 border-t border-border pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">
                  Tree Validation
                </h3>
                <label className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isBSTMode}
                      onChange={(e) => setIsBSTMode(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-border bg-bg-surface-light checked:border-primary checked:bg-primary transition-colors"
                    />
                    <svg
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      fill="none"
                    >
                      <path
                        d="M1 5L4.5 8.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-primary">Enforce BST</span>
                    <span className="text-xs text-text-muted">
                      Highlights violations of Binary Search Tree rules.
                    </span>
                  </div>
                </label>
              </div>

              <div className="mb-6 flex flex-col gap-3 border-t border-border pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">
                  Canvas Tools
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleClear}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-transparent px-2 py-2 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-surface-light"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear
                  </button>
                  <button
                    onClick={handleRandomTree}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-transparent px-2 py-2 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-surface-light"
                  >
                    Random
                  </button>
                </div>
                <button
                  onClick={handleRandomBST}
                  className="flex w-full items-center justify-center gap-1 rounded-lg border border-border bg-transparent px-2 py-2 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-surface-light"
                >
                  Random BST
                </button>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleImport}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-bg-surface-light px-2 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg-surface-light/80"
                  >
                    <Upload className="h-3 w-3" /> Import
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-bg-surface-light px-2 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg-surface-light/80"
                  >
                    <Download className="h-3 w-3" /> Export
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="h-5 w-5" />
              Save & Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
