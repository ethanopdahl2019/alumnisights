
import React from "react";

class TestErrorBoundary extends React.Component<{ label: string; children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error in', this.props.label, error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 20 }}>
          <strong>Component failed to render:</strong> {this.props.label}
          <br />
          Error: {this.state.error && (this.state.error.message || String(this.state.error))}
        </div>
      );
    }
    return this.props.children;
  }
}

export default TestErrorBoundary;
