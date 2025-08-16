import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { AnalysisResult } from "@/types/analysis";
import { biasTypes } from "@/constants/biases";

interface AnalysisHistoryItemProps {
  item: AnalysisResult;
  onPress: () => void;
}

export const AnalysisHistoryItem: React.FC<AnalysisHistoryItemProps> = ({
  item,
  onPress,
}) => {
  const date = new Date(item.timestamp);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;
  // Get the top bias
  const topBias = item.results[0];
  const topBiasInfo = topBias
    ? biasTypes.find((b) => b.id === topBias.id)
    : null;
  // Truncate text if it's too long
  const truncatedText =
    item.text.length > 60 ? `${item.text.substring(0, 60)}...` : item.text;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.text} numberOfLines={1}>
          {truncatedText}
        </Text>

        {topBiasInfo && (
          <View style={styles.biasContainer}>
            <Text style={styles.biasLabel}>Top bias:</Text>
            <Text style={styles.biasName}>{topBiasInfo.name}</Text>
            <Text style={styles.biasPercentage}>{topBias.percentage}%</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  biasContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  biasLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginRight: 4,
  },
  biasName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 4,
  },
  biasPercentage: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
});
