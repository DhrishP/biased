import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/bias_result_model.dart';
import '../services/bias_detection_service.dart';
import 'results_screen.dart';
import 'history_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _textController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final BiasDetectionService _biasService = BiasDetectionService();
  bool _isInputFromExternal = false;

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _detectBias() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final model = Provider.of<BiasResultModel>(context, listen: false);
    model.setLoading(true);
    model.setError(null);

    try {
      final result = await _biasService.detectBias(_textController.text.trim());
      model.setCurrentResult(result);
      model.setLoading(false);
      
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const ResultsScreen()),
        );
      }
    } catch (e) {
      model.setLoading(false);
      model.setError(e.toString());
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final model = Provider.of<BiasResultModel>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cognitive Bias Detector'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const HistoryScreen()),
              );
            },
            tooltip: 'View History',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Enter your text to analyze for cognitive biases:',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _textController,
                decoration: InputDecoration(
                  hintText: 'Type or paste text here...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  fillColor: Colors.grey.shade100,
                  filled: true,
                ),
                maxLines: 8,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter some text to analyze';
                  }
                  if (value.trim().length < 20) {
                    return 'Please enter at least 20 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Checkbox(
                    value: _isInputFromExternal,
                    onChanged: (value) {
                      setState(() {
                        _isInputFromExternal = value ?? false;
                      });
                    },
                  ),
                  const Text('This is pasted text from external source'),
                ],
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: model.isLoading ? null : _detectBias,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  backgroundColor: Theme.of(context).primaryColor,
                  foregroundColor: Colors.white,
                ),
                child: model.isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('ANALYZE FOR BIASES'),
              ),
              if (model.error != null)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Text(
                    model.error!,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              const Spacer(),
              const Text(
                'This app uses AI to analyze text for cognitive biases and provides a percentage breakdown of detected bias types.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
} 