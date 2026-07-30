import React from 'react';

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <pre style={{ color: 'white', padding: 16 }}>{this.state.error.stack}</pre>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
