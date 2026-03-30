"use client";

import { useFormStore } from "@/store/useFormStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/schema/form";

export function Canvas() {
  const { form, selectedPageId, selectedFieldId, selectField, deleteField } = useFormStore();

  const page = form.pages.find((p) => p.id === selectedPageId);

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select or add a page to start building.
      </div>
    );
  }

  const renderFieldMockup = (field: Field) => {
    switch (field.type) {
      case "text":
        return <Input disabled placeholder={field.placeholder || "Text input"} />;
      case "textarea":
        return <Textarea disabled placeholder={field.placeholder || "Text area"} />;
      case "select":
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select option..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radio":
        return (
          <RadioGroup disabled>
            {field.options?.map((opt) => (
              <div key={opt.id} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`radio-${opt.id}`} />
                <Label htmlFor={`radio-${opt.id}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 pb-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{page.title || "Untitled Page"}</h1>
        {page.description && <p className="text-muted-foreground">{page.description}</p>}
      </div>

      {page.fields.length === 0 ? (
        <Card className="border-dashed shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>This page is empty.</p>
            <p className="text-sm">Click the buttons on the left to add fields.</p>
          </CardContent>
        </Card>
      ) : (
        page.fields.map((field) => {
          const isSelected = selectedFieldId === field.id;
          return (
            <Card
              key={field.id}
              className={`cursor-pointer transition-all hover:border-primary/50 relative group ${
                isSelected ? "border-primary shadow-sm" : "shadow-none"
              }`}
              onClick={() => selectField(field.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {field.label}
                      {field.required && <span className="text-red-500 text-sm">*</span>}
                    </CardTitle>
                    {field.description && (
                      <CardDescription className="mt-1.5">{field.description}</CardDescription>
                    )}
                  </div>
                  {isSelected && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteField(page.id, field.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>{renderFieldMockup(field)}</CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
