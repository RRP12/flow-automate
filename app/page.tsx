"use client";

import { BuilderWorkspace } from "@/components/builder/BuilderWorkspace";
import { FormPreview } from "@/components/preview/FormPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormStore } from "@/store/useFormStore";
import { Button } from "@/components/ui/button";
import { Save, Code2, Eye, PenTool } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Home() {
  const { form } = useFormStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Mock API call to simulate saving the configuration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log("Saved deeply nested executable JSON Schema:", JSON.stringify(form, null, 2));
    setShowJson(true);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Code2 className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Form Engine</h1>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground ml-2">Beta</span>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="shadow-sm transition-all shadow-primary/20 hover:shadow-primary/40"
          >
            {isSaving ? (
              <span className="animate-pulse">Saving Config...</span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save & Export Config
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="builder" className="h-full flex flex-col">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50">
              <TabsTrigger value="builder" className="rounded-md data-[state=active]:shadow-sm">
                <PenTool className="w-4 h-4 mr-2" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="preview" className="rounded-md data-[state=active]:shadow-sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="builder" className="flex-1 mt-0 outline-none">
            <BuilderWorkspace />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 mt-0 outline-none">
            <FormPreview />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showJson} onOpenChange={setShowJson}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Saved Configuration Schema</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto rounded-md bg-zinc-950 p-4 border relative">
            <div className="absolute top-2 right-4 text-xs text-zinc-500 font-mono">JSON Generated from Builder</div>
            <pre className="text-xs text-zinc-300 font-mono mt-4">
              {JSON.stringify(form, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
