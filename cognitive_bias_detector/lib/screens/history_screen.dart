import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/bias_result_model.dart';
import 'results_screen.dart';
import 'package:intl/intl.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final model = Provider.of<BiasResultModel>(context);
    final history = model.history;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analysis History'),
        actions: [
          if (history.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Clear History'),
                    content: const Text('Are you sure you want to clear all analysis history?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('CANCEL'),
                      ),
                      TextButton(
                        onPressed: () {
                          model.clearHistory();
                          Navigator.pop(context);
                        },
                        child: const Text('CLEAR'),
                      ),
                    ],
                  ),
                );
              },
              tooltip: 'Clear History',
            ),
        ],
      ),
      body: history.isEmpty
          ? const Center(
              child: Text(
                'No analysis history yet',
                style: TextStyle(fontSize: 16),
              ),
            )
          : ListView.builder(
              itemCount: history.length,
              itemBuilder: (context, index) {
                final result = history[history.length - 1 - index]; // Reverse order, most recent first
                final dateFormat = DateFormat('MMM d, yyyy • h:mm a');
                
                // Get the dominant bias
                result.biases.sort((a, b) => b.percentage.compareTo(a.percentage));
                final dominantBias = result.biases.first;
                
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: InkWell(
                    onTap: () {
                      model.setCurrentResult(result);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const ResultsScreen()),
                      );
                    },
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            dateFormat.format(result.timestamp),
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Input: ${result.input.length > 100 ? '${result.input.substring(0, 100)}...' : result.input}',
                            style: const TextStyle(
                              fontSize: 14,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Dominant bias: ${dominantBias.biasType.name} (${dominantBias.percentage.toStringAsFixed(1)}%)',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          LinearProgressIndicator(
                            value: dominantBias.percentage / 100,
                            backgroundColor: Colors.grey[200],
                            color: _getBiasColor(dominantBias.biasType.name),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
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