export type GrayRange = "0-30" | "30-50" | "50-100";
export type HairThickness = "fine" | "normal" | "thick";
export type EndsProductLine = "Majirel" | "Dia Light" | "Dia Color";

export type ToneCode =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8";

export interface ConsultationInput {
  naturalRootBase: number;
  currentEndsLevel: number;
  currentEndsTone: ToneCode;
  desiredEndsTone: string;
  endsProductLine: EndsProductLine;
  targetShade: string;
  grayPercentage: GrayRange;
  hairThickness: HairThickness;
  neutralize: boolean;
}

export interface UnderlyingPigment {
  level: number;
  pigment: string;
  pigmentHe: string;
  color: string;
  neutralizer: string;
  neutralizerTone: string;
  neutralizerHe: string;
}

export interface RootsFormula {
  targetShade: string;
  baseShade: string | null;
  mixRatio: string;
  developerVolume: string;
  colorLine: string;
  mixingRatio: string;
  grayCoverageNote: string | null;
  neutralizationNote: string | null;
  underlyingPigment: UnderlyingPigment | null;
  processingTime: string;
}

export interface EndsFormula {
  refreshShade: string;
  productLine: string;
  developerVolume: string;
  mixingRatio: string;
  processingTime: string;
  toneNote: string | null;
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
