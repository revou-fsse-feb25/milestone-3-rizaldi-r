export default function LoadingDisplay() {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-gray-300 border-t-primary-500 animate-spin"></div>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}
