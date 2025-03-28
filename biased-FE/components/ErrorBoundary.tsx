import React from 'react';
import { View, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to a file
    const errorLog = `Error: ${error.toString()}\nStack: ${error.stack}\nComponent Stack: ${errorInfo.componentStack}`;
    const logFile = `${FileSystem.documentDirectory}error.log`;
    
    FileSystem.writeAsStringAsync(logFile, errorLog, { encoding: FileSystem.EncodingType.UTF8 })
      .catch(writeError => console.error('Failed to write error log:', writeError));
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 