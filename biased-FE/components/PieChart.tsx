import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";
import { BiasResult } from "@/types/analysis";
import { biasTypes } from "@/constants/biases";
import { colors } from "@/constants/Colors";

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

// Helper function to create the SVG path for a pie segment
const createPieSegment = (
  percentage: number,
  startAngle: number,
  radius: number
) => {
  // Convert percentage to angle
  const angle = (percentage / 100) * 360;
  const endAngle = startAngle + angle;

  // Convert angles to radians
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  // Calculate coordinates
  const x1 = radius * Math.cos(startRad);
  const y1 = radius * Math.sin(startRad);
  const x2 = radius * Math.cos(endRad);
  const y2 = radius * Math.sin(endRad);

  // Determine if the arc should be drawn the long way around
  const largeArcFlag = angle > 180 ? 1 : 0;

  // Create the SVG path
  const path = `
    M ${radius} ${radius}
    L ${radius + x1} ${radius + y1}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${radius + x2} ${radius + y2}
    Z
  `;

  return path.trim();
};

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  if (!data.length) return null;

  // Sort data by percentage in descending order
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
  const chartColors = generateColors(sortedData.length);

  // Calculate total to ensure it adds up to 100%
  const total = sortedData.reduce((sum, item) => sum + item.percentage, 0);
  const scaleFactor = total > 0 ? 100 / total : 1;

  // Size of the chart
  const size = 200;
  const radius = size / 2;

  let startAngle = 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <Circle cx={radius} cy={radius} r={radius} fill={colors.card} />

          {/* Pie segments */}
          <G>
            {sortedData.map((item, index) => {
              // Scale the percentage
              const scaledPercentage = item.percentage * scaleFactor;

              // Create the path for this segment
              const path = createPieSegment(
                scaledPercentage,
                startAngle,
                radius
              );

              // Update the start angle for the next segment
              startAngle += (scaledPercentage / 100) * 360;

              return (
                <Path
                  key={item.id}
                  d={path}
                  fill={chartColors[index]}
                  stroke={colors.background}
                  strokeWidth={1}
                />
              );
            })}
          </G>
        </Svg>
      </View>

      <View style={styles.legend}>
        {sortedData.map((item, index) => {
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
                {biasInfo?.name || item.id}: {item.percentage.toFixed(1)}%
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
