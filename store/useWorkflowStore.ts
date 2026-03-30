import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { nanoid } from "nanoid";

export type AppNode = Node;

type WorkflowState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: "agent" | "mapper", position: { x: number; y: number }) => void;
};

const initialNodes: AppNode[] = [
  { id: "1", type: "agent", position: { x: 50, y: 50 }, data: { agentName: "Researcher", skills: ["WebSearch", "ReadDocs"] } },
  { id: "2", type: "mapper", position: { x: 450, y: 50 }, data: { inputs: [{ id: "res", label: "Research Data" }] } },
];
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", sourceHandle: "next", targetHandle: "res", animated: true },
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, animated: true }, get().edges),
    });
  },
  addNode: (type, position) => {
    const newNode: AppNode = {
      id: nanoid(),
      type,
      position,
      data: type === "agent" 
        ? { agentName: "New Agent", skills: [] }
        : { inputs: [{ id: "in-1", label: "Input 1" }] }
    };
    set({ nodes: [...get().nodes, newNode] });
  }
}));
