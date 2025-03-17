import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { colors } from "@/constants/Colors";
import { BiasType } from "@/constants/biases";

interface BiasCardProps {
  bias: BiasType;
  percentage: number;
}

export const BiasCard: React.FC<BiasCardProps> = ({ bias, percentage }) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{bias.name}</Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={colors.textLight} />
        ) : (
          <ChevronDown size={20} color={colors.textLight} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{bias.description}</Text>
          <Text style={styles.sectionTitle}>How to counteract</Text>
          <Text style={styles.description}>{bias.counteraction}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  percentage: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 8,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textLight,
    marginTop: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
