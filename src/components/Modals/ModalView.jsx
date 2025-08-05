// ModalView.jsx
export default function ModalView({ isVisible, onClose, children }) {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-5xl relative p-6 px-10 max-h-[90vh] flex flex-col overflow-hidden"
            >
                <div className="overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-[rgb(205,74,61)] hover:text-gray-900 text-4xl font-bold"
                    >
                        ✕
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
}
