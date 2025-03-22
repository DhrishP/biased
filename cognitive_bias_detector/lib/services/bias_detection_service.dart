import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/bias_result_model.dart';

class BiasDetectionService {
  // In a real app, you would store this securely and not hardcode it
  static const String _apiKey = 'YOUR_API_KEY';
  static const String _endpoint = 'https://api.openai.com/v1/chat/completions';

  Future<BiasResult> detectBias(String input) async {
    try {
      final response = await http.post(
        Uri.parse(_endpoint),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_apiKey',
        },
        body: jsonEncode({
          'model': 'gpt-4',
          'messages': [
            {
              'role': 'system',
              'content': '''
                You are an expert in identifying cognitive biases in text. 
                Analyze the provided text and identify the percentage presence of different cognitive biases.
                Return your analysis in the following JSON format:
                {
                  "biases": [
                    {"type": "confirmation", "percentage": 45},
                    {"type": "anchoring", "percentage": 25},
                    {"type": "availability", "percentage": 20},
                    {"type": "survivorship", "percentage": 10}
                  ],
                  "explanation": "Brief explanation of the most dominant biases detected"
                }
                The sum of all percentages should be 100. Only include biases with a percentage > 0.
                Known bias types: confirmation, anchoring, availability, survivorship, dunning_kruger, framing, bandwagon, sunk_cost.
              '''
            },
            {
              'role': 'user',
              'content': input
            }
          ],
          'temperature': 0.7,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final content = data['choices'][0]['message']['content'];
        final aiResponse = jsonDecode(content);
        
        // Parse biases from AI response
        final biases = (aiResponse['biases'] as List).map((biasData) {
          final biasType = biasData['type'] as String;
          final percentage = (biasData['percentage'] as num).toDouble();
          
          return BiasData(
            biasType: BiasResultModel.biasTypes[biasType] ?? 
                BiasType(name: 'Unknown Bias', description: 'Undefined bias type'),
            percentage: percentage,
          );
        }).toList();
        
        return BiasResult(
          biases: biases,
          input: input,
          explanation: aiResponse['explanation'],
          timestamp: DateTime.now(),
        );
      } else {
        throw Exception('Failed to analyze text: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error detecting bias: $e');
    }
  }
} 