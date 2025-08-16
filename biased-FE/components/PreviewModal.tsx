import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { Button } from "./Button";
import { GeneratedQuestion, generateQuestions } from "@/utils/api";

interface DynamicScanModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (fullText: string) => void;
  isLoading: boolean;
}

export const QuickScanModal: React.FC<DynamicScanModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [step, setStep] = useState(0);
  const [thought, setThought] = useState("");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [extraDetails, setExtraDetails] = useState("");

  const resetState = () => {
    setStep(0);
    setThought("");
    setQuestions([]);
    setAnswers({});
    setIsGeneratingQuestions(false);
    setExtraDetails("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleGenerateQuestions = async () => {
    if (!thought) return;
    setIsGeneratingQuestions(true);
    try {
      const generated = await generateQuestions(thought);
      setQuestions(generated);
      setStep(1);
    } catch (error) {
      console.error("Failed to generate questions", error);
      // Handle error, maybe show a message to the user
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleNextQuestion = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1); // Move to final details step
    }
  };

  const handleConfirm = () => {
    let fullText = `Initial Thought: ${thought}\n\n`;
    questions.forEach((q, index) => {
      fullText += `Q: ${q.question}\nA: ${answers[index] || "Not answered"}\n\n`;
    });
    if (extraDetails) {
      fullText += `Additional Details: ${extraDetails}\n`;
    }
    onConfirm(fullText);
  };

  const renderContent = () => {
    if (isGeneratingQuestions) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Generating questions...</Text>
        </View>
      );
    }

    // Step 0: Initial thought input
    if (step === 0) {
      return (
        <View>
          <Text style={styles.subtitle}>
            What thought or doubt is on your mind?
          </Text>
          <TextInput
            style={styles.input}
            value={thought}
            onChangeText={setThought}
            placeholder="Enter your thought here..."
            multiline
          />
          <Button
            title="Next"
            onPress={handleGenerateQuestions}
            disabled={!thought}
          />
        </View>
      );
    }

    // Step 1 to questions.length: Dynamic questions
    if (step > 0 && step <= questions.length) {
      const questionIndex = step - 1;
      const currentQuestion = questions[questionIndex];
      return (
        <View>
          <Text style={styles.subtitle}>{currentQuestion.question}</Text>
          <View style={styles.tagContainer}>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.tag,
                  answers[questionIndex] === option && styles.tagSelected,
                ]}
                onPress={() => handleAnswerSelect(questionIndex, option)}
              >
                <Text
                  style={[
                    styles.tagText,
                    answers[questionIndex] === option && styles.tagTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            title="Next"
            onPress={handleNextQuestion}
            disabled={!answers[questionIndex]}
          />
        </View>
      );
    }

    // Final Step: Optional extra details
    if (step > questions.length) {
      return (
        <View>
          <Text style={styles.subtitle}>Add any other details? (Optional)</Text>
          <TextInput
            style={styles.input}
            value={extraDetails}
            onChangeText={setExtraDetails}
            placeholder="Enter any extra details here..."
            multiline
          />
          <Button title="Finish Analysis" onPress={handleConfirm} loading={isLoading} />
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Dynamic Scan</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>{renderContent()}</ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    color: colors.text,
  },
  tagTextSelected: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
});
