"use client";

import { useFormStore } from "@/store/useFormStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, LayoutTemplate, Type, AlignLeft, List, CircleDot } from "lucide-react";
import { FieldType } from "@/schema/form";

export function Sidebar() {
  const { form, selectedPageId, selectPage, addPage, addField } = useFormStore();

  const handleAddField = (type: FieldType) => {
    if (selectedPageId) {
      addField(selectedPageId, type);
    }
  };

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5" />
          Pages
        </h2>
      </div>
      <ScrollArea className="flex-1 border-b">
        <div className="p-4 space-y-2">
          {form.pages.map((page, idx) => (
            <Button
              key={page.id}
              variant={selectedPageId === page.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left font-normal"
              onClick={() => selectPage(page.id)}
            >
              Page {idx + 1}: {page.title || "Untitled"}
            </Button>
          ))}
          <Button variant="outline" className="w-full mt-2" onClick={addPage}>
            <Plus className="w-4 h-4 mr-2" />
            Add Page
          </Button>
        </div>
      </ScrollArea>

      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm text-muted-foreground mb-4">Add Field</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 items-center gap-2"
            disabled={!selectedPageId}
            onClick={() => handleAddField("text")}
          >
            <Type className="w-5 h-5" />
            <span className="text-xs">Text</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 items-center gap-2"
            disabled={!selectedPageId}
            onClick={() => handleAddField("textarea")}
          >
            <AlignLeft className="w-5 h-5" />
            <span className="text-xs">Textarea</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 items-center gap-2"
            disabled={!selectedPageId}
            onClick={() => handleAddField("select")}
          >
            <List className="w-5 h-5" />
            <span className="text-xs">Select</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 items-center gap-2"
            disabled={!selectedPageId}
            onClick={() => handleAddField("radio")}
          >
            <CircleDot className="w-5 h-5" />
            <span className="text-xs">Radio</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
