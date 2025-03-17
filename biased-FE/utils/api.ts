import { AnalysisResult, BiasResult } from "@/types/analysis";
import Constants from "expo-constants";

// Get API URL from environment variables or use a default
const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://biased-be.yourdomain.workers.dev";

// Interface for the backend response
interface BiasAnalysisResponse {
  id: string;
  text: string;
  results: BiasResult[];
  summary: string;
  timestamp: number;
}

// Interface for the preview response
interface PreviewResponse {
  text: string;
}

// Analyze text
export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(`${API_URL}/analyse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || `Analysis request failed with status ${response.status}`
      );
    }

    const data: BiasAnalysisResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};

// Get text preview
export const getTextPreview = async (text: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || `Preview request failed with status ${response.status}`
      );
    }
    console.log("response", response.text);

    const data: PreviewResponse = await response.json();
    if (!data || typeof data.text !== "string") {
      throw new Error("Invalid preview response format");
    }
    return data.text;
  } catch (error) {
    console.error("Error getting preview:", error);
    throw error;
  }
};

// Get analysis history
export const getAnalysisHistory = async (): Promise<AnalysisResult[]> => {
  try {
    const response = await fetch(`${API_URL}/history`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || `History request failed with status ${response.status}`
      );
    }

    const data: BiasAnalysisResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
};
