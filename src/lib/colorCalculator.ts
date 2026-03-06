import type {
  ConsultationInput,
  FormulaResult,
  RootsFormula,
  EndsFormula,
  UnderlyingPigment,
  ToneCode,
} from "./types";

// L'Oréal underlying pigment chart — pigment exposed when lifting TO this level
export const UNDERLYING_PIGMENTS: UnderlyingPigment[] = [
  { level: 1, pigment: "Darkest Red", pigmentHe: "אדום כהה מאוד", color: "#4a0404", neutralizer: "Green", neutralizerTone: ".7", neutralizerHe: "ירוק (.7)" },
  { level: 2, pigment: "Dark Red", pigmentHe: "אדום כהה", color: "#6b0f0f", neutralizer: "Green", neutralizerTone: ".7", neutralizerHe: "ירוק (.7)" },
  { level: 3, pigment: "Red Orange", pigmentHe: "אדום-כתום", color: "#8b2500", neutralizer: "Green Blue", neutralizerTone: ".17", neutralizerHe: "ירוק-כחול (.17)" },
  { level: 4, pigment: "Dark Orange", pigmentHe: "כתום כהה", color: "#b44d12", neutralizer: "Blue", neutralizerTone: ".1", neutralizerHe: "כחול/אש (.1)" },
  { level: 5, pigment: "Orange", pigmentHe: "כתום", color: "#d4771a", neutralizer: "Blue", neutralizerTone: ".1", neutralizerHe: "כחול/אש (.1)" },
  { level: 6, pigment: "Gold Orange", pigmentHe: "כתום-זהב", color: "#d4951a", neutralizer: "Blue Violet", neutralizerTone: ".12", neutralizerHe: "כחול-סגול (.12)" },
  { level: 7, pigment: "Gold", pigmentHe: "זהב", color: "#d4b01a", neutralizer: "Violet Blue", neutralizerTone: ".21", neutralizerHe: "סגול-כחול (.21)" },
  { level: 8, pigment: "Yellow Gold", pigmentHe: "צהוב-זהב", color: "#e6c84a", neutralizer: "Violet", neutralizerTone: ".2", neutralizerHe: "סגול (.2)" },
  { level: 9, pigment: "Yellow", pigmentHe: "צהוב", color: "#f0d860", neutralizer: "Violet", neutralizerTone: ".2", neutralizerHe: "סגול (.2)" },
  { level: 10, pigment: "Pale Yellow", pigmentHe: "צהוב בהיר", color: "#f5e88a", neutralizer: "Pale Violet", neutralizerTone: ".2", neutralizerHe: "סגול בהיר (.2)" },
];

export const TONE_MAP: Record<ToneCode, { name: string; nameHe: string }> = {
  "0": { name: "Natural", nameHe: "טבעי" },
  "1": { name: "Ash", nameHe: "אש (כחול)" },
  "2": { name: "Iridescent", nameHe: "אירידסנט (סגול)" },
  "3": { name: "Gold", nameHe: "זהב" },
  "4": { name: "Copper", nameHe: "נחושת" },
  "5": { name: "Mahogany", nameHe: "מהגוני" },
  "6": { name: "Red", nameHe: "אדום" },
  "7": { name: "Green", nameHe: "ירוק (מאט)" },
  "8": { name: "Mocha", nameHe: "מוקה" },
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
  const isMajirel = input.colorLine === "majirel";
  const needsGrayCoverage = input.grayPercentage === "50-100";

  // --- Underlying Pigment ---
  const pigment = getUnderlyingPigment(targetLevel);

  // --- Roots (Zone 1) ---
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

  const rootsMixingRatio = isMajirel ? "1 : 1.5" : "1 : 1";
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
    colorLine: isMajirel ? "Majirel" : "iNOA",
    mixingRatio: rootsMixingRatio,
    grayCoverageNote,
    neutralizationNote,
    underlyingPigment: liftNeeded > 0 ? pigment : null,
    processingTime: rootsProcessingTime,
  };

  // --- Ends (Zones 2 & 3) ---
  const currentTone = TONE_MAP[input.currentEndsTone];
  const desiredTone = TONE_MAP[input.desiredEndsTone];
  const endsLevel = Math.max(targetLevel, input.currentEndsLevel);
  let toneNote: string | null = null;

  let endsProductLine: string;
  let endsDeveloper: string;
  let endsMixingRatio: string;
  let endsProcessingTime: string;
  let refreshShade: string;

  if (isMajirel) {
    endsProductLine = "Dia Light / Dia Color";
    endsDeveloper = "6 Vol (1.8%)";
    endsMixingRatio = "1 : 1.5";
    endsProcessingTime = "20 דקות";
    refreshShade = `${endsLevel}.${input.desiredEndsTone === "0" ? (input.targetShade.split(".")[1] || "0") : input.desiredEndsTone}`;

    if (isWarmTone(input.currentEndsTone) && !isWarmTone(input.desiredEndsTone)) {
      toneNote = `האורכים כרגע ${currentTone.nameHe} — מומלץ גוון ${desiredTone.nameHe} לנטרול החמימות`;
    } else if (input.currentEndsTone === input.desiredEndsTone) {
      toneNote = `רענון גוון — שמירה על ${desiredTone.nameHe}`;
    }
  } else {
    endsProductLine = "iNOA (רענון צבע)";
    endsDeveloper = "10 Vol (3%)";
    endsMixingRatio = "1 : 1";
    endsProcessingTime = "20 דקות";
    refreshShade = `${endsLevel}.${input.desiredEndsTone === "0" ? (input.targetShade.split(".")[1] || "0") : input.desiredEndsTone}`;

    if (isWarmTone(input.currentEndsTone) && !isWarmTone(input.desiredEndsTone)) {
      toneNote = `האורכים כרגע ${currentTone.nameHe} — מומלץ גוון ${desiredTone.nameHe} לנטרול`;
    } else if (input.currentEndsTone === input.desiredEndsTone) {
      toneNote = `רענון גוון — שמירה על ${desiredTone.nameHe}`;
    }
  }

  const ends: EndsFormula = {
    refreshShade,
    productLine: endsProductLine,
    developerVolume: endsDeveloper,
    mixingRatio: endsMixingRatio,
    processingTime: endsProcessingTime,
    toneNote,
  };

  return {
    roots,
    ends,
    input,
    createdAt: new Date().toISOString(),
  };
}
