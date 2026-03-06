"use client";

import { motion } from "framer-motion";
import { Droplets, Sun, Clock, FlaskConical, AlertCircle, ShieldCheck, Save, Palette, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { FormulaResult } from "@/lib/types";

interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between py-2.5">
      <span className="text-sm text-zinc-400 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold text-zinc-800 text-start max-w-[55%]">
        {value}
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 24 },
  },
};

interface Props {
  result: FormulaResult;
  onSave: () => void;
}

export default function FormulaCards({ result, onSave }: Props) {
  const serviceType = result.serviceType || "majirel";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* ═══ MAJIREL: Roots Card ═══ */}
      {serviceType === "majirel" && result.roots && (
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-zinc-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">פורמולת שורשים</h3>
              <p className="text-xs text-zinc-400">Zone 1</p>
            </div>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-0.5">
            <InfoRow label="מוצר" value={result.roots.colorLine} icon={<FlaskConical className="w-3.5 h-3.5" />} />
            <InfoRow label="גוון יעד" value={result.roots.targetShade} />
            {result.roots.baseShade && <InfoRow label="בסיס (שיער אפור)" value={result.roots.baseShade} />}
            {result.roots.mixRatio && <InfoRow label="ערבוב גוונים" value={result.roots.mixRatio} />}
            <InfoRow label="מפתח (דוולופר)" value={result.roots.developerVolume} />
            <InfoRow label="יחס צבע : מפתח" value={result.roots.mixingRatio} />
            <InfoRow label="זמן עיבוד" value={result.roots.processingTime} icon={<Clock className="w-3.5 h-3.5" />} />
          </div>
          {result.roots.underlyingPigment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3.5 bg-orange-50 rounded-2xl border border-orange-100"
            >
              <div className="flex gap-3 items-center">
                <div
                  className="w-7 h-7 rounded-full ring-2 ring-orange-200 flex-shrink-0"
                  style={{ backgroundColor: result.roots.underlyingPigment.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-orange-600" />
                    <p className="text-xs font-semibold text-orange-800">
                      פיגמנט חם: {result.roots.underlyingPigment.pigmentHe}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {result.roots.neutralizationNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-3.5 bg-violet-50 rounded-2xl border border-violet-100"
            >
              <div className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-violet-700 leading-relaxed">{result.roots.neutralizationNote}</p>
              </div>
            </motion.div>
          )}
          {result.roots.grayCoverageNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-100"
            >
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">{result.roots.grayCoverageNote}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ═══ HIGH LIFT Card ═══ */}
      {serviceType === "highLift" && result.highLift && (
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-zinc-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Majirel High Lift</h3>
              <p className="text-xs text-zinc-400">הרמה עד 4.5 רמות ללא הבהרה</p>
            </div>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-0.5">
            <InfoRow label="גוון" value={`${result.highLift.shade} — ${result.highLift.shadeNameHe}`} icon={<Palette className="w-3.5 h-3.5" />} />
            <InfoRow label="מפתח (דוולופר)" value={result.highLift.developerVolume} />
            <InfoRow label="יחס צבע : מפתח" value={result.highLift.mixingRatio} />
            <InfoRow label="זמן עיבוד" value={result.highLift.processingTime} icon={<Clock className="w-3.5 h-3.5" />} />
          </div>
          {result.highLift.notes.length > 0 && (
            <div className="mt-4 space-y-2">
              {result.highLift.notes.map((note, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 bg-amber-50 rounded-2xl border border-amber-100"
                >
                  <p className="text-xs text-amber-700 leading-relaxed">{note}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ═══ BLEACH Card ═══ */}
      {serviceType === "bleach" && result.bleach && (
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-zinc-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">פורמולת הבהרה</h3>
              <p className="text-xs text-zinc-400">Blond Studio — {result.bleach.techniqueHe}</p>
            </div>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-0.5">
            <InfoRow label="מוצר" value={result.bleach.productNameHe} icon={<FlaskConical className="w-3.5 h-3.5" />} />
            <InfoRow label="הרמה מקסימלית" value={result.bleach.maxLift} />
            <InfoRow label="טכניקה" value={result.bleach.techniqueHe} />
            <InfoRow label="מפתח (דוולופר)" value={result.bleach.developerVolume} />
            <InfoRow label="יחס אבקה : מפתח" value={result.bleach.mixingRatio} />
            <InfoRow label="זמן עיבוד" value={result.bleach.processingTime} icon={<Clock className="w-3.5 h-3.5" />} />
          </div>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3.5 bg-sky-50 rounded-2xl border border-sky-100"
          >
            <p className="text-xs text-sky-700 leading-relaxed">
              ⏱ לבדוק כל 10 דקות. לא להשתמש בחום. לעצור כשמגיעים לרמת הבהרה הרצויה.
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* ═══ TONER Card (after bleach) ═══ */}
      {serviceType === "bleach" && result.toner && (
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-zinc-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">שטיפה לאחר הבהרה</h3>
              <p className="text-xs text-zinc-400">ניטרול וגיוון — {result.toner.productLine}</p>
            </div>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-0.5">
            <InfoRow label="קו מוצרים" value={result.toner.productLine} icon={<FlaskConical className="w-3.5 h-3.5" />} />
            <InfoRow label="גוון" value={result.toner.shade} />
            <InfoRow label="מפתח (דוולופר)" value={result.toner.developerVolume} />
            <InfoRow label="יחס צבע : מפתח" value={result.toner.mixingRatio} />
            <InfoRow label="זמן עיבוד" value={result.toner.processingTime} icon={<Clock className="w-3.5 h-3.5" />} />
          </div>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3.5 bg-violet-50 rounded-2xl border border-violet-100"
          >
            <p className="text-xs text-violet-700 leading-relaxed">
              💡 Dia Light: pH חומצי — סוגר קוטיקולות, נותן ברק ומרקם חלק לאחר הבהרה. 5 דקות לברק, 10 לגיוון, 20 לעומק.
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* ═══ ENDS Card (Majirel & High Lift modes) ═══ */}
      {(serviceType === "majirel" || serviceType === "highLift") && result.ends && (
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-zinc-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Sun className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">פורמולת אורכים</h3>
              <p className="text-xs text-zinc-400">Zones 2 & 3 — רענון צבע</p>
            </div>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-0.5">
            <InfoRow label="קו מוצרים" value={result.ends.productLine} icon={<FlaskConical className="w-3.5 h-3.5" />} />
            <InfoRow label="גוון רענון" value={result.ends.refreshShade} />
            <InfoRow label="מפתח (דוולופר)" value={result.ends.developerVolume} />
            <InfoRow label="יחס צבע : מפתח" value={result.ends.mixingRatio} />
            <InfoRow label="זמן עיבוד" value={result.ends.processingTime} icon={<Clock className="w-3.5 h-3.5" />} />
          </div>
          {result.ends.recommendationNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100"
            >
              <div className="flex gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-700 leading-relaxed">{result.ends.recommendationNote}</p>
              </div>
            </motion.div>
          )}
          {result.ends.toneNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-3.5 bg-sky-50 rounded-2xl border border-sky-100"
            >
              <div className="flex gap-2">
                <Palette className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-sky-700 leading-relaxed">{result.ends.toneNote}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Save Button */}
      <motion.div variants={cardVariants}>
        <Button
          onClick={onSave}
          variant="outline"
          className="w-full h-13 rounded-2xl text-sm font-semibold border-2 border-zinc-200 hover:bg-zinc-50 transition-all"
        >
          <Save className="w-4 h-4 me-2" />
          שמור פורמולה לפרופיל לקוחה
        </Button>
      </motion.div>
    </motion.div>
  );
}
