"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { FormulaResult } from "@/lib/types";
import { saveFormulaToClient, getClients } from "@/lib/clientStorage";

interface Props {
  formula: FormulaResult;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function SaveFormulaModal({
  formula,
  open,
  onClose,
  onSaved,
}: Props) {
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setClientName("");
      setNotes("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleNameChange = (val: string) => {
    setClientName(val);
    if (val.trim().length > 0) {
      const clients = getClients();
      const matches = clients
        .filter((c) => c.name.toLowerCase().includes(val.toLowerCase()))
        .map((c) => c.name)
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSave = () => {
    if (!clientName.trim()) return;
    saveFormulaToClient(clientName, formula, notes);
    onSaved();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-zinc-600" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  שמירה ללקוחה
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  שם לקוחה
                </Label>
                <input
                  ref={inputRef}
                  type="text"
                  value={clientName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="הכניסי שם לקוחה..."
                  className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 text-zinc-800 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-300 transition-all text-base"
                />
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setClientName(s);
                          setSuggestions([]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-100 text-xs font-medium text-zinc-600 hover:bg-zinc-200 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  הערות
                  <span className="ms-1 normal-case tracking-normal text-zinc-300">
                    (לא חובה)
                  </span>
                </Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="מצב השיער, התאמות גוון..."
                  rows={3}
                  className="w-full py-3 px-4 rounded-2xl bg-zinc-100 text-zinc-800 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-300 transition-all text-sm resize-none"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={!clientName.trim()}
                className="w-full h-13 rounded-2xl text-base font-semibold bg-zinc-900 hover:bg-zinc-800 transition-all disabled:opacity-40"
              >
                <Check className="w-5 h-5 me-2" />
                שמור פורמולה
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
