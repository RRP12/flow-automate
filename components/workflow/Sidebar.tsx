"use client";

import { BrainCircuit, Link2, Download, Play, Terminal } from "lucide-react";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { executeGraph } from "@/lib/WorkflowSDK";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const nodes = useWorkflowStore(state => state.nodes);
  const edges = useWorkflowStore(state => state.edges);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleRunGraph = async () => {
    setIsExecuting(true);
    setShowLogs(true);
    setLogs(["Initializing SDK Engine..."]);
    
    // Slight artificial delay for UX
    await new Promise(r => setTimeout(r, 400));
    
    const result = await executeGraph(nodes, edges);
    setLogs(result.logs);
    setIsExecuting(false);
  };

  return (
    <>
      <aside className="w-64 border-r bg-muted/20 flex flex-col h-full shrink-0">
        <div className="p-4 border-b font-semibold text-lg flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-500" />
          LangGraph Editor
        </div>
        
        <div className="flex-1 p-4 flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Drag Nodes</h3>
            <div className="grid gap-2">
              <div 
                className="border bg-background p-2 rounded-md text-sm flex items-center gap-2 cursor-grab hover:border-primary transition-colors"
                onDragStart={(event) => onDragStart(event, "mapper")}
                draggable
              >
                <Link2 className="w-4 h-4 text-emerald-500" />
                Data Mapper
              </div>
              <div 
                className="border bg-background p-2 rounded-md text-sm flex items-center gap-2 cursor-grab hover:border-primary transition-colors"
                onDragStart={(event) => onDragStart(event, "agent")}
                draggable
              >
                <BrainCircuit className="w-4 h-4 text-indigo-500" />
                Agent Node
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex flex-col gap-2">
          <button className="w-full bg-secondary text-secondary-foreground p-2 rounded-md font-semibold text-sm flex justify-center items-center gap-2 hover:bg-secondary/80 outline outline-1 outline-border transition-colors">
            <Download className="w-4 h-4" /> Export SDK
          </button>
          <button 
            onClick={handleRunGraph}
            disabled={isExecuting}
            className="w-full bg-primary text-primary-foreground p-2 rounded-md font-semibold text-sm flex justify-center items-center gap-2 hover:bg-primary/90 transition-all shadow-sm"
          >
            {isExecuting ? (
              <span className="animate-pulse">Compiling...</span>
            ) : (
              <>
                <Play className="w-4 h-4" /> Run Graph
              </>
            )}
          </button>
        </div>
      </aside>

      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-zinc-100 font-mono text-sm">
              <Terminal className="w-4 h-4 text-emerald-500" />
              Execution Terminal
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-md border border-zinc-800 bg-black/50 p-4 font-mono text-xs mt-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="flex flex-col gap-1.5">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 text-zinc-300">
                    <span className="text-zinc-600 shrink-0 select-none">[{i.toString().padStart(2, '0')}]</span>
                    <span className={log.includes('Error') ? 'text-red-400' : log.includes('Executing') ? 'text-blue-400' : 'text-zinc-300 whitespace-pre-wrap'}>
                      {log}
                    </span>
                  </div>
                ))}
                {isExecuting && (
                  <div className="flex gap-3 text-zinc-500">
                    <span className="shrink-0">[-]</span>
                    <span className="animate-pulse">Processing nodes...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
