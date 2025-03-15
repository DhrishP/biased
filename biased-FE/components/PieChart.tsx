import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { BiasResult } from "@/types/analysis";
import { biasTypes } from "@/constants/biases";
import { colors } from "@/constants/colors";

interface PieChartProps {
  data: BiasResult[];
}

// Generate colors for the pie chart segments
const generateColors = (count: number) => {
  const baseColors = [
    colors.primary,
    colors.secondary,
    colors.info,
    colors.success,
    colors.warning,
    "#9333ea", // Purple
    "#ec4899", // Pink
    "#14b8a6", // Teal
  ];

  // If we need more colors than we have, we'll cycle through them
  return Array(count)
    .fill(0)
    .map((_, i) => baseColors[i % baseColors.length]);
};

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  if (!data.length) return null;

  const chartColors = generateColors(data.length);
  let startAngle = 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.pieChart}>
          {data.map((item, index) => {
            const angle = (item.percentage / 100) * 360;
            const biasInfo = biasTypes.find((b) => b.id === item.id);

            // Create the pie segment
            const segment = (
              <View
                key={item.id}
                style={[
                  styles.pieSegment,
                  {
                    backgroundColor: chartColors[index],
                    transform: [
                      { rotate: `${startAngle}deg` },
                      { translateX: 0 },
                      { translateY: 0 },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.segmentInner,
                    {
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
              </View>
            );

            startAngle += angle;
            return segment;
          })}
        </View>
      </View>
      <View style={styles.legend}>
        {data.map((item, index) => {
          const biasInfo = biasTypes.find((b) => b.id === item.id);
          return (
            <View key={item.id} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: chartColors[index] },
                ]}
              />
              <Text style={styles.legendText}>
                {biasInfo?.name || item.id}: {item.percentage}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  chartContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  pieChart: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    position: "relative",
  },
  pieSegment: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  segmentInner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: "50%",
    top: 0,
    backgroundColor: colors.card,
  },
  legend: {
    marginTop: 20,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
});
