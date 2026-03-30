import {
  type InferOutput,
  object,
  string,
  optional,
  literal,
  union,
  intersect,
  record,
  array,
  boolean,
  fallback,
} from "valibot";

// Common field properties
const baseFieldSchema = object({
  id: string(),
  label: string(),
  required: fallback(boolean(), false),
  description: optional(string()),
});

// Operator for rules
const operatorSchema = union([
  literal("equals"),
  literal("not_equals"),
  literal("contains"),
  literal("not_contains"),
  literal("empty"),
  literal("not_empty")
]);

// Rule definition for conditional branching
export const ruleSchema = object({
  id: string(),
  fieldId: string(),    // The field ID this rule depends on
  operator: operatorSchema,
  value: optional(string()), // The value to compare against
});

export type Rule = InferOutput<typeof ruleSchema>;

// Text Field
const textFieldSchema = intersect([
  baseFieldSchema,
  object({
    type: literal("text"),
    placeholder: optional(string()),
    rules: optional(array(ruleSchema), []),
  }),
]);

// Textarea Field
const textareaFieldSchema = intersect([
  baseFieldSchema,
  object({
    type: literal("textarea"),
    placeholder: optional(string()),
    rules: optional(array(ruleSchema), []),
  }),
]);

// Option for Select/Radio
export const optionSchema = object({
  id: string(),
  label: string(),
  value: string(),
});

export type FieldOption = InferOutput<typeof optionSchema>;

// Select/Dropdown Field
const selectFieldSchema = intersect([
  baseFieldSchema,
  object({
    type: literal("select"),
    placeholder: optional(string()),
    options: array(optionSchema),
    rules: optional(array(ruleSchema), []),
  }),
]);

// Radio Group Field
const radioFieldSchema = intersect([
  baseFieldSchema,
  object({
    type: literal("radio"),
    options: array(optionSchema),
    rules: optional(array(ruleSchema), []),
  }),
]);

// All supported field types
export const fieldSchema = union([
  textFieldSchema,
  textareaFieldSchema,
  selectFieldSchema,
  radioFieldSchema,
]);

export type Field = InferOutput<typeof fieldSchema>;
export type FieldType = Field["type"];

// Page Schema
export const pageSchema = object({
  id: string(),
  title: string(),
  description: optional(string()),
  fields: array(fieldSchema),
});

export type Page = InferOutput<typeof pageSchema>;

// Overall Form Schema
export const formSchema = object({
  id: string(),
  title: string(),
  description: optional(string()),
  pages: array(pageSchema),
});

export type FormConfig = InferOutput<typeof formSchema>;

// Helper to create new fields
import { nanoid } from "nanoid";

export const createNewField = (type: FieldType): Field => {
  const base = {
    id: nanoid(),
    label: `New ${type} field`,
    required: false,
    rules: [],
  };

  switch (type) {
    case "text":
      return { ...base, type: "text", placeholder: "" };
    case "textarea":
      return { ...base, type: "textarea", placeholder: "" };
    case "select":
    case "radio":
      return {
        ...base,
        type,
        options: [
          { id: nanoid(), label: "Option 1", value: "option_1" },
          { id: nanoid(), label: "Option 2", value: "option_2" },
        ],
      };
  }
};
