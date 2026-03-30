"use client";

import { Handle, Position } from "@xyflow/react";
import { Network, Database, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function MapperNode({ data }: { data: any }) {
  const inputs = data?.inputs || [
    { id: "in-1", label: "userPrompt" },
    { id: "in-2", label: "retrievedDocs" }
  ];

  return (
    <Card className="w-80 border-blue-500/50 shadow-md">
      <CardHeader className="bg-muted/30 py-3 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Network className="w-4 h-4 text-blue-500" />
          Data Mapper
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2 relative">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Incoming State</p>
          
          {inputs.map((input: any) => (
            <div key={input.id} className="relative bg-muted/50 p-2 rounded-md text-xs border flex items-center gap-2">
              <Handle 
                type="target" 
                position={Position.Left} 
                id={input.id} 
                className="w-3 h-3 bg-blue-500 border-2 border-background -ml-5" 
              />
              <Database className="w-3 h-3 text-blue-500" />
              <span>{input.label}</span>
            </div>
          ))}
        </div>

        <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />

        <div className="relative bg-blue-500/10 p-2 rounded-md text-xs border border-blue-500/20 flex items-center justify-between">
          <span className="font-semibold text-blue-500">Transformed Schema</span>
          <Database className="w-3 h-3 text-blue-500" />
          <Handle 
            type="source" 
            position={Position.Right} 
            id="output" 
            className="w-3 h-3 bg-blue-500 border-2 border-background -mr-5" 
          />
        </div>
      </CardContent>
    </Card>
  );
}
