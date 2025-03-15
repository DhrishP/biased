import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useAnalysisStore } from "@/store/analysisStore";
import { AnalysisHistoryItem } from "@/components/AnalysisHistoryItem";
import { AnalysisResult } from "@/types/analysis";

export default function HistoryScreen() {
  const { history, setCurrentAnalysis, clearHistory } = useAnalysisStore();

  const handleItemPress = (analysis: AnalysisResult) => {
    setCurrentAnalysis(analysis);
    router.push("/results");
  };

  const confirmClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all analysis history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearHistory,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        {history.length > 0 && (
          <TouchableOpacity
            onPress={confirmClearHistory}
            style={styles.clearButton}
          >
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No analysis history yet</Text>
          <Text style={styles.emptySubtext}>
            Your previous analyses will appear here
          </Text>
          <TouchableOpacity
            style={styles.newAnalysisButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.newAnalysisText}>Start New Analysis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AnalysisHistoryItem
              item={item}
              onPress={() => handleItemPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  newAnalysisButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  newAnalysisText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
