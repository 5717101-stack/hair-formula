import type {
  ConsultationInput,
  FormulaResult,
  RootsFormula,
  EndsFormula,
  EndsProductLine,
  UnderlyingPigment,
  ToneCode,
} from "./types";

export const UNDERLYING_PIGMENTS: UnderlyingPigment[] = [
  { level: 1, pigment: "Darkest Red", pigmentHe: "אדום כהה מאוד", color: "#4a0404", neutralizer: "Green", neutralizerTone: ".7", neutralizerHe: "ירוק (.7)" },
  { level: 2, pigment: "Dark Red", pigmentHe: "אדום כהה", color: "#6b0f0f", neutralizer: "Green", neutralizerTone: ".7", neutralizerHe: "ירוק (.7)" },
  { level: 3, pigment: "Red Orange", pigmentHe: "אדום-כתום", color: "#8b2500", neutralizer: "Green Blue", neutralizerTone: ".17", neutralizerHe: "ירוק-כחול (.17)" },
  { level: 4, pigment: "Dark Orange", pigmentHe: "כתום כהה", color: "#b44d12", neutralizer: "Blue", neutralizerTone: ".1", neutralizerHe: "כחול/אפור (.1)" },
  { level: 5, pigment: "Orange", pigmentHe: "כתום", color: "#d4771a", neutralizer: "Blue", neutralizerTone: ".1", neutralizerHe: "כחול/אפור (.1)" },
  { level: 6, pigment: "Gold Orange", pigmentHe: "כתום-זהב", color: "#d4951a", neutralizer: "Blue Violet", neutralizerTone: ".12", neutralizerHe: "כחול-סגול (.12)" },
  { level: 7, pigment: "Gold", pigmentHe: "זהב", color: "#d4b01a", neutralizer: "Violet Blue", neutralizerTone: ".21", neutralizerHe: "סגול-כחול (.21)" },
  { level: 8, pigment: "Yellow Gold", pigmentHe: "צהוב-זהב", color: "#e6c84a", neutralizer: "Violet", neutralizerTone: ".2", neutralizerHe: "סגול (.2)" },
  { level: 9, pigment: "Yellow", pigmentHe: "צהוב", color: "#f0d860", neutralizer: "Violet", neutralizerTone: ".2", neutralizerHe: "סגול (.2)" },
  { level: 10, pigment: "Pale Yellow", pigmentHe: "צהוב בהיר", color: "#f5e88a", neutralizer: "Pale Violet", neutralizerTone: ".2", neutralizerHe: "סגול בהיר (.2)" },
];

export const TONE_MAP: Record<ToneCode, { name: string; nameHe: string }> = {
  "0": { name: "Natural", nameHe: "טבעי" },
  "1": { name: "Ash", nameHe: "אפור" },
  "2": { name: "Pearl", nameHe: "פנינה" },
  "3": { name: "Gold", nameHe: "זהב" },
  "4": { name: "Copper", nameHe: "נחושת" },
  "5": { name: "Mahogany", nameHe: "מהגוני" },
  "6": { name: "Red", nameHe: "אדום" },
  "7": { name: "Green", nameHe: "ירוק (מאט)" },
  "8": { name: "Mocha", nameHe: "מוקה" },
};

export const MAJIREL_SHADES = [
  "1.0", "2.0", "3.0", "4.0", "4.15", "4.3", "4.45",
  "5.0", "5.1", "5.3", "5.4", "5.5", "5.6", "5.8",
  "6.0", "6.1", "6.3", "6.34", "6.35", "6.45", "6.46", "6.8",
  "7.0", "7.1", "7.3", "7.31", "7.35", "7.4", "7.43", "7.44", "7.8",
  "8.0", "8.1", "8.3", "8.31", "8.34", "8.8",
  "9.0", "9.1", "9.13", "9.3", "9.31",
  "10.0", "10.1",
];

export interface ProductLineSpec {
  developerVolume: string;
  mixingRatio: string;
  processingTime: string;
}

export const PRODUCT_LINE_SPECS: Record<EndsProductLine, ProductLineSpec> = {
  Majirel: {
    developerVolume: "20 Vol (6%)",
    mixingRatio: "1 : 1.5",
    processingTime: "35 דקות",
  },
  "Dia Light": {
    developerVolume: "6 Vol (1.8%)",
    mixingRatio: "1 : 1.5",
    processingTime: "20 דקות",
  },
  "Dia Color": {
    developerVolume: "9 Vol (2.7%)",
    mixingRatio: "1 : 1.5",
    processingTime: "20 דקות",
  },
};

export function getUnderlyingPigment(targetLevel: number): UnderlyingPigment {
  const clamped = Math.max(1, Math.min(10, targetLevel));
  return UNDERLYING_PIGMENTS[clamped - 1];
}

function parseTargetLevel(shade: string): number {
  return Math.round(parseFloat(shade));
}

function getDeveloperVolume(liftNeeded: number): string {
  if (liftNeeded >= 3) return "30 Vol (9%)";
  return "20 Vol (6%)";
}

function getProcessingTime(
  liftNeeded: number,
  thickness: ConsultationInput["hairThickness"],
  grayPercentage: ConsultationInput["grayPercentage"]
): string {
  let base = 35;
  if (liftNeeded >= 3) base = 40;
  if (thickness === "fine") base -= 5;
  if (thickness === "thick") base += 5;
  if (grayPercentage === "50-100") base += 5;
  return `${base} דקות`;
}

function isWarmTone(tone: string): boolean {
  return ["3", "4", "5", "6"].includes(tone);
}

export function calculateFormula(input: ConsultationInput): FormulaResult {
  const targetLevel = parseTargetLevel(input.targetShade);
  const liftNeeded = targetLevel - input.naturalRootBase;
  const needsGrayCoverage = input.grayPercentage === "50-100";

  const pigment = getUnderlyingPigment(targetLevel);

  // --- Roots (Zone 1) — always Majirel ---
  const rootsDeveloper = getDeveloperVolume(Math.max(0, liftNeeded));

  let baseShade: string | null = null;
  let mixRatio = "";
  let grayCoverageNote: string | null = null;

  if (needsGrayCoverage) {
    const baseLevel = Math.min(targetLevel, input.naturalRootBase);
    baseShade = `${baseLevel}.0 (בסיס טבעי)`;
    mixRatio = `${input.targetShade} + ${baseShade} (1:1)`;
    grayCoverageNote =
      "שיער אפור מעל 50%: יש לערבב את הגוון הנבחר 1:1 עם בסיס טבעי/זהב לכיסוי מלא";
  }

  let neutralizationNote: string | null = null;
  if (input.neutralize && liftNeeded > 0) {
    const targetTone = input.targetShade.split(".")[1] || "0";
    if (targetTone === "0" || isWarmTone(targetTone)) {
      neutralizationNote =
        `פיגמנט חם צפוי: ${pigment.pigmentHe}. ` +
        `המלצה: הוסיפ/י ¼ שפופרת ${targetLevel}.${pigment.neutralizerTone} (${pigment.neutralizerHe}) לנטרול`;
    } else {
      neutralizationNote =
        `הגוון הנבחר (${input.targetShade}) כבר מכיל טונים קרים — נטרול מובנה`;
    }
  }

  const rootsProcessingTime = getProcessingTime(
    Math.max(0, liftNeeded),
    input.hairThickness,
    input.grayPercentage
  );

  const roots: RootsFormula = {
    targetShade: input.targetShade,
    baseShade,
    mixRatio,
    developerVolume: rootsDeveloper,
    colorLine: "Majirel",
    mixingRatio: "1 : 1.5",
    grayCoverageNote,
    neutralizationNote,
    underlyingPigment: liftNeeded > 0 ? pigment : null,
    processingTime: rootsProcessingTime,
  };

  // --- Ends (Zones 2 & 3) — Majirel / Dia Light / Dia Color ---
  const currentToneHe = TONE_MAP[input.currentEndsTone]?.nameHe || "טבעי";
  const refreshShade = input.desiredEndsTone;
  const productLine = input.endsProductLine;
  const spec = PRODUCT_LINE_SPECS[productLine];

  const desiredTonePart = refreshShade.split(".")[1] || "0";
  const desiredToneHe = TONE_MAP[desiredTonePart as ToneCode]?.nameHe || desiredTonePart;
  let toneNote: string | null = null;

  const desiredFamily = desiredTonePart[0] || "0";
  if (isWarmTone(input.currentEndsTone) && !isWarmTone(desiredFamily)) {
    toneNote = `האורכים כרגע ${currentToneHe} — מומלץ גוון ${desiredToneHe} לנטרול החמימות`;
  } else if (input.currentEndsTone === desiredFamily) {
    toneNote = `רענון גוון — שמירה על ${desiredToneHe}`;
  }

  const ends: EndsFormula = {
    refreshShade,
    productLine,
    developerVolume: spec.developerVolume,
    mixingRatio: spec.mixingRatio,
    processingTime: spec.processingTime,
    toneNote,
  };

  return {
    roots,
    ends,
    input,
    createdAt: new Date().toISOString(),
  };
}
