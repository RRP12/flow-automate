import { create } from "zustand";
import { FormConfig, Page, Field, FieldType, createNewField } from "../schema/form";
import { nanoid } from "nanoid";

interface FormState {
  form: FormConfig;
  selectedPageId: string | null;
  selectedFieldId: string | null;
  
  // Actions
  setForm: (form: FormConfig) => void;
  selectPage: (id: string | null) => void;
  selectField: (id: string | null) => void;
  
  addPage: () => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  
  addField: (pageId: string, type: FieldType) => void;
  updateField: (pageId: string, fieldId: string, updates: Partial<Field>) => void;
  deleteField: (pageId: string, fieldId: string) => void;
}

const initialForm: FormConfig = {
  id: nanoid(),
  title: "New Form",
  description: "Form description",
  pages: [
    {
      id: nanoid(),
      title: "Page 1",
      description: "",
      fields: [],
    },
  ],
};

export const useFormStore = create<FormState>((set) => ({
  form: initialForm,
  selectedPageId: initialForm.pages[0].id,
  selectedFieldId: null,

  setForm: (form) => set({ form }),
  selectPage: (id) => set({ selectedPageId: id, selectedFieldId: null }),
  selectField: (id) => set({ selectedFieldId: id }),

  addPage: () =>
    set((state) => {
      const newPage: Page = {
        id: nanoid(),
        title: `Page ${state.form.pages.length + 1}`,
        description: "",
        fields: [],
      };
      return {
        form: {
          ...state.form,
          pages: [...state.form.pages, newPage],
        },
        selectedPageId: newPage.id,
        selectedFieldId: null,
      };
    }),

  updatePage: (id, updates) =>
    set((state) => ({
      form: {
        ...state.form,
        pages: state.form.pages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      },
    })),

  deletePage: (id) =>
    set((state) => {
      const remainingPages = state.form.pages.filter((p) => p.id !== id);
      return {
        form: {
          ...state.form,
          pages: remainingPages,
        },
        selectedPageId: remainingPages.length > 0 ? remainingPages[0].id : null,
        selectedFieldId: null,
      };
    }),

  addField: (pageId, type) =>
    set((state) => {
      const newField = createNewField(type);
      return {
        form: {
          ...state.form,
          pages: state.form.pages.map((p) =>
            p.id === pageId
              ? { ...p, fields: [...p.fields, newField] }
              : p
          ),
        },
        selectedFieldId: newField.id,
      };
    }),

  updateField: (pageId, fieldId, updates) =>
    set((state) => ({
      form: {
        ...state.form,
        pages: state.form.pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                fields: p.fields.map((f) =>
                  f.id === fieldId ? { ...f, ...updates } as Field : f
                ),
              }
            : p
        ),
      },
    })),

  deleteField: (pageId, fieldId) =>
    set((state) => ({
      form: {
        ...state.form,
        pages: state.form.pages.map((p) =>
          p.id === pageId
            ? { ...p, fields: p.fields.filter((f) => f.id !== fieldId) }
            : p
        ),
      },
      selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId,
    })),
}));
