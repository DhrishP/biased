import 'package:flutter/foundation.dart';

class BiasType {
  final String name;
  final String description;
  
  BiasType({required this.name, required this.description});
}

class BiasData {
  final BiasType biasType;
  final double percentage;
  
  BiasData({required this.biasType, required this.percentage});
}

class BiasResult {
  final List<BiasData> biases;
  final String input;
  final String explanation;
  final DateTime timestamp;
  
  BiasResult({
    required this.biases, 
    required this.input, 
    required this.explanation,
    required this.timestamp,
  });
}

class BiasResultModel extends ChangeNotifier {
  BiasResult? _currentResult;
  List<BiasResult> _history = [];
  bool _isLoading = false;
  String? _error;

  BiasResult? get currentResult => _currentResult;
  List<BiasResult> get history => _history;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void setError(String? error) {
    _error = error;
    notifyListeners();
  }

  void setCurrentResult(BiasResult result) {
    _currentResult = result;
    _history.add(result);
    notifyListeners();
  }

  void clearCurrentResult() {
    _currentResult = null;
    notifyListeners();
  }

  void clearHistory() {
    _history = [];
    notifyListeners();
  }

  // Predefined bias types with descriptions
  static final Map<String, BiasType> biasTypes = {
    'confirmation': BiasType(
      name: 'Confirmation Bias',
      description: 'The tendency to search for, interpret, and recall information in a way that confirms one\'s preexisting beliefs.',
    ),
    'anchoring': BiasType(
      name: 'Anchoring Bias',
      description: 'The tendency to rely too heavily on the first piece of information offered when making decisions.',
    ),
    'availability': BiasType(
      name: 'Availability Heuristic',
      description: 'Making judgments about the probability of events based on how easily examples come to mind.',
    ),
    'survivorship': BiasType(
      name: 'Survivorship Bias',
      description: 'Concentrating on people or things that "survived" some process while overlooking those that didn\'t.',
    ),
    'dunning_kruger': BiasType(
      name: 'Dunning-Kruger Effect',
      description: 'A cognitive bias in which people with limited knowledge or competence in a given intellectual or social domain overestimate their competence.',
    ),
    'framing': BiasType(
      name: 'Framing Effect',
      description: 'Drawing different conclusions from the same information, depending on how it is presented.',
    ),
    'bandwagon': BiasType(
      name: 'Bandwagon Effect',
      description: 'The tendency to do something primarily because others are doing it.',
    ),
    'sunk_cost': BiasType(
      name: 'Sunk Cost Fallacy',
      description: 'Continuing a behavior or endeavor as a result of previously invested resources.',
    ),
  };
} 