"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getUnderlyingPigment, MAJIREL_SHADES } from "@/lib/colorCalculator";
import type {
  ConsultationInput,
  GrayRange,
  HairThickness,
  ToneCode,
  EndsProductLine,
} from "@/lib/types";

const GRAY_OPTIONS: { value: GrayRange; label: string }[] = [
  { value: "0-30", label: "0–30%" },
  { value: "30-50", label: "30–50%" },
  { value: "50-100", label: "50–100%" },
];

const THICKNESS_OPTIONS: { value: HairThickness; label: string }[] = [
  { value: "fine", label: "דק" },
  { value: "normal", label: "רגיל" },
  { value: "thick", label: "עבה" },
];

const PRODUCT_LINE_OPTIONS: { value: EndsProductLine; label: string }[] = [
  { value: "Majirel", label: "Majirel" },
  { value: "Dia Light", label: "Dia Light" },
  { value: "Dia Color", label: "Dia Color" },
];

const CURRENT_TONE_OPTIONS: { value: ToneCode; label: string; emoji: string }[] = [
  { value: "0", label: "טבעי", emoji: "⚪" },
  { value: "1", label: "אפור", emoji: "🔵" },
  { value: "2", label: "פנינה", emoji: "🟣" },
  { value: "3", label: "זהב", emoji: "🟡" },
  { value: "4", label: "נחושת", emoji: "🟠" },
  { value: "5", label: "מהגוני", emoji: "🔴" },
  { value: "6", label: "אדום", emoji: "❤️" },
  { value: "8", label: "מוקה", emoji: "🤎" },
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

const LEVEL_LABELS: Record<number, string> = {
  1: "שחור", 2: "שחור-חום", 3: "חום כהה", 4: "חום בינוני",
  5: "חום בהיר", 6: "בלונד כהה", 7: "בלונד", 8: "בלונד בהיר",
  9: "בלונד בהיר מאוד", 10: "בלונד בהיר ביותר",
};

function LevelDisplay({ level }: { level: number }) {
  const colors = [
    "bg-zinc-950", "bg-zinc-900", "bg-zinc-800", "bg-zinc-700",
    "bg-amber-950", "bg-amber-900", "bg-amber-800",
    "bg-amber-700", "bg-amber-500", "bg-amber-300",
  ];
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl font-semibold tabular-nums">{level}</span>
      <div
        className={`w-8 h-8 rounded-full ${colors[level - 1] || "bg-zinc-500"} ring-2 ring-white shadow-md`}
      />
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
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 min-w-[60px] py-3 px-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
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
  const [currentEndsLevel, setCurrentEndsLevel] = useState(5);
  const [currentEndsTone, setCurrentEndsTone] = useState<ToneCode>("0");
  const [desiredEndsTone, setDesiredEndsTone] = useState("7.0");
  const [endsProductLine, setEndsProductLine] = useState<EndsProductLine>("Dia Light");
  const [targetShade, setTargetShade] = useState("7.0");
  const [grayPercentage, setGrayPercentage] = useState<GrayRange>("0-30");
  const [hairThickness, setHairThickness] = useState<HairThickness>("normal");
  const [neutralize, setNeutralize] = useState(false);
  const [shadeDropdownOpen, setShadeDropdownOpen] = useState(false);
  const [endsShadeDropdownOpen, setEndsShadeDropdownOpen] = useState(false);

  const targetLevel = Math.round(parseFloat(targetShade));
  const liftNeeded = targetLevel - naturalRoot;

  const pigment = useMemo(
    () => (liftNeeded > 0 ? getUnderlyingPigment(targetLevel) : null),
    [targetLevel, liftNeeded]
  );

  const handleSubmit = () => {
    onCalculate({
      naturalRootBase: naturalRoot,
      currentEndsLevel,
      currentEndsTone,
      desiredEndsTone,
      endsProductLine,
      targetShade,
      grayPercentage,
      hairThickness,
      neutralize,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* ─── שורשים ─── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">שורשים</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* Natural Root Base */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            בסיס טבעי בשורשים
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
          <span>1 שחור</span>
          <span>10 בלונד בהיר ביותר</span>
        </div>
      </div>

      {/* Target Shade */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          גוון יעד (Majirel)
        </Label>
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShadeDropdownOpen(!shadeDropdownOpen); setEndsShadeDropdownOpen(false); }}
            className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 text-right font-medium text-zinc-800 hover:bg-zinc-200 transition-colors flex items-center justify-between"
          >
            <svg
              className={`w-4 h-4 text-zinc-400 transition-transform ${shadeDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-lg">{targetShade}</span>
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

      {/* Underlying Pigment Alert */}
      <AnimatePresence>
        {pigment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">
                    פיגמנט חם צפוי
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    הרמה ל-{targetLevel} ({LEVEL_LABELS[targetLevel]}) חושפת: <strong>{pigment.pigmentHe}</strong>
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-full ring-2 ring-amber-200 flex-shrink-0"
                  style={{ backgroundColor: pigment.color }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-700">
                    נטרל פיגמנט חם?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNeutralize(!neutralize)}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                    neutralize ? "bg-zinc-900" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                      neutralize ? "translate-x-0.5" : "translate-x-5"
                    }`}
                  />
                </button>
              </div>

              {neutralize && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-amber-700 bg-amber-100 rounded-xl px-3 py-2"
                >
                  ניטרול עם {pigment.neutralizerHe}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── אורכים וקצוות ─── */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">אורכים וקצוות</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* Ends Level */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            רמת צבע נוכחית באורכים
          </Label>
          <LevelDisplay level={currentEndsLevel} />
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[currentEndsLevel]}
          onValueChange={(v) => setCurrentEndsLevel(Array.isArray(v) ? v[0] : v)}
          className="py-2"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 px-1">
          <span>1 שחור</span>
          <span>10 בלונד בהיר ביותר</span>
        </div>
      </div>

      {/* Current Ends Tone */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          גוון נוכחי באורכים
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {CURRENT_TONE_OPTIONS.map((t) => {
            const active = t.value === currentEndsTone;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setCurrentEndsTone(t.value)}
                className={`py-2.5 px-2 rounded-2xl text-xs font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                  active
                    ? "bg-zinc-900 text-white shadow-lg scale-[1.02]"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                <span className="text-base">{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desired Ends Shade — Majirel catalog */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          גוון רצוי באורכים (Majirel)
        </Label>
        <div className="relative">
          <button
            type="button"
            onClick={() => { setEndsShadeDropdownOpen(!endsShadeDropdownOpen); setShadeDropdownOpen(false); }}
            className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 text-right font-medium text-zinc-800 hover:bg-zinc-200 transition-colors flex items-center justify-between"
          >
            <svg
              className={`w-4 h-4 text-zinc-400 transition-transform ${endsShadeDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-lg font-bold">{desiredEndsTone}</span>
          </button>
          {endsShadeDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-zinc-200 p-3 max-h-60 overflow-y-auto"
            >
              <div className="grid grid-cols-4 gap-1.5">
                {MAJIREL_SHADES.map((shade) => (
                  <button
                    key={shade}
                    type="button"
                    onClick={() => {
                      setDesiredEndsTone(shade);
                      setEndsShadeDropdownOpen(false);
                    }}
                    className={`py-2 px-1 rounded-xl text-sm font-medium transition-all ${
                      shade === desiredEndsTone
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

      {/* Product Line for Ends */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          קו מוצרים לאורכים
        </Label>
        <ToggleGroup
          options={PRODUCT_LINE_OPTIONS}
          value={endsProductLine}
          onChange={setEndsProductLine}
        />
      </div>

      {/* ─── כללי ─── */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">כללי</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* Gray Hair */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          אחוז שיער אפור
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
          עובי שיער
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
        <Sparkles className="w-5 h-5 me-2" />
        חשב פורמולה
      </Button>
    </motion.div>
  );
}
