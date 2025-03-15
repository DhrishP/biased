export interface BiasResult {
  id: string;
  percentage: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  text: string;
  results: BiasResult[];
  summary: string;
}
