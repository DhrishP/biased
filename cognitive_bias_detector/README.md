# Cognitive Bias Detector & Visualizer

An AI-powered Flutter application that analyzes text for cognitive biases and presents the results with interactive charts.

## Features

### 1. AI-Powered Cognitive Bias Detection

- Send user input (text, opinions, or responses) to an AI API
- The AI analyzes the language, reasoning patterns, and logical inconsistencies
- Biases are categorized based on established cognitive bias types

### 2. Bias Percentage Breakdown

- AI returns a response with bias percentages for each category
- Example:
  - Confirmation Bias: 45%
  - Anchoring Bias: 25%
  - Availability Heuristic: 20%
  - Survivorship Bias: 10%

### 3. Interactive Charts

- Display bias distribution visually using pie charts and bar graphs
- Allow users to explore explanations for each detected bias

### 4. User Input Options

- Free-text input for users to enter their thoughts, arguments, or responses
- Option to analyze external content, such as pasted text from articles or social media

### 5. Explanation & Insights

- The AI provides a brief explanation of the most dominant biases detected
- Users receive suggestions on how to counteract or reduce their biases

## Getting Started

### Prerequisites

- Flutter SDK: Make sure you have Flutter installed. If not, follow the [official installation guide](https://flutter.dev/docs/get-started/install).
- OpenAI API Key: You will need an API key from OpenAI to use the bias detection service.

### Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/cognitive_bias_detector.git
   ```

2. Navigate to the project directory:

   ```
   cd cognitive_bias_detector
   ```

3. Install dependencies:

   ```
   flutter pub get
   ```

4. Add your OpenAI API key:

   - Open `lib/services/bias_detection_service.dart`
   - Replace `YOUR_API_KEY` with your actual OpenAI API key

5. Run the app:
   ```
   flutter run
   ```

## Technical Details

### Architecture

- The app follows a Provider pattern for state management
- Uses FL Chart for visualizing bias data
- HTTP package for API communication
- Shared Preferences for local storage

### Bias Types

The application detects and analyzes the following cognitive bias types:

- Confirmation Bias
- Anchoring Bias
- Availability Heuristic
- Survivorship Bias
- Dunning-Kruger Effect
- Framing Effect
- Bandwagon Effect
- Sunk Cost Fallacy

## License

This project is licensed under the MIT License.
