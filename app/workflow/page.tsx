"use client";

import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { Sidebar } from "@/components/workflow/Sidebar";

export default function WorkflowPage() {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 relative">
        <WorkflowCanvas />
      </main>
    </div>
  );
}
