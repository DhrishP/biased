import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { Button } from "./Button";
import Markdown from "react-native-markdown-display";

interface PreviewModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  previewText: string;
  isLoading: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  visible,
  onClose,
  onConfirm,
  previewText,
  isLoading,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Preview</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Generating preview...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Here's a preview of your analysis. Would you like to proceed?
                </Text>
                <ScrollView style={styles.previewContainer}>
                  <Markdown style={markdownStyles}>
                    {previewText || "No preview available"}
                  </Markdown>
                </ScrollView>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Cancel"
                    onPress={onClose}
                    style={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                  <Button
                    title="Proceed with Analysis"
                    onPress={onConfirm}
                    style={styles.confirmButton}
                  />
                </View>
              </>
            )}
          </View>
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
  previewContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    maxHeight: 300,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
  },
  confirmButton: {
    flex: 2,
    marginLeft: 8,
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
