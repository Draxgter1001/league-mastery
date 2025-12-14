import { Component } from 'react';

class ErrorBoundary extends Component{
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null};
    }

    static getDerivedStateFromError(error){
        return { hasError: true};
    }

    componentDidCatch(error, errorInfo){
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError){
            return (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-gray-800 rounded-lg p-8 shadow-2xl border border-red-500">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">💥</div>
                            <h1 className="text-3xl font-bold text-red-400 mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-400">
                                Don't worry, your data is safe. Try refreshing the page.
                            </p>
                        </div>

                        {/* Show error details in development */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mt-6 bg-gray-900 rounded p-4 text-xs text-gray-300 overflow-auto max-h-96">
                                <p className="font-bold text-red-400 mb-2">Error Details (Dev Only):</p>
                                <pre>{this.state.error.toString()}</pre>
                                {this.state.errorInfo && (
                                    <pre className="mt-2">{this.state.errorInfo.componentStack}</pre>
                                )}
                            </div>
                        )}

                        <div className="mt-6 flex gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
                            >
                                🔄 Refresh Page
                            </button>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
                            >
                                🏠 Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;