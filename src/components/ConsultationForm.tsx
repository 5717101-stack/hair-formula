"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  getUnderlyingPigment,
  MAJIREL_SHADES,
  HIGH_LIFT_SHADES,
  HIGH_LIFT_DEVELOPERS,
  BLOND_STUDIO_PRODUCTS,
  BLEACH_TECHNIQUES,
  BLEACH_DEVELOPERS_OIL,
  BLEACH_DEVELOPERS_NUTRI,
  TONER_SHADES,
} from "@/lib/colorCalculator";
import type {
  ConsultationInput,
  GrayRange,
  HairThickness,
  ToneCode,
  ServiceType,
  BleachTechnique,
} from "@/lib/types";

const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string; desc: string }[] = [
  { value: "majirel", label: "צבע קבוע", desc: "Majirel" },
  { value: "highLift", label: "הרמה", desc: "High Lift" },
  { value: "bleach", label: "הבהרה", desc: "Blond Studio" },
];

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

const TONER_LINE_OPTIONS: { value: string; label: string }[] = [
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

const TARGET_SHADES = MAJIREL_SHADES;

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

interface ShadeDropdownProps {
  shades: string[];
  value: string;
  onChange: (shade: string) => void;
  open: boolean;
  onToggle: () => void;
}

function ShadeDropdown({ shades, value, onChange, open, onToggle }: ShadeDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 text-right font-medium text-zinc-800 hover:bg-zinc-200 transition-colors flex items-center justify-between"
      >
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-lg font-bold">{value}</span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-zinc-200 p-3 max-h-60 overflow-y-auto"
        >
          <div className="grid grid-cols-4 gap-1.5">
            {shades.map((shade) => (
              <button
                key={shade}
                type="button"
                onClick={() => onChange(shade)}
                className={`py-2 px-1 rounded-xl text-sm font-medium transition-all ${
                  shade === value
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
  );
}

interface Props {
  onCalculate: (input: ConsultationInput) => void;
}

export default function ConsultationForm({ onCalculate }: Props) {
  // Service type
  const [serviceType, setServiceType] = useState<ServiceType>("majirel");

  // Common
  const [naturalRoot, setNaturalRoot] = useState(5);
  const [currentEndsLevel, setCurrentEndsLevel] = useState(5);
  const [currentEndsTone, setCurrentEndsTone] = useState<ToneCode>("0");
  const [grayPercentage, setGrayPercentage] = useState<GrayRange>("0-30");
  const [hairThickness, setHairThickness] = useState<HairThickness>("normal");

  // Majirel mode
  const [targetShade, setTargetShade] = useState("7.0");
  const [neutralize, setNeutralize] = useState(false);
  const [desiredEndsTone, setDesiredEndsTone] = useState("7.0");

  // High Lift mode
  const [highLiftShade, setHighLiftShade] = useState("Neutral");
  const [highLiftDeveloper, setHighLiftDeveloper] = useState("30 Vol (9%)");

  // Bleach mode
  const [bleachProduct, setBleachProduct] = useState("studio9");
  const [bleachTechnique, setBleachTechnique] = useState<BleachTechnique>("foils");
  const [bleachDeveloper, setBleachDeveloper] = useState("20 Vol (6%)");
  const [tonerProductLine, setTonerProductLine] = useState("Dia Light");
  const [tonerShade, setTonerShade] = useState("9.01");

  // Dropdowns
  const [shadeDropdownOpen, setShadeDropdownOpen] = useState(false);
  const [endsShadeDropdownOpen, setEndsShadeDropdownOpen] = useState(false);
  const [tonerShadeDropdownOpen, setTonerShadeDropdownOpen] = useState(false);
  const [hlShadeDropdownOpen, setHlShadeDropdownOpen] = useState(false);

  const closeAllDropdowns = () => {
    setShadeDropdownOpen(false);
    setEndsShadeDropdownOpen(false);
    setTonerShadeDropdownOpen(false);
    setHlShadeDropdownOpen(false);
  };

  const targetLevel = Math.round(parseFloat(targetShade));
  const liftNeeded = targetLevel - naturalRoot;

  const pigment = useMemo(
    () => (liftNeeded > 0 ? getUnderlyingPigment(targetLevel) : null),
    [targetLevel, liftNeeded]
  );

  const selectedBleachProduct = BLOND_STUDIO_PRODUCTS.find((p) => p.code === bleachProduct);
  const availableBleachDevs = selectedBleachProduct?.developerType === "nutri"
    ? BLEACH_DEVELOPERS_NUTRI
    : BLEACH_DEVELOPERS_OIL;

  const handleSubmit = () => {
    onCalculate({
      serviceType,
      naturalRootBase: naturalRoot,
      currentEndsLevel,
      currentEndsTone,
      grayPercentage,
      hairThickness,
      targetShade,
      neutralize,
      desiredEndsTone,
      endsProductLine: "Dia Light",
      highLiftShade,
      highLiftDeveloper,
      bleachProduct,
      bleachTechnique,
      bleachDeveloper,
      tonerProductLine,
      tonerShade,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* ─── סוג שירות ─── */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          סוג שירות
        </Label>
        <div className="flex gap-2">
          {SERVICE_TYPE_OPTIONS.map((opt) => {
            const active = opt.value === serviceType;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setServiceType(opt.value)}
                className={`flex-1 py-3.5 px-2 rounded-2xl text-center transition-all duration-200 ${
                  active
                    ? "bg-zinc-900 text-white shadow-lg scale-[1.02]"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                <span className="block text-sm font-semibold">{opt.label}</span>
                <span className={`block text-[10px] mt-0.5 ${active ? "text-zinc-400" : "text-zinc-400"}`}>
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════ MAJIREL MODE ═══════════ */}
      {serviceType === "majirel" && (
        <>
          {/* ─── שורשים ─── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">שורשים</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                בסיס טבעי בשורשים
              </Label>
              <LevelDisplay level={naturalRoot} />
            </div>
            <Slider
              min={1} max={10} step={1}
              value={[naturalRoot]}
              onValueChange={(v) => setNaturalRoot(Array.isArray(v) ? v[0] : v)}
              className="py-2"
            />
            <div dir="ltr" className="flex justify-between text-[10px] text-zinc-400 px-1">
              <span>1 שחור</span>
              <span>10 בלונד בהיר ביותר</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              גוון יעד (Majirel)
            </Label>
            <ShadeDropdown
              shades={TARGET_SHADES}
              value={targetShade}
              onChange={(s) => { setTargetShade(s); setShadeDropdownOpen(false); }}
              open={shadeDropdownOpen}
              onToggle={() => { closeAllDropdowns(); setShadeDropdownOpen(!shadeDropdownOpen); }}
            />
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
                      <p className="text-sm font-semibold text-amber-800">פיגמנט חם צפוי</p>
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
                      <span className="text-sm font-medium text-zinc-700">נטרל פיגמנט חם?</span>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                רמת צבע נוכחית באורכים
              </Label>
              <LevelDisplay level={currentEndsLevel} />
            </div>
            <Slider
              min={1} max={10} step={1}
              value={[currentEndsLevel]}
              onValueChange={(v) => setCurrentEndsLevel(Array.isArray(v) ? v[0] : v)}
              className="py-2"
            />
            <div dir="ltr" className="flex justify-between text-[10px] text-zinc-400 px-1">
              <span>1 שחור</span>
              <span>10 בלונד בהיר ביותר</span>
            </div>
          </div>

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

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              גוון רצוי באורכים (Majirel)
            </Label>
            <ShadeDropdown
              shades={MAJIREL_SHADES}
              value={desiredEndsTone}
              onChange={(s) => { setDesiredEndsTone(s); setEndsShadeDropdownOpen(false); }}
              open={endsShadeDropdownOpen}
              onToggle={() => { closeAllDropdowns(); setEndsShadeDropdownOpen(!endsShadeDropdownOpen); }}
            />
          </div>

        </>
      )}

      {/* ═══════════ HIGH LIFT MODE ═══════════ */}
      {serviceType === "highLift" && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Majirel High Lift</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                בסיס טבעי
              </Label>
              <LevelDisplay level={naturalRoot} />
            </div>
            <Slider
              min={1} max={10} step={1}
              value={[naturalRoot]}
              onValueChange={(v) => setNaturalRoot(Array.isArray(v) ? v[0] : v)}
              className="py-2"
            />
            <div dir="ltr" className="flex justify-between text-[10px] text-zinc-400 px-1">
              <span>1 שחור</span>
              <span>10 בלונד בהיר ביותר</span>
            </div>
          </div>

          {naturalRoot < 5 && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  High Lift מתאים לבסיס טבעי 5 ומעלה. לבסיסים כהים מומלץ הבהרה (Blond Studio).
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              גוון High Lift
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { closeAllDropdowns(); setHlShadeDropdownOpen(!hlShadeDropdownOpen); }}
                className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 text-right font-medium text-zinc-800 hover:bg-zinc-200 transition-colors flex items-center justify-between"
              >
                <svg
                  className={`w-4 h-4 text-zinc-400 transition-transform ${hlShadeDropdownOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-base">
                  <span className="font-bold">{highLiftShade}</span>
                  <span className="text-zinc-500 me-2">
                    {" "}{HIGH_LIFT_SHADES.find((s) => s.code === highLiftShade)?.nameHe}
                  </span>
                </span>
              </button>
              {hlShadeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-zinc-200 p-3 max-h-64 overflow-y-auto"
                >
                  <div className="space-y-1">
                    {HIGH_LIFT_SHADES.map((shade) => (
                      <button
                        key={shade.code}
                        type="button"
                        onClick={() => { setHighLiftShade(shade.code); setHlShadeDropdownOpen(false); }}
                        className={`w-full py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                          shade.code === highLiftShade
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-50 text-zinc-700 hover:bg-zinc-200"
                        }`}
                      >
                        <span className={shade.code === highLiftShade ? "text-zinc-300" : "text-zinc-400"}>
                          {shade.nameHe}
                        </span>
                        <span className="font-bold">{shade.code}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              מפתח (דוולופר)
            </Label>
            <ToggleGroup
              options={HIGH_LIFT_DEVELOPERS.map((d) => ({ value: d, label: d }))}
              value={highLiftDeveloper}
              onChange={setHighLiftDeveloper}
            />
          </div>

          {/* ─── אורכים ─── */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">רענון אורכים</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                רמת צבע נוכחית באורכים
              </Label>
              <LevelDisplay level={currentEndsLevel} />
            </div>
            <Slider
              min={1} max={10} step={1}
              value={[currentEndsLevel]}
              onValueChange={(v) => setCurrentEndsLevel(Array.isArray(v) ? v[0] : v)}
              className="py-2"
            />
          </div>

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

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              גוון רצוי באורכים (Majirel)
            </Label>
            <ShadeDropdown
              shades={MAJIREL_SHADES}
              value={desiredEndsTone}
              onChange={(s) => { setDesiredEndsTone(s); setEndsShadeDropdownOpen(false); }}
              open={endsShadeDropdownOpen}
              onToggle={() => { closeAllDropdowns(); setEndsShadeDropdownOpen(!endsShadeDropdownOpen); }}
            />
          </div>

        </>
      )}

      {/* ═══════════ BLEACH MODE ═══════════ */}
      {serviceType === "bleach" && (
        <>
          {/* ─── הבהרה ─── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">הבהרה — Blond Studio</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                בסיס טבעי
              </Label>
              <LevelDisplay level={naturalRoot} />
            </div>
            <Slider
              min={1} max={10} step={1}
              value={[naturalRoot]}
              onValueChange={(v) => setNaturalRoot(Array.isArray(v) ? v[0] : v)}
              className="py-2"
            />
            <div dir="ltr" className="flex justify-between text-[10px] text-zinc-400 px-1">
              <span>1 שחור</span>
              <span>10 בלונד בהיר ביותר</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              מוצר הבהרה
            </Label>
            <div className="space-y-1.5">
              {BLOND_STUDIO_PRODUCTS.map((prod) => {
                const active = prod.code === bleachProduct;
                return (
                  <button
                    key={prod.code}
                    type="button"
                    onClick={() => {
                      setBleachProduct(prod.code);
                      const newDevs = prod.developerType === "nutri" ? BLEACH_DEVELOPERS_NUTRI : BLEACH_DEVELOPERS_OIL;
                      if (!newDevs.includes(bleachDeveloper)) setBleachDeveloper(newDevs[0]);
                    }}
                    className={`w-full py-3 px-4 rounded-2xl text-sm font-medium transition-all flex items-center justify-between ${
                      active
                        ? "bg-zinc-900 text-white shadow-lg"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    <span className={`text-xs ${active ? "text-zinc-400" : "text-zinc-400"}`}>
                      {prod.maxLift}
                    </span>
                    <span>{prod.nameHe}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              טכניקה
            </Label>
            <ToggleGroup
              options={BLEACH_TECHNIQUES.map((t) => ({ value: t.code, label: t.nameHe }))}
              value={bleachTechnique}
              onChange={(v) => setBleachTechnique(v as BleachTechnique)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              מפתח (דוולופר)
            </Label>
            <ToggleGroup
              options={availableBleachDevs.map((d) => ({ value: d, label: d }))}
              value={bleachDeveloper}
              onChange={setBleachDeveloper}
            />
          </div>

          {/* ─── שטיפה (טונר) ─── */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">שטיפה לאחר הבהרה</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              קו מוצרים לשטיפה
            </Label>
            <ToggleGroup
              options={TONER_LINE_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
              value={tonerProductLine}
              onChange={setTonerProductLine}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              גוון שטיפה
            </Label>
            <ShadeDropdown
              shades={TONER_SHADES}
              value={tonerShade}
              onChange={(s) => { setTonerShade(s); setTonerShadeDropdownOpen(false); }}
              open={tonerShadeDropdownOpen}
              onToggle={() => { closeAllDropdowns(); setTonerShadeDropdownOpen(!tonerShadeDropdownOpen); }}
            />
          </div>
        </>
      )}

      {/* ═══════════ COMMON — כללי ═══════════ */}
      {serviceType !== "bleach" && (
        <>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">כללי</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

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
        </>
      )}

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
