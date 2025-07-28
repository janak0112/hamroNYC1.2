import React from 'react'
import { CircleX } from 'lucide-react';
const Modal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center relative">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <p className="mb-4">{message}</p>
                <div class="checkmark-circle">
                    <div class="background"></div>
                    <div class="checkmark draw"></div>
                </div>
                <button 
                    onClick={onClose}
                    className="px-4 py-2 absolute top-0 right-0 cursor-pointer"
                >
                    <CircleX width={30} height={30} color='rgba(212, 17, 56, 1)' />
                </button>
            </div>
        </div>
    );
};

export default Modal