import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/bias_result_model.dart';

class BiasPieChart extends StatefulWidget {
  final List<BiasData> biases;

  const BiasPieChart({
    Key? key,
    required this.biases,
  }) : super(key: key);

  @override
  State<BiasPieChart> createState() => _BiasPieChartState();
}

class _BiasPieChartState extends State<BiasPieChart> {
  int touchedIndex = -1;

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1.3,
      child: Column(
        children: [
          Expanded(
            child: PieChart(
              PieChartData(
                pieTouchData: PieTouchData(
                  touchCallback: (FlTouchEvent event, pieTouchResponse) {
                    setState(() {
                      if (!event.isInterestedForInteractions ||
                          pieTouchResponse == null ||
                          pieTouchResponse.touchedSection == null) {
                        touchedIndex = -1;
                        return;
                      }
                      touchedIndex =
                          pieTouchResponse.touchedSection!.touchedSectionIndex;
                    });
                  },
                ),
                borderData: FlBorderData(show: false),
                sectionsSpace: 2,
                centerSpaceRadius: 40,
                sections: _getSections(),
              ),
            ),
          ),
          const SizedBox(height: 16),
          _buildLegend(),
        ],
      ),
    );
  }

  List<PieChartSectionData> _getSections() {
    final sortedBiases = List<BiasData>.from(widget.biases)
      ..sort((a, b) => b.percentage.compareTo(a.percentage));

    return List.generate(sortedBiases.length, (i) {
      final bias = sortedBiases[i];
      final isTouched = i == touchedIndex;
      final double fontSize = isTouched ? 24 : 16;
      final double radius = isTouched ? 110 : 100;
      final Color color = _getBiasColor(bias.biasType.name);

      return PieChartSectionData(
        color: color,
        value: bias.percentage,
        title: '${bias.percentage.toStringAsFixed(1)}%',
        radius: radius,
        titleStyle: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      );
    });
  }

  Widget _buildLegend() {
    final sortedBiases = List<BiasData>.from(widget.biases)
      ..sort((a, b) => b.percentage.compareTo(a.percentage));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: sortedBiases.map((bias) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Row(
            children: [
              Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: _getBiasColor(bias.biasType.name),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  '${bias.biasType.name} (${bias.percentage.toStringAsFixed(1)}%)',
                  style: const TextStyle(
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
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