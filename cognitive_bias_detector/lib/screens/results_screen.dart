import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/bias_result_model.dart';
import '../widgets/bias_pie_chart.dart';
import '../widgets/bias_bar_chart.dart';

class ResultsScreen extends StatefulWidget {
  const ResultsScreen({Key? key}) : super(key: key);

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final model = Provider.of<BiasResultModel>(context);
    final result = model.currentResult;
    
    if (result == null) {
      return const Scaffold(
        body: Center(
          child: Text('No results to display'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bias Analysis Results'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Pie Chart'),
            Tab(text: 'Bar Chart'),
          ],
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Analysis Summary:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  result.explanation,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Bias Breakdown:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Pie Chart View
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: BiasPieChart(biases: result.biases),
                ),
                // Bar Chart View
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: BiasBarChart(biases: result.biases),
                ),
              ],
            ),
          ),
          const Divider(),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Suggested Actions:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                // Display suggestions based on the most dominant bias
                Text(
                  'To counteract ${result.biases.first.biasType.name}:',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                _getSuggestion(result.biases.first.biasType.name),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _getSuggestion(String biasName) {
    final suggestions = {
      'Confirmation Bias': 'Actively seek out information that contradicts your beliefs. Consider alternative viewpoints and engage with people who think differently.',
      'Anchoring Bias': 'Consider multiple reference points before making a decision. Be aware of the first piece of information you received and how it might influence you.',
      'Availability Heuristic': 'Look for objective data rather than relying on examples that easily come to mind. Research statistics and seek diverse sources of information.',
      'Survivorship Bias': 'Look for the "silent evidence" - consider the cases that didn\'t succeed or survive. Ask what happened to those who didn\'t make it.',
      'Dunning-Kruger Effect': 'Seek feedback from experts and be open to criticism. Continue learning and acknowledge the limitations of your knowledge.',
      'Framing Effect': 'Reframe the situation in different ways before making a decision. Be aware of how information is presented to you.',
      'Bandwagon Effect': 'Make decisions based on your own research and values rather than following the crowd. Ask yourself why something is popular.',
      'Sunk Cost Fallacy': 'Focus on future value rather than what you\'ve already invested. Be willing to abandon projects that aren\'t working.',
    };
    
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: Text(
        suggestions[biasName] ?? 'Be aware of this bias and regularly reflect on how it might affect your thinking.',
        style: const TextStyle(fontSize: 14),
      ),
    );
  }
} 