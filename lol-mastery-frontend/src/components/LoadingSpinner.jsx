function LoadingSpinner ({ message = 'Loading... '}) {
    return(
        <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="mt-6 text-gray-400 animate-pulse">{message}</p>
        </div>
    );
}

export default LoadingSpinner;