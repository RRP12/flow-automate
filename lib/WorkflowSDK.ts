import { Edge, Node } from "@xyflow/react";

export type ExecutionState = Record<string, any>;

/**
 * Parses double-curly expressions like `{{ user.name }}` against the current state.
 */
export function resolveExpressions(text: string, state: ExecutionState): string {
  if (typeof text !== "string") return text;
  
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
    return path.split('.').reduce((acc: any, part: string) => acc && acc[part], state) || "";
  });
}

/**
 * Topologically sorts nodes in a React Flow graph for sequential execution.
 */
function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  const inDegree: Record<string, number> = {};
  const graph: Record<string, string[]> = {};

  nodes.forEach(n => {
    inDegree[n.id] = 0;
    graph[n.id] = [];
  });

  edges.forEach(e => {
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    graph[e.source].push(e.target);
  });

  const queue: string[] = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const sorted: Node[] = [];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const node = nodes.find(n => n.id === currentId);
    if (node) sorted.push(node);

    graph[currentId].forEach(neighborId => {
      inDegree[neighborId]--;
      if (inDegree[neighborId] === 0) {
        queue.push(neighborId);
      }
    });
  }

  // Handle cycles or detached nodes gracefully by ensuring all nodes are returned eventually
  if (sorted.length !== nodes.length) {
    console.warn("Graph contains cycles or disconnected clusters. Execution may be unpredictable.");
    const missing = nodes.filter(n => !sorted.find(s => s.id === n.id));
    return [...sorted, ...missing];
  }

  return sorted;
}

/**
 * Simulates a LangGraph execution tick cycle across sorted nodes.
 */
export async function executeGraph(nodes: Node[], edges: Edge[], initialState: ExecutionState = {}) {
  const sortedNodes = topologicalSort(nodes, edges);
  let currentState = { ...initialState };
  const executionLogs: string[] = [];
  
  executionLogs.push(`Starting Graph Execution Pipeline... [Found ${nodes.length} nodes]`);
  
  for (const node of sortedNodes) {
    executionLogs.push(`Executing Node [${node.type}]: ${node.id}`);
    
    if (node.type === "mapper") {
      // Simulate data transformation mappings
      const inputs = (node.data.inputs as any[]) || [];
      const mappingResult: any = {};
      
      inputs.forEach(input => {
        // Resolve mapped bindings against current accumulated state
        mappingResult[input.id] = resolveExpressions(input.label || "", currentState);
      });
      
      currentState = { ...currentState, [node.id]: mappingResult };
      executionLogs.push(`  ↳ Transformed State: ${JSON.stringify(mappingResult)}`);
    } 
    else if (node.type === "agent") {
      // Simulate specialized Agent processing
      const agentName = node.data.agentName || "Agent";
      const skills = (node.data.skills as string[]) || [];
      
      executionLogs.push(`  ↳ Accessing Agent "${agentName}" equipped with skills: [${skills.join(", ")}]`);
      
      // Agent injects results into state
      currentState = { 
        ...currentState, 
        [node.id]: { 
          result: `Output from ${agentName}`,
          invokedSkills: skills 
        } 
      };
      
      // Artificial delay to mimic LLM inference latency
      await new Promise(r => setTimeout(r, 800));
    }
  }

  executionLogs.push("Graph Execution Complete.");
  return { finalState: currentState, logs: executionLogs };
}
