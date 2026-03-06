export type GrayRange = "0-30" | "30-50" | "50-100";
export type HairThickness = "fine" | "normal" | "thick";
export type EndsProductLine = "Majirel" | "Dia Light" | "Dia Color";
export type ServiceType = "majirel" | "highLift" | "bleach";
export type BleachTechnique = "balayage" | "foils" | "global";

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
  serviceType: ServiceType;
  naturalRootBase: number;
  currentEndsLevel: number;
  currentEndsTone: ToneCode;
  grayPercentage: GrayRange;
  hairThickness: HairThickness;
  // Majirel mode
  targetShade: string;
  neutralize: boolean;
  desiredEndsTone: string;
  endsProductLine: EndsProductLine;
  // High Lift mode
  highLiftShade: string;
  highLiftDeveloper: string;
  // Bleach mode
  bleachProduct: string;
  bleachTechnique: BleachTechnique;
  bleachDeveloper: string;
  tonerProductLine: string;
  tonerShade: string;
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
  recommendationNote: string | null;
}

export interface HighLiftFormula {
  shade: string;
  shadeNameHe: string;
  developerVolume: string;
  mixingRatio: string;
  processingTime: string;
  notes: string[];
}

export interface BleachFormula {
  product: string;
  productNameHe: string;
  technique: string;
  techniqueHe: string;
  developerVolume: string;
  mixingRatio: string;
  processingTime: string;
  maxLift: string;
  notes: string[];
}

export interface TonerFormula {
  productLine: string;
  shade: string;
  developerVolume: string;
  mixingRatio: string;
  processingTime: string;
  note: string | null;
}

export interface FormulaResult {
  serviceType: ServiceType;
  roots?: RootsFormula;
  ends?: EndsFormula;
  highLift?: HighLiftFormula;
  bleach?: BleachFormula;
  toner?: TonerFormula;
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
