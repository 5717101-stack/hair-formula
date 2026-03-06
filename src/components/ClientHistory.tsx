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

function VisitCard({
  visit,
  onDelete,
}: {
  visit: ClientVisit;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { formula } = visit;

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
              {formula.roots.colorLine} &middot; {formula.roots.targetShade}
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

              {/* Roots */}
              <div className="p-3 bg-rose-50/50 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 justify-end">
                  שורשים — Zone 1
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-xs">
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.roots.targetShade}
                  </span>
                  <span className="text-zinc-400 text-end">גוון</span>
                  {formula.roots.baseShade && (
                    <>
                      <span className="font-medium text-zinc-700 text-start">
                        {formula.roots.baseShade}
                      </span>
                      <span className="text-zinc-400 text-end">בסיס</span>
                    </>
                  )}
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.roots.developerVolume}
                  </span>
                  <span className="text-zinc-400 text-end">מפתח</span>
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.roots.mixingRatio}
                  </span>
                  <span className="text-zinc-400 text-end">יחס</span>
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.roots.processingTime}
                  </span>
                  <span className="text-zinc-400 text-end">זמן</span>
                </div>
              </div>

              {/* Ends */}
              <div className="p-3 bg-emerald-50/50 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 justify-end">
                  אורכים — Zones 2 & 3
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-xs">
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.ends.productLine}
                  </span>
                  <span className="text-zinc-400 text-end">מוצר</span>
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.ends.refreshShade}
                  </span>
                  <span className="text-zinc-400 text-end">גוון</span>
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.ends.developerVolume}
                  </span>
                  <span className="text-zinc-400 text-end">מפתח</span>
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.ends.mixingRatio}
                  </span>
                  <span className="text-zinc-400 text-end">יחס</span>
                  <span className="font-medium text-zinc-700 text-start">
                    {formula.ends.processingTime}
                  </span>
                  <span className="text-zinc-400 text-end">זמן</span>
                </div>
              </div>

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
