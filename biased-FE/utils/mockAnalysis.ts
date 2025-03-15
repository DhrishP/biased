import { BiasResult, AnalysisResult } from "@/types/analysis";
import { biasTypes, BiasType } from "@/constants/biases";

// Generate random bias results
export const generateBiasResults = (): BiasResult[] => {
  // Randomly select 2-4 biases
  const shuffled = [...biasTypes].sort(() => 0.5 - Math.random());
  const selectedBiases = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);

  // Generate random percentages that sum to 100
  let remainingPercentage = 100;
  const results: BiasResult[] = [];

  selectedBiases.forEach((bias, index) => {
    if (index === selectedBiases.length - 1) {
      // Last bias gets the remainder
      results.push({
        id: bias.id,
        percentage: remainingPercentage,
      });
    } else {
      // Generate a random percentage for this bias
      const max = remainingPercentage - (selectedBiases.length - index - 1) * 5;
      const min = 5;
      const percentage = Math.floor(Math.random() * (max - min + 1)) + min;

      results.push({
        id: bias.id,
        percentage,
      });

      remainingPercentage -= percentage;
    }
  });

  return results;
};

// Generate a summary based on the analysis results
export const generateSummary = (results: BiasResult[]): string => {
  if (results.length === 0) return "No significant cognitive biases detected.";

  const topBias = results[0];
  const topBiasInfo = biasTypes.find((b) => b.id === topBias.id);

  if (!topBiasInfo)
    return "Analysis complete. Review the breakdown for details.";

  if (topBias.percentage > 50) {
    return `Your thinking shows strong signs of ${topBiasInfo.name} (${topBias.percentage}%). ${topBiasInfo.description}`;
  } else if (results.length >= 2) {
    const secondBias = results[1];
    const secondBiasInfo = biasTypes.find((b) => b.id === secondBias.id);

    if (secondBiasInfo) {
      return `Your thinking shows a mix of ${topBiasInfo.name} (${topBias.percentage}%) and ${secondBiasInfo.name} (${secondBias.percentage}%).`;
    }
  }

  return `Your thinking shows moderate signs of ${topBiasInfo.name} (${topBias.percentage}%).`;
};

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Analyze text and return a mock analysis result
export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate random bias results
  const results = generateBiasResults();

  // Sort results by percentage in descending order
  results.sort((a, b) => b.percentage - a.percentage);

  // Generate a summary based on the results
  const summary = generateSummary(results);

  // Return the analysis result
  return {
    id: generateId(),
    timestamp: Date.now(),
    text,
    results,
    summary,
  };
};
