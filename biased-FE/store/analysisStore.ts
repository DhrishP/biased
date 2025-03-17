import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnalysisResult } from "@/types/analysis";
import { analyzeText as apiAnalyzeText, getAnalysisHistory } from "@/utils/api";

interface AnalysisState {
  history: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  isLoadingHistory: boolean;
  analyze: (text: string) => Promise<AnalysisResult>;
  fetchHistory: () => Promise<void>;
  clearHistory: () => void;
  removeAnalysis: (id: string) => void;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      history: [] as AnalysisResult[],
      currentAnalysis: null,
      isAnalyzing: false,
      isLoadingHistory: false,
      analyze: async (text: string) => {
        set({ isAnalyzing: true });
        try {
          const result = await apiAnalyzeText(text);
          set((state) => ({
            history: [result, ...state.history],
            currentAnalysis: result,
            isAnalyzing: false,
          }));
          return result;
        } catch (error) {
          set({ isAnalyzing: false });
          throw error;
        }
      },
      fetchHistory: async () => {
        set({ isLoadingHistory: true });
        try {
          const historyData = await getAnalysisHistory();
          set({ history: historyData, isLoadingHistory: false });
        } catch (error) {
          console.error("Failed to fetch history:", error);
          set({ isLoadingHistory: false });
        }
      },
      clearHistory: () => {
        set({ history: [] });
      },
      removeAnalysis: (id: string) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
          currentAnalysis:
            state.currentAnalysis?.id === id ? null : state.currentAnalysis,
        }));
      },
      setCurrentAnalysis: (analysis: AnalysisResult | null) => {
        set({ currentAnalysis: analysis });
      },
    }),
    {
      name: "analysis-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
