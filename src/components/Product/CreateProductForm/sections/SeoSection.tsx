"use client";

import { Input } from "@/components/ui/Input";
import { FormType } from "../types";

type Props = {
  form: FormType;
  errors: Record<string, string>;
  onFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
};

export function SeoSection({ form, errors, onFormChange }: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
        SEO Settings
      </h2>
      <div className="grid md:grid-cols-2 gap-6 p-8 bg-gray-50/50 rounded-2xl border border-gray-100">
        <Input
          name="metaTitle"
          label="Meta Title"
          value={form.metaTitle}
          onChange={onFormChange}
          error={errors.metaTitle}
        />
        <Input
          name="metaDescription"
          label="Meta Description"
          value={form.metaDescription}
          onChange={onFormChange}
          error={errors.metaDescription}
        />
      </div>
    </section>
  );
}
