"use client";

import { useState } from "react";
import { useFormStore } from "@/store/useFormStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Rule, Field } from "@/schema/form";

export function FormPreview() {
  const { form } = useFormStore();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  // Evaluate rule against the current responses
  const evaluateRule = (rule: Rule): boolean => {
    const dependentValue = responses[rule.fieldId];
    
    switch (rule.operator) {
      case "equals":
        return dependentValue === rule.value;
      case "not_equals":
        return dependentValue !== rule.value;
      case "contains":
        return dependentValue && typeof dependentValue === 'string' && dependentValue.includes(rule.value || "");
      case "not_contains":
        return !dependentValue || typeof dependentValue !== 'string' || !dependentValue.includes(rule.value || "");
      case "empty":
        return !dependentValue || dependentValue === "";
      case "not_empty":
        return !!dependentValue && dependentValue !== "";
      default:
        return false;
    }
  };

  const isFieldVisible = (field: Field): boolean => {
    if (!field.rules || field.rules.length === 0) return true;
    // AND logic: all rules must be true for the field to be visible
    return field.rules.every(evaluateRule);
  };

  const handleResponse = (fieldId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  if (!form || form.pages.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No pages to preview.</div>;
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-600">Form Submitted Successfully!</h2>
        <pre className="bg-muted p-4 rounded-md text-left text-sm overflow-auto text-foreground mt-4">
          {JSON.stringify(responses, null, 2)}
        </pre>
        <Button onClick={() => { setSubmitted(false); setResponses({}); setCurrentPageIndex(0); }}>
          Submit Another
        </Button>
      </div>
    );
  }

  const page = form.pages[currentPageIndex];
  const visibleFields = page.fields.filter(isFieldVisible);

  const renderField = (field: Field) => {
    const value = responses[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <Input 
            value={value} 
            onChange={(e) => handleResponse(field.id, e.target.value)} 
            placeholder={field.placeholder} 
          />
        );
      case "textarea":
        return (
          <Textarea 
            value={value} 
            onChange={(e) => handleResponse(field.id, e.target.value)} 
            placeholder={field.placeholder} 
          />
        );
      case "select":
        return (
          <Select value={value} onValueChange={(v) => handleResponse(field.id, v)}>
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
          <RadioGroup value={value} onValueChange={(v) => handleResponse(field.id, v)}>
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

  const isFormValid = visibleFields.every(field => {
    if (field.required) {
      const val = responses[field.id];
      return val !== undefined && val !== null && val !== "";
    }
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{form.title || "Preview Form"}</h1>
        {form.description && <p className="text-lg text-muted-foreground">{form.description}</p>}
      </div>

      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{page.title}</CardTitle>
              {page.description && <CardDescription className="mt-2 text-base">{page.description}</CardDescription>}
            </div>
            <span className="text-sm font-medium text-muted-foreground bg-background px-3 py-1 rounded-full border">
              Step {currentPageIndex + 1} of {form.pages.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {visibleFields.length === 0 ? (
            <p className="text-muted-foreground italic">No fields visible on this page.</p>
          ) : (
            visibleFields.map((field) => (
              <div key={field.id} className="space-y-3 p-1">
                <Label className="text-base font-medium flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
                <div className="mt-1">{renderField(field)}</div>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/10 p-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
            disabled={currentPageIndex === 0}
          >
            Previous
          </Button>
          
          {currentPageIndex === form.pages.length - 1 ? (
            <Button onClick={() => setSubmitted(true)} disabled={!isFormValid}>
              Submit
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentPageIndex((p) => Math.min(form.pages.length - 1, p + 1))}
              disabled={!isFormValid}
            >
              Next Page
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Real-time State Viewer for debugging/wow factor */}
      <div className="mt-12 p-4 border rounded-lg bg-zinc-950 text-zinc-300 font-mono text-xs overflow-auto">
        <div className="mb-2 text-zinc-500 font-semibold uppercase tracking-wider">Internal State Engine (Real-time)</div>
        {JSON.stringify(responses, null, 2)}
      </div>
    </div>
  );
}
