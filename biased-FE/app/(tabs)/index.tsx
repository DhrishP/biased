import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { Button } from "@/components/Button";
import { useAnalysisStore } from "@/store/analysisStore";
import { PreviewModal } from "@/components/PreviewModal";
import { getTextPreview } from "@/utils/api";

export default function AnalyzeScreen() {
  const [text, setText] = useState("");
  const { analyze, isAnalyzing } = useAnalysisStore();
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const handleGetPreview = async () => {
    if (!text.trim()) return;

    setIsLoadingPreview(true);
    setIsPreviewVisible(true);

    try {
      const preview = await getTextPreview(text);
      if (!preview) {
        throw new Error("No preview text received");
      }
      setPreviewText(preview);
    } catch (error) {
      console.error("Preview failed:", error);
      setPreviewText("Failed to generate preview. Please try again.");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsPreviewVisible(false);

    try {
      await analyze(text);
      router.push("/results");
    } catch (error) {
      console.error("Analysis failed:", error);
      // Handle error
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
              <Ionicons name="brain" size={40} color={colors.primary} />
              <Text style={styles.title}>Cognitive Bias Detector</Text>
              <Text style={styles.subtitle}>
                Enter your thoughts, opinions, or arguments to analyze for
                cognitive biases
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Start typing here..."
                placeholderTextColor={colors.textLight}
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Analyze"
                onPress={handleGetPreview}
                loading={isAnalyzing || isLoadingPreview}
                disabled={!text.trim() || isAnalyzing || isLoadingPreview}
              />
            </View>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips for better analysis:</Text>
              <Text style={styles.tipText}>
                • Write at least a paragraph for more accurate results
              </Text>
              <Text style={styles.tipText}>
                • Express your genuine opinions and reasoning
              </Text>
              <Text style={styles.tipText}>
                • Include your thought process and assumptions
              </Text>
              <Text style={styles.tipText}>
                • Be specific rather than general
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <PreviewModal
          visible={isPreviewVisible}
          onClose={() => setIsPreviewVisible(false)}
          onConfirm={handleAnalyze}
          previewText={previewText}
          isLoading={isLoadingPreview}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
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
  inputContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  textInput: {
    minHeight: 150,
    padding: 16,
    fontSize: 16,
    color: colors.text,
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
