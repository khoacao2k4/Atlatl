import React, { useState } from 'react';

const XIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export const EmailGateOverlay = ({ isOpen, onSubmit, onCancel }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setEmailError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        console.log('Email submitted:', email);
        onSubmit(email);
        setEmail('');
        setEmailError('');
    };

    const handleCancel = () => {
        setEmail('');
        setEmailError('');
        onCancel();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-100 rounded-2xl shadow-2xl max-w-2xl w-full p-12 relative">
                <button
                    onClick={handleCancel}
                    className="absolute top-6 right-6 text-dark-blue hover:text-bold-blue transition-colors"
                    aria-label="Close"
                >
                    <div className="w-10 h-10 rounded-full border-2 border-dark-blue flex items-center justify-center hover:border-bold-blue transition-colors">
                        <XIcon />
                    </div>
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4 font-songer tracking-wide">
                        SIGN UP FOR
                        <br />
                        ATLATL NEWSLETTERS
                    </h2>
                    <p className="text-dark-blue text-base md:text-lg font-work-sans">
                        Sign up for Atlatl Newsletters to access our
                        <br />
                        calculators and other resources
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            placeholder="Email"
                            className="w-full px-6 py-4 border-2 border-dark-blue rounded-xl text-base font-work-sans focus:outline-none focus:ring-2 focus:ring-bold-blue transition-all"
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mt-2 font-work-sans">{emailError}</p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <button
                            type="submit"
                            className="px-12 py-4 bg-bold-blue text-white font-bold rounded-full text-base font-songer tracking-wide hover:bg-opacity-90 transition-all shadow-lg"
                        >
                            SIGN UP
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-12 py-4 bg-white text-bold-blue border-2 border-bold-blue font-bold rounded-full text-base font-songer tracking-wide hover:bg-gray-50 transition-all"
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};