import { AnalysisResult, BiasResult } from "@/types/analysis";
import Constants from "expo-constants";

// Get API URL from environment variables or use a default
const API_URL = (() => {
  try {
    return (
      Constants.expoConfig?.extra?.apiUrl ||
      "https://biased-be.parekhdhrish-pg.workers.dev"
    );
  } catch (error) {
    console.error("Error loading API URL from config:", error);
    // Fallback to production URL
    return "https://biased-be.parekhdhrish-pg.workers.dev";
  }
})();

// Log the API URL being used (this will help with debugging)
console.log("Using API URL:", API_URL);

// Interface for the backend response
interface BiasAnalysisResponse {
  id: string;
  text: string;
  results: BiasResult[];
  summary: string;
  timestamp: number;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
}

interface QuestionsResponse {
  questions: GeneratedQuestion[];
}

interface TranscriptionResponse {
  text: string;
}

// Analyze text
export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  try {
    console.log("Attempting to analyze text with API:", API_URL);

    if (!text || typeof text !== "string") {
      throw new Error("Invalid text input");
    }

    const response = await fetch(`${API_URL}/analyse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      let errorMessage = `Analysis request failed with status ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        // If parsing error response fails, use the default message
      }
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    const data: BiasAnalysisResponse = await response.json();

    // Validate response data
    if (!data || !data.id || !Array.isArray(data.results)) {
      throw new Error("Invalid response format from server");
    }

    return data;
  } catch (error) {
    console.error("Error analyzing text:", error);
    // Rethrow with a user-friendly message
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while analyzing text"
    );
  }
};

// Generate questions
export const generateQuestions = async (
  text: string
): Promise<GeneratedQuestion[]> => {
  try {
    const response = await fetch(`${API_URL}/generate-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error ||
          `Question generation request failed with status ${response.status}`
      );
    }

    const data: QuestionsResponse = await response.json();
    if (!data || !Array.isArray(data.questions)) {
      throw new Error("Invalid questions response format");
    }
    return data.questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

// Transcribe audio
export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    const response = await fetch(audioUri);
    const audioBlob = await response.blob();

    const transcriptionResponse = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      headers: {
        "Content-Type": audioBlob.type,
      },
      body: audioBlob,
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.json();
      throw new Error(
        error.error ||
          `Transcription request failed with status ${transcriptionResponse.status}`
      );
    }

    const data: TranscriptionResponse = await transcriptionResponse.json();
    if (!data || typeof data.text !== "string") {
      throw new Error("Invalid transcription response format");
    }
    return data.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
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
