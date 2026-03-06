"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Trash2,
  Clock,
  User,
  Search,
  ArrowRight,
  FlaskConical,
  Droplets,
  Sun,
  FileText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Client, ClientVisit } from "@/lib/types";
import { getClients, deleteClient, deleteVisit } from "@/lib/clientStorage";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getVisitSummary(formula: ClientVisit["formula"]): string {
  const st = formula.serviceType || "majirel";
  if (st === "highLift" && formula.highLift) return `High Lift · ${formula.highLift.shade}`;
  if (st === "bleach" && formula.bleach) return `הבהרה · ${formula.bleach.productNameHe || formula.bleach.product}`;
  if (formula.roots) return `${formula.roots.colorLine} · ${formula.roots.targetShade}`;
  return "פורמולה";
}

function FormulaGrid({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-y-1 text-xs">
      {rows.map((r, i) => (
        <div key={i} className="contents">
          <span className="font-medium text-zinc-700 text-start">{r.value}</span>
          <span className="text-zinc-400 text-end">{r.label}</span>
        </div>
      ))}
    </div>
  );
}

function VisitCard({
  visit,
  onDelete,
}: {
  visit: ClientVisit;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { formula } = visit;
  const st = formula.serviceType || "majirel";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-right"
      >
        <ChevronLeft
          className={`w-4 h-4 text-zinc-400 transition-transform flex-shrink-0 ${
            expanded ? "-rotate-90" : ""
          }`}
        />
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0 text-end">
            <p className="text-sm font-semibold text-zinc-800">
              {formatDate(visit.date)}
            </p>
            <p className="text-xs text-zinc-400 truncate">
              {getVisitSummary(formula)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <Separator />

              {/* Majirel Roots */}
              {st === "majirel" && formula.roots && (
                <div className="p-3 bg-rose-50/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 justify-end">
                    שורשים — Zone 1
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <FormulaGrid rows={[
                    { label: "גוון", value: formula.roots.targetShade },
                    ...(formula.roots.baseShade ? [{ label: "בסיס", value: formula.roots.baseShade }] : []),
                    { label: "מפתח", value: formula.roots.developerVolume },
                    { label: "יחס", value: formula.roots.mixingRatio },
                    { label: "זמן", value: formula.roots.processingTime },
                  ]} />
                </div>
              )}

              {/* High Lift */}
              {st === "highLift" && formula.highLift && (
                <div className="p-3 bg-amber-50/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 justify-end">
                    High Lift
                    <FlaskConical className="w-3.5 h-3.5" />
                  </div>
                  <FormulaGrid rows={[
                    { label: "גוון", value: `${formula.highLift.shade} — ${formula.highLift.shadeNameHe}` },
                    { label: "מפתח", value: formula.highLift.developerVolume },
                    { label: "יחס", value: formula.highLift.mixingRatio },
                    { label: "זמן", value: formula.highLift.processingTime },
                  ]} />
                </div>
              )}

              {/* Bleach */}
              {st === "bleach" && formula.bleach && (
                <div className="p-3 bg-yellow-50/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700 justify-end">
                    הבהרה — {formula.bleach.techniqueHe}
                    <FlaskConical className="w-3.5 h-3.5" />
                  </div>
                  <FormulaGrid rows={[
                    { label: "מוצר", value: formula.bleach.productNameHe || formula.bleach.product },
                    { label: "מפתח", value: formula.bleach.developerVolume },
                    { label: "יחס", value: formula.bleach.mixingRatio },
                    { label: "זמן", value: formula.bleach.processingTime },
                  ]} />
                </div>
              )}

              {/* Toner */}
              {st === "bleach" && formula.toner && (
                <div className="p-3 bg-violet-50/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 justify-end">
                    שטיפה — {formula.toner.productLine}
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <FormulaGrid rows={[
                    { label: "גוון", value: formula.toner.shade },
                    { label: "מפתח", value: formula.toner.developerVolume },
                    { label: "יחס", value: formula.toner.mixingRatio },
                    { label: "זמן", value: formula.toner.processingTime },
                  ]} />
                </div>
              )}

              {/* Ends (Majirel and High Lift) */}
              {(st === "majirel" || st === "highLift") && formula.ends && (
                <div className="p-3 bg-emerald-50/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 justify-end">
                    אורכים — Zones 2 & 3
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <FormulaGrid rows={[
                    { label: "מוצר", value: formula.ends.productLine },
                    { label: "גוון", value: formula.ends.refreshShade },
                    { label: "מפתח", value: formula.ends.developerVolume },
                    { label: "יחס", value: formula.ends.mixingRatio },
                    { label: "זמן", value: formula.ends.processingTime },
                  ]} />
                </div>
              )}

              {visit.notes && (
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-1 justify-end">
                    הערות
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed text-end">
                    {visit.notes}
                  </p>
                </div>
              )}

              <button
                onClick={onDelete}
                className="flex items-center gap-2 text-xs text-red-400 hover:text-red-600 transition-colors pt-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                מחק ביקור
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ClientHistory() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    setClients(getClients());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    if (selectedClient?.id === id) setSelectedClient(null);
    refresh();
  };

  const handleDeleteVisit = (clientId: string, visitId: string) => {
    deleteVisit(clientId, visitId);
    refresh();
    const updated = getClients().find((c) => c.id === clientId);
    if (updated) {
      setSelectedClient(updated);
    } else {
      setSelectedClient(null);
    }
  };

  if (selectedClient) {
    const freshClient = clients.find((c) => c.id === selectedClient.id);
    if (!freshClient) {
      setSelectedClient(null);
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-5"
      >
        <button
          onClick={() => setSelectedClient(null)}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          כל הלקוחות
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleDeleteClient(freshClient.id)}
            className="p-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 text-end">
                {freshClient.name}
              </h2>
              <p className="text-xs text-zinc-400 text-end">
                {freshClient.visits.length} ביקור
                {freshClient.visits.length > 1 ? "ים" : ""}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-bold text-lg">
              {freshClient.name[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {freshClient.visits.map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                onDelete={() => handleDeleteVisit(freshClient.id, visit.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לקוחות..."
          className="w-full py-3.5 pe-11 ps-4 rounded-2xl bg-zinc-100 text-zinc-800 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-300 transition-all text-sm text-end"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-3xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-zinc-300" />
          </div>
          <p className="text-sm text-zinc-400 font-medium">
            {search ? "לא נמצאו לקוחות" : "אין לקוחות עדיין"}
          </p>
          <p className="text-xs text-zinc-300 mt-1">
            {search
              ? "נסי מילת חיפוש אחרת"
              : "שמרי פורמולה כדי ליצור לקוחה ראשונה"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((client) => (
              <motion.button
                key={client.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                onClick={() => setSelectedClient(client)}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all text-right"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                <div className="min-w-0 flex-1 text-end">
                  <p className="text-sm font-semibold text-zinc-800 truncate">
                    {client.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {client.visits.length} ביקור
                    {client.visits.length > 1 ? "ים" : ""} &middot; אחרון:{" "}
                    {formatDate(client.visits[0]?.date || client.createdAt)}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {client.name[0]?.toUpperCase()}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
