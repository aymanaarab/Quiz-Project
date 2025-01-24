import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8005/api/auth/login', {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            navigate('/quiz');
        } catch (error) {
            console.error('Invalid credentials or server error', error);
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto px-6 py-12 bg-white rounded-lg shadow-md">
            <div className="mb-8">
                <h2 className="text-center text-3xl font-bold text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
                
                <div className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="appearance-none rounded-lg w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Email address"
                    />
                    
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="appearance-none rounded-lg w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign in
                </button>

                <div className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign Up
                    </a>
                </div>
            </form>
        </div>
    </div>
);
    
}

