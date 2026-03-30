"use client";

import { useFormStore } from "@/store/useFormStore";
import { Sidebar } from "./Sidebar";
import { Canvas } from "./Canvas";
import { PropertyEditor } from "./PropertyEditor";

export function BuilderWorkspace() {
  const { form } = useFormStore();

  return (
    <div className="flex h-full min-h-[800px] border rounded-lg overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 border-l border-r overflow-auto bg-muted/20">
        <Canvas />
      </div>
      <PropertyEditor />
    </div>
  );
}
