"use client";

import { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MapperNode } from "./nodes/MapperNode";
import { AgentNode } from "./nodes/AgentNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

const nodeTypes = {
  mapper: MapperNode,
  agent: AgentNode,
};

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const nodes = useWorkflowStore((state: any) => state.nodes);
  const edges = useWorkflowStore((state: any) => state.edges);
  const onNodesChange = useWorkflowStore((state: any) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state: any) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state: any) => state.onConnect);
  const addNode = useWorkflowStore((state: any) => state.addNode);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type as "agent" | "mapper", position);
    },
    [screenToFlowPosition, addNode],
  );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
