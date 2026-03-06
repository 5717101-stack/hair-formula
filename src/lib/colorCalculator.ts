import type { ConsultationInput, FormulaResult, RootsFormula, EndsFormula } from "./types";

function parseTargetLevel(shade: string): number {
  const level = parseFloat(shade);
  return Math.round(level);
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
  return `${base} min`;
}

export function calculateFormula(input: ConsultationInput): FormulaResult {
  const targetLevel = parseTargetLevel(input.targetShade);
  const liftNeeded = targetLevel - input.naturalRootBase;

  const isMajirel = input.colorLine === "majirel";
  const needsGrayCoverage = input.grayPercentage === "50-100";

  // --- Roots (Zone 1) ---
  const rootsDeveloper = getDeveloperVolume(Math.max(0, liftNeeded));

  let baseShade: string | null = null;
  let mixRatio = "";
  let grayCoverageNote: string | null = null;

  if (needsGrayCoverage) {
    const baseLevel = Math.min(targetLevel, input.naturalRootBase);
    baseShade = `${baseLevel}.0 (Natural Base)`;
    mixRatio = `${input.targetShade} + ${baseShade} (1:1)`;
    grayCoverageNote =
      "Gray > 50%: Mix target shade 1:1 with a natural/gold base for full coverage";
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
    processingTime: rootsProcessingTime,
  };

  // --- Ends (Zones 2 & 3) ---
  let endsProductLine: string;
  let endsDeveloper: string;
  let endsMixingRatio: string;
  let endsProcessingTime: string;
  let refreshShade: string;

  if (isMajirel) {
    endsProductLine = "Dia Light / Dia Richesse";
    endsDeveloper = "6 Vol (1.8%)";
    endsMixingRatio = "1 : 1.5";
    endsProcessingTime = "20 min";
    const endsLevel = Math.max(
      targetLevel,
      input.currentEndsColor
    );
    refreshShade = `${endsLevel}.${input.targetShade.split(".")[1] || "0"} Gloss`;
  } else {
    endsProductLine = "iNOA (Color Refresh)";
    endsDeveloper = "10 Vol (3%)";
    endsMixingRatio = "1 : 1";
    endsProcessingTime = "20 min";
    const endsLevel = Math.max(
      targetLevel,
      input.currentEndsColor
    );
    refreshShade = `${endsLevel}.${input.targetShade.split(".")[1] || "0"}`;
  }

  const ends: EndsFormula = {
    refreshShade,
    productLine: endsProductLine,
    developerVolume: endsDeveloper,
    mixingRatio: endsMixingRatio,
    processingTime: endsProcessingTime,
  };

  return {
    roots,
    ends,
    input,
    createdAt: new Date().toISOString(),
  };
}
