export type GrayRange = "0-30" | "30-50" | "50-100";
export type HairThickness = "fine" | "normal" | "thick";
export type ColorLine = "majirel" | "inoa";

export interface ConsultationInput {
  naturalRootBase: number;
  currentEndsColor: number;
  targetShade: string;
  grayPercentage: GrayRange;
  hairThickness: HairThickness;
  colorLine: ColorLine;
}

export interface RootsFormula {
  targetShade: string;
  baseShade: string | null;
  mixRatio: string;
  developerVolume: string;
  colorLine: string;
  mixingRatio: string;
  grayCoverageNote: string | null;
  processingTime: string;
}

export interface EndsFormula {
  refreshShade: string;
  productLine: string;
  developerVolume: string;
  mixingRatio: string;
  processingTime: string;
}

export interface FormulaResult {
  roots: RootsFormula;
  ends: EndsFormula;
  input: ConsultationInput;
  createdAt: string;
}

export interface ClientVisit {
  id: string;
  date: string;
  formula: FormulaResult;
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  visits: ClientVisit[];
  createdAt: string;
}
