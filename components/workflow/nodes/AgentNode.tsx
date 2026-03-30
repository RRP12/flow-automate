"use client";

import { BrainCircuit, Wrench, Settings } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

export function AgentNode({ data }: { data: any }) {
  const agentName = data?.agentName || "Research Agent";
  const skills = data?.skills || ["WebSearch", "ReadNotion"];

  return (
    <div className="w-80 border-2 border-indigo-500 shadow-lg rounded-xl bg-card">
      <Handle 
        type="target" 
        position={Position.Left} 
        id="trigger" 
        className="w-3 h-3 bg-indigo-500 border-2 border-background" 
      />
      <div className="bg-indigo-500/10 p-3 rounded-t-xl border-b border-indigo-500/20 flex items-center justify-between group cursor-pointer hover:bg-indigo-500/20 transition-colors">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-500" />
          <span className="font-bold text-indigo-100">{agentName}</span>
        </div>
        <div className="flex gap-2 items-center">
            <Settings className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] uppercase font-bold text-indigo-400">LLM Mode</span>
        </div>
      </div>
      
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-2">Equipped MCP Skills:</p>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill: string) => (
            <div key={skill} className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-100 transition-colors">
              <Wrench className="w-3 h-3 text-emerald-400" />
              {skill}
            </div>
          ))}
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        id="next" 
        className="w-3 h-3 bg-indigo-500 border-2 border-background" 
      />
    </div>
  );
}
