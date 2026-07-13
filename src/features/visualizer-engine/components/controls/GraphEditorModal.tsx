"use client";

import { useState, useCallback, useEffect } from "react";
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
  BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GraphVisualState } from "@/features/algorithms/graph/types";
import { X, Plus, Trash2, RotateCcw, Save, Settings2, Dices, Upload, Download } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface GraphEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialState?: GraphVisualState;
  isDirected?: boolean;
  isWeighted?: boolean;
  onSave: (state: GraphVisualState, isDirected: boolean, isWeighted: boolean) => void;
}

// Adapters
const toReactFlowNodes = (state: GraphVisualState): Node[] => {
  return state.nodes.map(n => ({
    id: n.id,
    position: { x: n.x, y: n.y },
    data: { label: n.value },
    style: { 
      background: 'var(--color-bg-surface)', 
      color: 'var(--color-text-primary)', 
      border: '2px solid var(--color-border)',
      borderRadius: '50%',
      width: 50,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    }
  }));
};

const toReactFlowEdges = (state: GraphVisualState, isDirected: boolean, isWeighted: boolean): Edge[] => {
  return state.edges.map((e, i) => ({
    id: `e-${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
    label: isWeighted && e.weight !== undefined ? String(e.weight) : undefined,
    markerEnd: isDirected ? { type: MarkerType.ArrowClosed, color: 'var(--color-border)' } : undefined,
    style: { stroke: 'var(--color-border)', strokeWidth: 2 },
    labelStyle: { fill: 'var(--color-text-primary)', fontWeight: 700 },
    labelBgStyle: { fill: 'var(--color-bg-surface-light)' },
  }));
};

export function GraphEditorModal({ isOpen, onClose, initialState, isDirected: initDirected = false, isWeighted: initWeighted = false, onSave }: GraphEditorModalProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [directed, setDirected] = useState(initDirected);
  const [weighted, setWeighted] = useState(initWeighted);
  
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const [editLabel, setEditLabel] = useState("");
  const [editWeight, setEditWeight] = useState("");

  const initializeGraph = useCallback(() => {
    if (initialState) {
      setNodes(toReactFlowNodes(initialState));
      setEdges(toReactFlowEdges(initialState, initDirected, initWeighted));
      setDirected(initDirected);
      setWeighted(initWeighted);
    }
  }, [initialState, initDirected, initWeighted, setNodes, setEdges]);

  // Load state when opening
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      initializeGraph();
    }
  }, [isOpen, initializeGraph]);

  const onConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      ...params,
      id: `e-${params.source}-${params.target}-${uuidv4().slice(0, 4)}`,
      markerEnd: directed ? { type: MarkerType.ArrowClosed, color: 'var(--color-border)' } : undefined,
      style: { stroke: 'var(--color-border)', strokeWidth: 2 },
      labelStyle: { fill: 'var(--color-text-primary)', fontWeight: 700 },
      labelBgStyle: { fill: 'var(--color-bg-surface-light)' },
    };
    if (weighted) newEdge.label = "1";
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges, directed, weighted]);

  const handleAddNode = () => {
    const nextId = String.fromCharCode(65 + nodes.length); // A, B, C...
    const newNode: Node = {
      id: `node-${Date.now()}`,
      position: { x: Math.random() * 300 + 50, y: Math.random() * 300 + 50 },
      data: { label: nextId },
      style: { 
        background: 'var(--color-bg-surface)', 
        color: 'var(--color-text-primary)', 
        border: '2px solid var(--color-border)',
        borderRadius: '50%',
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
  };

  const handleDeleteSelected = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter(n => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
    if (selectedEdge) {
      setEdges((eds) => eds.filter(e => e.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
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
          background: 'var(--color-bg-surface)', 
          color: 'var(--color-text-primary)', 
          border: '2px solid var(--color-border)',
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }
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
          if (!newEdges.some(e => e.source === source && e.target === target)) {
            newEdges.push({
              id: `e-${source}-${target}-${uuidv4().slice(0, 4)}`,
              source,
              target,
              label: weighted ? String(Math.floor(Math.random() * 10) + 1) : undefined,
              markerEnd: directed ? { type: MarkerType.ArrowClosed, color: 'var(--color-border)' } : undefined,
              style: { stroke: 'var(--color-border)', strokeWidth: 2 },
              labelStyle: { fill: 'var(--color-text-primary)', fontWeight: 700 },
              labelBgStyle: { fill: 'var(--color-bg-surface-light)' },
            });
          }
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleExport = () => {
    const finalNodes = nodes.map(n => ({ id: n.id, value: String(n.data.label), x: n.position.x, y: n.position.y }));
    const finalEdges = edges.map(e => ({ source: e.source, target: e.target, weight: e.label ? parseInt(String(e.label), 10) : undefined, isDirected: directed }));
    const payload = JSON.stringify({ nodes: finalNodes, edges: finalEdges, directed, weighted }, null, 2);
    
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "algoflow-graph.json";
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
          if (data.nodes && data.edges) {
            setDirected(!!data.directed);
            setWeighted(!!data.weighted);
            setNodes(toReactFlowNodes({ nodes: data.nodes, edges: data.edges }));
            setEdges(toReactFlowEdges({ nodes: data.nodes, edges: data.edges }, !!data.directed, !!data.weighted));
          }
        } catch {
          alert("Invalid graph file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSave = () => {
    const finalNodes = nodes.map(n => ({
      id: n.id,
      value: String(n.data.label),
      x: n.position.x,
      y: n.position.y
    }));
    
    const finalEdges = edges.map(e => ({
      source: e.source,
      target: e.target,
      weight: e.label ? parseInt(String(e.label), 10) : undefined,
      isDirected: directed
    }));

    onSave({ nodes: finalNodes, edges: finalEdges }, directed, weighted);
    onClose();
  };

  // Update edge direction dynamically when toggle changes
  useEffect(() => {
    setEdges((eds) => eds.map(e => ({
      ...e,
      markerEnd: directed ? { type: MarkerType.ArrowClosed, color: 'var(--color-border)' } : undefined
    })));
  }, [directed, setEdges]);

  // Handle properties panel updates
  useEffect(() => {
    if (selectedNode) {
      setNodes((nds) => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: editLabel } } : n));
    }
  }, [editLabel, selectedNode, setNodes]);

  useEffect(() => {
    if (selectedEdge) {
      setEdges((eds) => eds.map(e => e.id === selectedEdge.id ? { ...e, label: editWeight } : e));
    }
  }, [editWeight, selectedEdge, setEdges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-deep/90 backdrop-blur-sm p-4 sm:p-8">
      <div className="flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-border bg-bg-surface shadow-2xl flex-row">
        
        {/* Editor Main Canvas */}
        <div className="relative flex-1 bg-bg-surface-light overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border bg-bg-surface p-4 shrink-0">
            <h2 className="text-lg font-bold">Interactive Graph Editor</h2>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="rounded-lg p-2 text-text-muted hover:bg-bg-surface-light hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => { setSelectedNode(node); setSelectedEdge(null); setEditLabel(String(node.data.label)); }}
              onEdgeClick={(_, edge) => { setSelectedEdge(edge); setSelectedNode(null); setEditWeight(String(edge.label || "")); }}
              onPaneClick={() => { setSelectedNode(null); setSelectedEdge(null); }}
              fitView
              colorMode="dark"
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--color-border)" />
              <Controls className="bg-bg-surface border-border fill-text-primary" />
              <MiniMap className="bg-bg-surface border-border" nodeColor="var(--color-primary)" maskColor="rgba(0,0,0,0.2)" />
            </ReactFlow>
          </div>
        </div>

        {/* Sidebar / Tools */}
        <div className="w-80 border-l border-border bg-bg-surface p-4 overflow-y-auto shrink-0 flex flex-col">
          <div className="mb-6 flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Tools</h3>
            <button onClick={handleAddNode} className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20">
              <Plus className="h-4 w-4" /> Add Vertex
            </button>
            <button onClick={handleDeleteSelected} disabled={!selectedNode && !selectedEdge} className="flex items-center justify-center gap-2 rounded-lg bg-error/10 px-4 py-2 text-sm font-bold text-error transition-colors hover:bg-error/20 disabled:opacity-50">
              <Trash2 className="h-4 w-4" /> Delete Selected
            </button>
            <div className="flex gap-2">
              <button onClick={handleClear} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-2 py-2 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-surface-light">
                <RotateCcw className="h-4 w-4" /> Clear
              </button>
              <button onClick={handleRandomGraph} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-2 py-2 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-surface-light">
                <Dices className="h-4 w-4" /> Random
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={handleImport} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-bg-surface-light px-2 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg-surface-light/80">
                <Upload className="h-4 w-4" /> Import
              </button>
              <button onClick={handleExport} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-bg-surface-light px-2 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg-surface-light/80">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 border-t border-border pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Graph Properties</h3>
            
            <label className="flex items-center justify-between gap-2 text-sm font-medium">
              <span>Directed Graph</span>
              <input 
                type="checkbox" 
                checked={directed}
                onChange={(e) => setDirected(e.target.checked)}
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
                  // Remove labels if unchecked
                  if (!e.target.checked) setEdges(eds => eds.map(edge => ({ ...edge, label: undefined })));
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
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="rounded-lg border border-border bg-bg-surface-light px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
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
                    onChange={(e) => setEditWeight(e.target.value)}
                    disabled={!weighted}
                    className="rounded-lg border border-border bg-bg-surface-light px-3 py-2 text-text-primary focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                </label>
                {!weighted && <p className="text-xs text-warning">Enable &apos;Weighted Edges&apos; above to edit.</p>}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 rounded-lg border border-dashed border-border bg-bg-surface-light/50 text-text-muted text-center p-4">
                <p className="text-xs">Select a node or edge on the canvas to edit its properties.</p>
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-border pt-4">
            <button onClick={handleSave} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark">
              <Save className="h-5 w-5" /> Save Graph & Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
