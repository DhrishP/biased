import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/bias_result_model.dart';

class BiasBarChart extends StatelessWidget {
  final List<BiasData> biases;

  const BiasBarChart({
    Key? key,
    required this.biases,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final sortedBiases = List<BiasData>.from(biases)
      ..sort((a, b) => b.percentage.compareTo(a.percentage));

    return Padding(
      padding: const EdgeInsets.only(top: 16.0),
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceAround,
          maxY: 100,
          barTouchData: BarTouchData(
            touchTooltipData: BarTouchTooltipData(
              tooltipBgColor: Colors.black.withOpacity(0.8),
              getTooltipItem: (group, groupIndex, rod, rodIndex) {
                final bias = sortedBiases[groupIndex];
                return BarTooltipItem(
                  '${bias.biasType.name}\n${bias.percentage.toStringAsFixed(1)}%',
                  const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                );
              },
            ),
          ),
          titlesData: FlTitlesData(
            show: true,
            rightTitles: AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            topTitles: AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (double value, TitleMeta meta) {
                  if (value >= sortedBiases.length) {
                    return const SizedBox();
                  }
                  
                  final bias = sortedBiases[value.toInt()];
                  final String shortName = _getShortName(bias.biasType.name);
                  
                  return Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      shortName,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  );
                },
                reservedSize: 30,
              ),
            ),
            leftTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                reservedSize: 40,
                getTitlesWidget: (value, meta) {
                  return Text(
                    '${value.toInt()}%',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  );
                },
              ),
            ),
          ),
          borderData: FlBorderData(
            show: false,
          ),
          gridData: FlGridData(
            show: true,
            getDrawingHorizontalLine: (value) {
              return FlLine(
                color: Colors.grey.withOpacity(0.2),
                strokeWidth: 1,
              );
            },
            horizontalInterval: 20,
          ),
          barGroups: _getBarGroups(sortedBiases),
        ),
      ),
    );
  }

  List<BarChartGroupData> _getBarGroups(List<BiasData> sortedBiases) {
    return List.generate(sortedBiases.length, (index) {
      final bias = sortedBiases[index];
      return BarChartGroupData(
        x: index,
        barRods: [
          BarChartRodData(
            toY: bias.percentage,
            color: _getBiasColor(bias.biasType.name),
            width: 20,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(4),
              topRight: Radius.circular(4),
            ),
          ),
        ],
      );
    });
  }

  String _getShortName(String biasName) {
    final parts = biasName.split(' ');
    if (parts.length >= 2) {
      return '${parts[0].substring(0, 1)}${parts[1].substring(0, 1)}';
    } else {
      return parts[0].substring(0, 2).toUpperCase();
    }
  }

  Color _getBiasColor(String biasName) {
    final colorMap = {
      'Confirmation Bias': Colors.red,
      'Anchoring Bias': Colors.blue,
      'Availability Heuristic': Colors.green,
      'Survivorship Bias': Colors.purple,
      'Dunning-Kruger Effect': Colors.orange,
      'Framing Effect': Colors.teal,
      'Bandwagon Effect': Colors.pink,
      'Sunk Cost Fallacy': Colors.amber,
    };
    
    return colorMap[biasName] ?? Colors.grey;
  }
} 