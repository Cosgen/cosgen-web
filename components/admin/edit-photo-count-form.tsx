"use client";

import React, { useState } from "react";
import { Edit2, Check, X } from "lucide-react";

interface EditPhotoCountFormProps {
  currentPhotoCount: number;
  onSave: (newCount: number) => void;
}

export function EditPhotoCountForm({
  currentPhotoCount,
  onSave,
}: EditPhotoCountFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [count, setCount] = useState<number>(currentPhotoCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count < 1) {
      alert("Jumlah foto minimal 1.");
      return;
    }
    onSave(count);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-700">
          Jumlah Foto: <strong>{currentPhotoCount} Foto</strong>
        </span>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-2xs"
        >
          <Edit2 className="w-3.5 h-3.5 text-blue-600" /> Edit Jumlah Foto
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label className="text-xs font-semibold text-slate-700">Ubah Jumlah Foto:</label>
      <input
        type="number"
        min="1"
        max="100"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
      />
      <button
        type="submit"
        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
        title="Simpan"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          setCount(currentPhotoCount);
          setIsEditing(false);
        }}
        className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs"
        title="Batal"
      >
        <X className="w-4 h-4" />
      </button>
    </form>
  );
}
