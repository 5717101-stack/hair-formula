"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Users, FlaskConical, ArrowLeft } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FormulaCards from "@/components/FormulaCards";
import SaveFormulaModal from "@/components/SaveFormulaModal";
import ClientHistory from "@/components/ClientHistory";
import { calculateFormula } from "@/lib/colorCalculator";
import type { ConsultationInput, FormulaResult } from "@/lib/types";

type Tab = "formula" | "clients";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("formula");
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [clientKey, setClientKey] = useState(0);

  const handleCalculate = useCallback((input: ConsultationInput) => {
    const formula = calculateFormula(input);
    setResult(formula);
  }, []);

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200/60">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center">
              <Scissors className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">
                Hair Formula
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                L&apos;Or&eacute;al Professional
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 pb-28">
        <AnimatePresence mode="wait">
          {activeTab === "formula" ? (
            result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Consultation
                </button>
                <FormulaCards
                  result={result}
                  onSave={() => setShowSaveModal(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ConsultationForm onCalculate={handleCalculate} />
              </motion.div>
            )
          ) : (
            <motion.div
              key="clients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ClientHistory key={clientKey} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-zinc-200/60">
        <div className="max-w-lg mx-auto flex">
          <button
            onClick={() => {
              setActiveTab("formula");
            }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "formula"
                ? "text-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <FlaskConical
              className={`w-5 h-5 ${
                activeTab === "formula" ? "stroke-[2.5]" : ""
              }`}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Formula
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("clients");
              setClientKey((k) => k + 1);
            }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "clients"
                ? "text-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <Users
              className={`w-5 h-5 ${
                activeTab === "clients" ? "stroke-[2.5]" : ""
              }`}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Clients
            </span>
          </button>
        </div>
        {/* Safe area padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* Save Modal */}
      {result && (
        <SaveFormulaModal
          formula={result}
          open={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSaved={() => setClientKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
