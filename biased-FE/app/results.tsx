import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { useAnalysisStore } from "@/store/analysisStore";
import { PieChart } from "@/components/PieChart";
import { BiasCard } from "@/components/BiasCard";
import { biasTypes } from "@/constants/biases";
import { Button } from "@/components/Button";
import { BiasResult } from "@/types/analysis";
import Markdown from "react-native-markdown-display";

export default function ResultsScreen() {
  const { currentAnalysis } = useAnalysisStore();

  // If no analysis is available, redirect to home
  React.useEffect(() => {
    if (!currentAnalysis) {
      router.replace("/");
    }
  }, [currentAnalysis]);

  if (!currentAnalysis) {
    return null;
  }

  const handleShare = async () => {
    try {
      // Create a shareable text summary
      const biasText = currentAnalysis.results
        .map((bias: BiasResult) => {
          const biasInfo = biasTypes.find((b) => b.id === bias.id);
          return `${biasInfo?.name || bias.id}: ${bias.percentage}%`;
        })
        .join("\n");

      const shareText = `Cognitive Bias Analysis Results: \n\n${currentAnalysis.summary}\n\nBreakdown: \n${biasText}`;

      await Share.share({
        message: shareText,
        title: "My Cognitive Bias Analysis",
      });
    } catch (error) {
      console.error("Error sharing results:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Analysis Results",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Markdown style={markdownStyles}>
              {currentAnalysis.summary}
            </Markdown>
          </View>
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Bias Breakdown</Text>
            <PieChart data={currentAnalysis.results} />
          </View>
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
            {currentAnalysis.results.map((result: BiasResult) => {
              const biasInfo = biasTypes.find((b) => b.id === result.id);
              if (!biasInfo) return null;
              return (
                <BiasCard
                  key={result.id}
                  bias={biasInfo}
                  percentage={result.percentage}
                />
              );
            })}
          </View>
          <View style={styles.textSection}>
            <Text style={styles.sectionTitle}>Analyzed Text</Text>
            <View style={styles.textContainer}>
              <Text style={styles.analyzedText}>{currentAnalysis.text}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="New Analysis"
              onPress={() => router.replace("/")}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
  },
  summaryContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  chartSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 20,
  },
  textSection: {
    marginBottom: 24,
  },
  textContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  analyzedText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    width: 200,
  },
});

const markdownStyles = {
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700" as const,
    marginVertical: 12,
  },
  heading2: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600" as const,
    marginVertical: 10,
  },
  heading3: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600" as const,
    marginVertical: 8,
  },
  paragraph: {
    marginVertical: 8,
  },
  list: {
    marginVertical: 8,
  },
  listItem: {
    marginVertical: 4,
  },
  strong: {
    fontWeight: "700" as const,
  },
  em: {
    fontStyle: "italic" as const,
  },
  code: {
    backgroundColor: colors.border,
    padding: 4,
    borderRadius: 4,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  link: {
    color: colors.primary,
    textDecorationLine: "underline" as const,
  },
};
