function ErrorMessage({ message, onRetry }) {
    return(
        <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="text-4xl">❌</div>
                <div className="flex-1">
                    <h3 className="text-red-400 font-bold text-lg mb-2">Error</h3>
                    <p className="text-gray-300 mb-4">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
                        >
                            🔄 Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ErrorMessage;