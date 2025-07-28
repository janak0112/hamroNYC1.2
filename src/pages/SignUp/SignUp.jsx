import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import authService from '../../appwrite/auth'; // Adjust the path to your AuthService file
import { useNavigate } from 'react-router-dom'; // Optional: for redirecting after signup
import {ID} from "appwrite"

function SignUp() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [errorMessage, setErrorMessage] = useState(''); // For displaying errors
    const [isLoading, setIsLoading] = useState(false); // For loading state
    const navigate = useNavigate(); // Optional: for redirecting

    const password = watch('password');

    const onSubmit = async (data) => {
        setErrorMessage(''); // Clear previous errors
        setIsLoading(true); // Set loading state

        try {
            // Combine firstName and lastName into userName
            const userId = ID.unique();
            const userName = `${data.firstName} ${data.lastName}`;
            await authService.createAccount({
                userId,
                email: data.mail,
                password: data.password,
                userName,
            });
            // On success, redirect to login page or dashboard
            navigate('/login'); // Adjust the path as needed
        } catch (error) {
            // Handle errors from authService
            setErrorMessage(error.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false); // Reset loading state
        }

        console.log("data", data)
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4 mt-10"
        >
            {/* Error Message Display */}
            {errorMessage && (
                <p role="alert" className="text-sm text-center" style={{ color: 'rgba(212, 17, 56, 1)' }}>
                    {errorMessage}
                </p>
            )}

            <input
                placeholder="First Name"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                aria-invalid={errors.firstName ? 'true' : 'false'}
            />
            {errors.firstName && (
                <p role="alert" className="text-sm" style={{ color: 'rgba(212, 17, 56, 1)' }}>
                    {errors.firstName.message}
                </p>
            )}

            <input
                placeholder="Last Name"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                aria-invalid={errors.lastName ? 'true' : 'false'}
            />
            {errors.lastName && (
                <p role="alert" className="text-sm" style={{ color: 'rgba(212, 17, 56, 1)' }}>
                    {errors.lastName.message}
                </p>
            )}

            <input
                placeholder="Email"
                {...register('mail', {
                    required: 'Email Address is required',
                    pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                    },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                aria-invalid={errors.mail ? 'true' : 'false'}
            />
            {errors.mail && (
                <p role="alert" className="text-sm" style={{ color: 'rgba(212, 17, 56, 1)' }}>
                    {errors.mail.message}
                </p>
            )}

            <input
                type="password"
                placeholder="Password"
                {...register('password', {
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                    },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
                <p role="alert" className="text-sm" style={{ color: 'rgba(212, 17, 56, 1)' }}>
                    {errors.password.message}
                </p>
            )}

            <input
                type="password"
                placeholder="Confirm Password"
                {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            />
            {errors.confirmPassword && (
                <p role="alert" className="text-sm" style={{ color: 'rgba(212, 17, 56, 1)' }}>
                    {errors.confirmPassword.message}
                </p>
            )}

            <button
                type="submit"
                className="w-full py-2 rounded text-white font-semibold"
                style={{ backgroundColor: 'rgba(212, 17, 56, 1)' }}
                disabled={isLoading}
            >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
    );
}

export default SignUp;