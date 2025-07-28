import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth'; // Adjust path to your AuthService file

function LogIn() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setErrorMessage('');
        setIsLoading(true);

        try {
            console.log('Submitting login:', { email: data.email, password: data.password });
            await authService.login({
                email: data.email,
                password: data.password,
            });
            navigate('/'); // Redirect to dashboard or another route
        } catch (error) {
            console.error('Login Error:', error);
            if (error.code === 401) {
                setErrorMessage('Invalid email or password. Please try again.');
            } else {
                setErrorMessage(error.message || 'Failed to sign in. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4 mt-10"
        >
            {errorMessage && (
                <p role="alert" className="text-sm text-center" style={{ color: 'rgba(212, 17, 56, 1)' }}>
                    {errorMessage}
                </p>
            )}

            <input
                type="email"
                placeholder="Email"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email format',
                    },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
                <p role="alert" className="text-sm" style={{ color: 'rgba(212, 17, 56, 1)' }}>
                    {errors.email.message}
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

            <button
                type="submit"
                className="w-full py-2 rounded text-white font-semibold"
                style={{ backgroundColor: 'rgba(212, 17, 56, 1)' }}
                disabled={isLoading}
            >
                {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
}

export default LogIn;