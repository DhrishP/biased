# Biased - Cognitive Bias Analysis App

This application helps users identify cognitive biases in their thinking by analyzing text input. It consists of a backend service built with Cloudflare Workers and a frontend mobile app built with React Native and Expo.

## Project Structure

- `BE/` - Backend service built with Cloudflare Workers
- `biased-FE/` - Frontend mobile app built with React Native and Expo

## Backend Setup

1. Navigate to the backend directory:

   ```
   cd BE
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.dev.vars` file with your Google API key:

   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

4. Run the development server:

   ```
   npx wrangler dev
   ```

5. Deploy to Cloudflare Workers:
   ```
   npx wrangler deploy
   ```

## Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd biased-FE
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with your backend URL:

   ```
   API_URL=https://your-backend-url.workers.dev
   ```

4. Start the development server:

   ```
   npm start
   ```

5. Use the Expo Go app on your mobile device to scan the QR code and run the app.

## Features

- **Text Analysis**: Enter text to analyze for cognitive biases
- **Preview**: Get a preview of your text before analysis
- **Detailed Results**: View a breakdown of detected biases with percentages
- **History**: Access your past analyses

## Integration Details

The frontend communicates with the backend through the following endpoints:

- `/preview` - Get a preview of the text before analysis
- `/analyse` - Analyze the text for cognitive biases
- `/history` - Retrieve the history of past analyses

## Development Notes

- The backend uses Gemini AI to analyze text for cognitive biases
- The frontend is built with React Native and Expo for cross-platform compatibility
- Data is stored in a Cloudflare D1 database

## License

MIT
