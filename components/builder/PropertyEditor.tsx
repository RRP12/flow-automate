"use client";

import { useFormStore } from "@/store/useFormStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ShieldAlert } from "lucide-react";
import { nanoid } from "nanoid";
import { Rule, FieldOption } from "@/schema/form";

export function PropertyEditor() {
  const { form, selectedPageId, selectedFieldId, updatePage, updateField } = useFormStore();

  const page = form.pages.find((p) => p.id === selectedPageId);
  const field = page?.fields.find((f) => f.id === selectedFieldId);

  if (!page) {
    return <div className="w-80 border-l bg-card p-6 text-muted-foreground text-center">No page selected</div>;
  }

  // Editing Page Properties
  if (!field) {
    return (
      <div className="w-80 border-l bg-card flex flex-col h-full">
        <div className="p-4 border-b font-medium">Page Properties</div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={page.title || ""}
                onChange={(e) => updatePage(page.id, { title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={page.description || ""}
                onChange={(e) => updatePage(page.id, { description: e.target.value })}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  const handleUpdate = (key: string, value: any) => {
    updateField(page.id, field.id, { [key]: value });
  };

  const addOption = () => {
    if ("options" in field) {
      const newOption = { id: nanoid(), label: `Option ${(field.options?.length || 0) + 1}`, value: `option_${nanoid(4)}` };
      handleUpdate("options", [...(field.options || []), newOption]);
    }
  };

  const updateOption = (id: string, updates: Partial<FieldOption>) => {
    if ("options" in field) {
      handleUpdate(
        "options",
        field.options?.map((opt) => (opt.id === id ? { ...opt, ...updates } : opt))
      );
    }
  };

  const deleteOption = (id: string) => {
    if ("options" in field) {
      handleUpdate(
        "options",
        field.options?.filter((opt) => opt.id !== id)
      );
    }
  };

  const addRule = () => {
    const newRule: Rule = { id: nanoid(), fieldId: "", operator: "equals", value: "" };
    handleUpdate("rules", [...(field.rules || []), newRule]);
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    handleUpdate(
      "rules",
      field.rules?.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  const deleteRule = (id: string) => {
    handleUpdate(
      "rules",
      field.rules?.filter((rule) => rule.id !== id)
    );
  };

  const otherFields = page.fields.filter(f => f.id !== field.id);

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full">
      <div className="p-4 border-b font-medium flex justify-between items-center">
        <span>Field Properties</span>
        <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground uppercase">{field.type}</span>
      </div>
      <ScrollArea className="flex-1 p-4 space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4 pb-6 border-b">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input value={field.label || ""} onChange={(e) => handleUpdate("label", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={field.description || ""} onChange={(e) => handleUpdate("description", e.target.value)} />
          </div>
          {("placeholder" in field) && (
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input value={field.placeholder || ""} onChange={(e) => handleUpdate("placeholder", e.target.value)} />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label>Required</Label>
            <Switch checked={field.required} onCheckedChange={(c) => handleUpdate("required", c)} />
          </div>
        </div>

        {/* Options Editor for Select / Radio */}
        {("options" in field) && (
          <div className="space-y-4 pb-6 border-b pt-4">
            <div className="flex justify-between items-center mb-2">
              <Label>Options</Label>
              <Button size="sm" variant="outline" onClick={addOption} className="h-7 text-xs">
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            {field.options?.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2 mb-2">
                <Input className="h-8 text-sm" value={opt.label} onChange={(e) => updateOption(opt.id, { label: e.target.value })} placeholder="Label" />
                <Input className="h-8 text-sm" value={opt.value} onChange={(e) => updateOption(opt.id, { value: e.target.value })} placeholder="Value" />
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive shrink-0" onClick={() => deleteOption(opt.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Conditional Logic Rules */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <Label className="flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Visibility Rules</Label>
            <Button size="sm" variant="outline" onClick={addRule} className="h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>
          {(!field.rules || field.rules.length === 0) && (
            <p className="text-xs text-muted-foreground">Always visible. Add rules to conditionally show this field.</p>
          )}
          {field.rules?.map((rule) => (
            <div key={rule.id} className="p-3 bg-muted/50 border rounded-md relative space-y-3">
              <Button size="icon" variant="ghost" className="h-6 w-6 absolute right-1 top-1 text-muted-foreground hover:text-destructive" onClick={() => deleteRule(rule.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
              <div className="pr-6">
                <Label className="text-xs mb-1 block text-muted-foreground">Depends on</Label>
                <Select value={rule.fieldId} onValueChange={(val) => val && updateRule(rule.id, { fieldId: val })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherFields.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs mb-1 block text-muted-foreground">Condition</Label>
                  <Select value={rule.operator} onValueChange={(val: any) => updateRule(rule.id, { operator: val })}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="not_contains">Not contains</SelectItem>
                      <SelectItem value="empty">Is empty</SelectItem>
                      <SelectItem value="not_empty">Is not empty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {rule.operator !== 'empty' && rule.operator !== 'not_empty' && (
                  <div>
                    <Label className="text-xs mb-1 block text-muted-foreground">Value</Label>
                    <Input className="h-8 text-xs" value={rule.value || ""} onChange={(e) => updateRule(rule.id, { value: e.target.value })} placeholder="Target value..." />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
