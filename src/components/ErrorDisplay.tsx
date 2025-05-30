export default function ErrorDisplay({ errorMessage }: { errorMessage: string }) {
    return (
        <div className="bg-red-500 bg-opacity-80 text-white p-4 rounded-lg mb-6 shadow-lg flex items-center">
            <svg
                className="w-6 h-6 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>{errorMessage}</span>
        </div>
    );
}
