"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type {
  ConsultationInput,
  GrayRange,
  HairThickness,
  ColorLine,
} from "@/lib/types";

const GRAY_OPTIONS: { value: GrayRange; label: string }[] = [
  { value: "0-30", label: "0–30%" },
  { value: "30-50", label: "30–50%" },
  { value: "50-100", label: "50–100%" },
];

const THICKNESS_OPTIONS: { value: HairThickness; label: string }[] = [
  { value: "fine", label: "Fine" },
  { value: "normal", label: "Normal" },
  { value: "thick", label: "Thick" },
];

const COLOR_LINE_OPTIONS: { value: ColorLine; label: string }[] = [
  { value: "majirel", label: "Majirel" },
  { value: "inoa", label: "iNOA" },
];

const TARGET_SHADES = [
  "1.0", "2.0", "3.0", "4.0", "4.15", "4.3", "4.45",
  "5.0", "5.1", "5.3", "5.4", "5.5", "5.6", "5.8",
  "6.0", "6.1", "6.3", "6.34", "6.35", "6.45", "6.46", "6.8",
  "7.0", "7.1", "7.3", "7.31", "7.35", "7.4", "7.43", "7.44", "7.8",
  "8.0", "8.1", "8.3", "8.31", "8.34", "8.8",
  "9.0", "9.1", "9.13", "9.3", "9.31",
  "10.0", "10.1",
];

function LevelDisplay({ level }: { level: number }) {
  const colors = [
    "bg-zinc-950", "bg-zinc-900", "bg-zinc-800", "bg-zinc-700",
    "bg-amber-950", "bg-amber-900", "bg-amber-800",
    "bg-amber-700", "bg-amber-500", "bg-amber-300",
  ];
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full ${colors[level - 1] || "bg-zinc-500"} ring-2 ring-white shadow-md`}
      />
      <span className="text-2xl font-semibold tabular-nums">{level}</span>
    </div>
  );
}

interface ToggleGroupProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (val: T) => void;
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-zinc-900 text-white shadow-lg scale-[1.02]"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

interface Props {
  onCalculate: (input: ConsultationInput) => void;
}

export default function ConsultationForm({ onCalculate }: Props) {
  const [naturalRoot, setNaturalRoot] = useState(5);
  const [currentEnds, setCurrentEnds] = useState(5);
  const [targetShade, setTargetShade] = useState("7.0");
  const [grayPercentage, setGrayPercentage] = useState<GrayRange>("0-30");
  const [hairThickness, setHairThickness] = useState<HairThickness>("normal");
  const [colorLine, setColorLine] = useState<ColorLine>("majirel");
  const [shadeDropdownOpen, setShadeDropdownOpen] = useState(false);

  const handleSubmit = () => {
    onCalculate({
      naturalRootBase: naturalRoot,
      currentEndsColor: currentEnds,
      targetShade,
      grayPercentage,
      hairThickness,
      colorLine,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Color Line */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          Color Line
        </Label>
        <ToggleGroup
          options={COLOR_LINE_OPTIONS}
          value={colorLine}
          onChange={setColorLine}
        />
      </div>

      {/* Natural Root Base */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Natural Root Base
          </Label>
          <LevelDisplay level={naturalRoot} />
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[naturalRoot]}
          onValueChange={(v) => setNaturalRoot(Array.isArray(v) ? v[0] : v)}
          className="py-2"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 px-1">
          <span>1 Black</span>
          <span>10 Lightest Blonde</span>
        </div>
      </div>

      {/* Current Ends Color */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Current Ends Color
          </Label>
          <LevelDisplay level={currentEnds} />
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[currentEnds]}
          onValueChange={(v) => setCurrentEnds(Array.isArray(v) ? v[0] : v)}
          className="py-2"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 px-1">
          <span>1 Black</span>
          <span>10 Lightest Blonde</span>
        </div>
      </div>

      {/* Target Shade */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          Target Shade
        </Label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShadeDropdownOpen(!shadeDropdownOpen)}
            className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 text-left font-medium text-zinc-800 hover:bg-zinc-200 transition-colors flex items-center justify-between"
          >
            <span className="text-lg">{targetShade}</span>
            <svg
              className={`w-4 h-4 text-zinc-400 transition-transform ${shadeDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {shadeDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-zinc-200 p-3 max-h-60 overflow-y-auto"
            >
              <div className="grid grid-cols-4 gap-1.5">
                {TARGET_SHADES.map((shade) => (
                  <button
                    key={shade}
                    type="button"
                    onClick={() => {
                      setTargetShade(shade);
                      setShadeDropdownOpen(false);
                    }}
                    className={`py-2 px-1 rounded-xl text-sm font-medium transition-all ${
                      shade === targetShade
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-50 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {shade}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Gray Hair */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          Gray Hair Coverage
        </Label>
        <ToggleGroup
          options={GRAY_OPTIONS}
          value={grayPercentage}
          onChange={setGrayPercentage}
        />
      </div>

      {/* Hair Thickness */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          Hair Thickness
        </Label>
        <ToggleGroup
          options={THICKNESS_OPTIONS}
          value={hairThickness}
          onChange={setHairThickness}
        />
      </div>

      {/* Calculate Button */}
      <Button
        onClick={handleSubmit}
        size="lg"
        className="w-full h-14 rounded-2xl text-base font-semibold bg-zinc-900 hover:bg-zinc-800 shadow-lg transition-all active:scale-[0.98]"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Calculate Formula
      </Button>
    </motion.div>
  );
}
