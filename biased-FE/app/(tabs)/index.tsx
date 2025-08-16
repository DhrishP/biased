import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { Button } from "@/components/Button";
import { useAnalysisStore } from "@/store/analysisStore";
import { QuickScanModal } from "@/components/PreviewModal";

export default function AnalyzeScreen() {
  const { analyze, isAnalyzing } = useAnalysisStore();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAnalyze = async (fullText: string) => {
    if (!fullText.trim()) return;
    setIsModalVisible(false);

    try {
      await analyze(fullText);
      router.push("/results");
    } catch (error) {
      console.error("Analysis failed:", error);
      // Handle error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Ionicons name="bulb-outline" size={40} color={colors.primary} />
            <Text style={styles.title}>Cognitive Bias Detector</Text>
            <Text style={styles.subtitle}>
              Uncover hidden biases in your thoughts and arguments.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Start Analysis"
              onPress={() => setIsModalVisible(true)}
              loading={isAnalyzing}
              disabled={isAnalyzing}
            />
          </View>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>How it works:</Text>
            <Text style={styles.tipText}>
              • You'll be guided through a few quick questions.
            </Text>
            <Text style={styles.tipText}>
              • Answer them to provide context about your thought.
            </Text>
            <Text style={styles.tipText}>
              • Our AI will then analyze your input for cognitive biases.
            </Text>
            <Text style={styles.tipText}>
              • The more context you give, the better the analysis!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <QuickScanModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleAnalyze}
        isLoading={isAnalyzing}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  tipsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
});
