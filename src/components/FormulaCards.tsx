"use client";

import { motion } from "framer-motion";
import { Droplets, Sun, Clock, FlaskConical, AlertCircle, Save } from "lucide-react";
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
      <span className="text-sm font-semibold text-zinc-800 text-right max-w-[55%]">
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
  const { roots, ends } = result;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Roots Card */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-zinc-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900">Roots Formula</h3>
            <p className="text-xs text-zinc-400">Zone 1</p>
          </div>
        </div>

        <Separator className="mb-3" />

        <div className="space-y-0.5">
          <InfoRow
            label="Color Line"
            value={roots.colorLine}
            icon={<FlaskConical className="w-3.5 h-3.5" />}
          />
          <InfoRow label="Target Shade" value={roots.targetShade} />
          {roots.baseShade && (
            <InfoRow label="Base Shade (Gray)" value={roots.baseShade} />
          )}
          {roots.mixRatio && (
            <InfoRow label="Shade Mix" value={roots.mixRatio} />
          )}
          <InfoRow label="Developer" value={roots.developerVolume} />
          <InfoRow
            label="Color : Developer"
            value={roots.mixingRatio}
          />
          <InfoRow
            label="Processing Time"
            value={roots.processingTime}
            icon={<Clock className="w-3.5 h-3.5" />}
          />
        </div>

        {roots.grayCoverageNote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3.5 bg-amber-50 rounded-2xl border border-amber-100"
          >
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                {roots.grayCoverageNote}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Ends Card */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-zinc-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Sun className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900">Ends Formula</h3>
            <p className="text-xs text-zinc-400">Zones 2 & 3 — Color Refresh</p>
          </div>
        </div>

        <Separator className="mb-3" />

        <div className="space-y-0.5">
          <InfoRow
            label="Product Line"
            value={ends.productLine}
            icon={<FlaskConical className="w-3.5 h-3.5" />}
          />
          <InfoRow label="Refresh Shade" value={ends.refreshShade} />
          <InfoRow label="Developer" value={ends.developerVolume} />
          <InfoRow
            label="Color : Developer"
            value={ends.mixingRatio}
          />
          <InfoRow
            label="Processing Time"
            value={ends.processingTime}
            icon={<Clock className="w-3.5 h-3.5" />}
          />
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={cardVariants}>
        <Button
          onClick={onSave}
          variant="outline"
          className="w-full h-13 rounded-2xl text-sm font-semibold border-2 border-zinc-200 hover:bg-zinc-50 transition-all"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Formula to Client Profile
        </Button>
      </motion.div>
    </motion.div>
  );
}
