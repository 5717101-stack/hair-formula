import type {
  ConsultationInput,
  FormulaResult,
  RootsFormula,
  EndsFormula,
  HighLiftFormula,
  BleachFormula,
  TonerFormula,
  EndsProductLine,
  BleachTechnique,
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

// ─── High Lift ───

export interface HighLiftShade {
  code: string;
  nameHe: string;
}

export const HIGH_LIFT_SHADES: HighLiftShade[] = [
  { code: "Neutral", nameHe: "ניטרלי" },
  { code: "Ash", nameHe: "אפור (אש)" },
  { code: "Ash+", nameHe: "אפור אינטנסיבי" },
  { code: "Ash Violet", nameHe: "אפור סגול" },
  { code: "Violet", nameHe: "סגול" },
  { code: "Violet+", nameHe: "סגול אינטנסיבי" },
  { code: "Violet Ash", nameHe: "סגול אפור" },
  { code: "Beige", nameHe: "בז׳" },
  { code: "Gold Irisé", nameHe: "זהב אריזה" },
];

export const HIGH_LIFT_DEVELOPERS = ["30 Vol (9%)", "40 Vol (12%)"];

// ─── Blond Studio (Bleach) ───

export interface BlondStudioProduct {
  code: string;
  name: string;
  nameHe: string;
  maxLift: string;
  developerType: "oil" | "nutri";
}

export const BLOND_STUDIO_PRODUCTS: BlondStudioProduct[] = [
  { code: "studio9", name: "Blond Studio 9", nameHe: "אבקה 9 רמות", maxLift: "9 רמות", developerType: "oil" },
  { code: "bonder9", name: "9 Bonder Inside", nameHe: "אבקה + בונדר 9 רמות", maxLift: "9 רמות", developerType: "oil" },
  { code: "studio8", name: "Blond Studio 8", nameHe: "אבקה 8 רמות", maxLift: "8 רמות", developerType: "oil" },
  { code: "clay", name: "Blond Studio Clay", nameHe: "קליי (ללא אמוניה) 7 רמות", maxLift: "7 רמות", developerType: "oil" },
  { code: "platinium", name: "Platinium Plus", nameHe: "פלטינום פלוס (משחה) 7 רמות", maxLift: "7 רמות", developerType: "nutri" },
  { code: "purple", name: "Purple Lightening Balm", nameHe: "באלם סגול מנטרל 8 רמות", maxLift: "8 רמות", developerType: "nutri" },
];

export interface BleachTechniqueSpec {
  code: BleachTechnique;
  nameHe: string;
  ratio: string;
}

export const BLEACH_TECHNIQUES: BleachTechniqueSpec[] = [
  { code: "balayage", nameHe: "בלאייאז׳", ratio: "1 : 1" },
  { code: "foils", nameHe: "פויל / שקיות", ratio: "1 : 1.5" },
  { code: "global", nameHe: "כללי (כל הראש)", ratio: "1 : 2" },
];

export const BLEACH_DEVELOPERS_OIL = ["20 Vol (6%)", "30 Vol (9%)"];
export const BLEACH_DEVELOPERS_NUTRI = ["20 Vol (6%)", "30 Vol (9%)", "40 Vol (12%)"];

// ─── Toner after bleach ───

export type TonerProductLine = "Dia Light" | "Dia Color";

export const TONER_PRODUCT_SPECS: Record<TonerProductLine, { developerVolume: string; mixingRatio: string; processingTime: string }> = {
  "Dia Light": {
    developerVolume: "6 Vol (1.8%)",
    mixingRatio: "1 : 1.5",
    processingTime: "10-20 דקות",
  },
  "Dia Color": {
    developerVolume: "9 Vol (2.7%)",
    mixingRatio: "1 : 1.5",
    processingTime: "20 דקות",
  },
};

export const TONER_SHADES = [
  "10.01", "10.02", "10.12", "10.13", "10.18", "10.21", "10.22", "10.23", "10.32", "10.82",
  "9.01", "9.02", "9.1", "9.11", "9.12", "9.13", "9.18", "9.21", "9.31", "9.82",
  "8.1", "8.18", "8.21", "8.23",
  "7.01", "7.12", "7.13", "7.31", "7.8",
  "6.1", "6.11", "6.13", "6.23",
  "5.1", "5.07", "5.31",
];

// ─── Helpers ───

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

// ─── Auto-recommend product line for ends ───

interface EndsRecommendation {
  productLine: EndsProductLine;
  recommendationNote: string;
}

function recommendEndsProduct(
  currentEndsLevel: number,
  desiredEndsTone: string,
  grayPercentage: ConsultationInput["grayPercentage"],
  isHighLift: boolean
): EndsRecommendation {
  if (isHighLift) {
    return {
      productLine: "Dia Light",
      recommendationNote: "המלצת L'Oréal: Dia Light לרענון אורכים לאחר High Lift — pH חומצי, סוגר קוטיקולות ונותן ברק מקסימלי",
    };
  }

  const desiredLevel = Math.round(parseFloat(desiredEndsTone));
  const levelDiff = desiredLevel - currentEndsLevel;

  if (levelDiff > 0) {
    return {
      productLine: "Majirel",
      recommendationNote: `האורכים צריכים הרמה של ${levelDiff} רמות — רק צבע קבוע (Majirel) יכול להבהיר. מפתח 20 Vol`,
    };
  }

  if (grayPercentage === "50-100") {
    return {
      productLine: "Dia Color",
      recommendationNote: "שיער אפור מעל 50% באורכים — Dia Color אלקליני, נותן כיסוי עד 70% ו-deposit עמוק יותר",
    };
  }

  return {
    productLine: "Dia Light",
    recommendationNote: "Dia Light — רענון וברק. pH חומצי, סוגר קוטיקולות, 30% יותר לחות, ללא הרמה. אידיאלי לשיער שנצבע בעבר",
  };
}

// ─── Main Calculator ───

function calculateMajirel(input: ConsultationInput): FormulaResult {
  const targetLevel = parseTargetLevel(input.targetShade);
  const liftNeeded = targetLevel - input.naturalRootBase;
  const needsGrayCoverage = input.grayPercentage === "50-100";
  const pigment = getUnderlyingPigment(targetLevel);

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

  const ends = buildEndsFormula(input, false);

  return { serviceType: "majirel", roots, ends, input, createdAt: new Date().toISOString() };
}

function calculateHighLift(input: ConsultationInput): FormulaResult {
  const shade = HIGH_LIFT_SHADES.find((s) => s.code === input.highLiftShade);
  const notes: string[] = [];

  if (input.naturalRootBase < 5) {
    notes.push("⚠️ High Lift מתאים לבסיס טבעי 5 ומעלה. לבסיסים כהים יותר מומלץ הבהרה.");
  }
  if (input.grayPercentage === "50-100") {
    notes.push("High Lift מכסה עד 30% שיער אפור בלבד. לכיסוי אפור מלא מומלץ Majirel.");
  }

  const highLift: HighLiftFormula = {
    shade: input.highLiftShade,
    shadeNameHe: shade?.nameHe || input.highLiftShade,
    developerVolume: input.highLiftDeveloper,
    mixingRatio: "1 : 2",
    processingTime: "50 דקות",
    notes,
  };

  const ends = buildEndsFormula(input, true);

  return { serviceType: "highLift", highLift, ends, input, createdAt: new Date().toISOString() };
}

function buildEndsFormula(input: ConsultationInput, isHighLift: boolean): EndsFormula {
  const currentToneHe = TONE_MAP[input.currentEndsTone]?.nameHe || "טבעי";
  const refreshShade = input.desiredEndsTone;

  const rec = recommendEndsProduct(
    input.currentEndsLevel,
    input.desiredEndsTone,
    input.grayPercentage,
    isHighLift
  );
  const productLine = rec.productLine;
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

  return {
    refreshShade,
    productLine,
    developerVolume: spec.developerVolume,
    mixingRatio: spec.mixingRatio,
    processingTime: spec.processingTime,
    toneNote,
    recommendationNote: rec.recommendationNote,
  };
}

function calculateBleach(input: ConsultationInput): FormulaResult {
  const product = BLOND_STUDIO_PRODUCTS.find((p) => p.code === input.bleachProduct);
  const technique = BLEACH_TECHNIQUES.find((t) => t.code === input.bleachTechnique);

  const bleach: BleachFormula = {
    product: product?.name || input.bleachProduct,
    productNameHe: product?.nameHe || input.bleachProduct,
    technique: technique?.code || input.bleachTechnique,
    techniqueHe: technique?.nameHe || input.bleachTechnique,
    developerVolume: input.bleachDeveloper,
    mixingRatio: technique?.ratio || "1 : 1.5",
    processingTime: "עד 50 דקות",
    maxLift: product?.maxLift || "",
  };

  const tonerLine = input.tonerProductLine as TonerProductLine;
  const tonerSpec = TONER_PRODUCT_SPECS[tonerLine] || TONER_PRODUCT_SPECS["Dia Light"];

  const toner: TonerFormula = {
    productLine: input.tonerProductLine,
    shade: input.tonerShade,
    developerVolume: tonerSpec.developerVolume,
    mixingRatio: tonerSpec.mixingRatio,
    processingTime: tonerSpec.processingTime,
  };

  return { serviceType: "bleach", bleach, toner, input, createdAt: new Date().toISOString() };
}

export function calculateFormula(input: ConsultationInput): FormulaResult {
  switch (input.serviceType) {
    case "highLift":
      return calculateHighLift(input);
    case "bleach":
      return calculateBleach(input);
    default:
      return calculateMajirel(input);
  }
}
