import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RouteResQ ErrorBoundary caught exception:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('routeresq_view');
      localStorage.removeItem('routeresq_user');
      localStorage.removeItem('routeresq_token');
    } catch (e) {
      console.warn('LocalStorage reset error:', e);
    }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center mx-auto text-lg">
              RR
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-slate-800">RouteResQ Application Session</h2>
              <p className="text-xs text-slate-500">
                A temporary rendering state occurred. Click below to return to the Demo Role Selection dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-red-50 border border-red-200 p-3 rounded-xl text-xs space-y-1 overflow-auto max-h-48">
                <span className="font-bold text-red-700 block">Error Detail:</span>
                <code className="text-red-900 text-3xs font-mono block break-words">
                  {this.state.error.toString()}
                </code>
                {this.state.error.stack && (
                  <pre className="text-3xs text-red-800 font-mono overflow-x-auto whitespace-pre-wrap mt-1">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
            >
              Reset Session & Open Role Dashboards
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
