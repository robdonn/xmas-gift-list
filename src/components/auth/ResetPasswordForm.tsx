'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface ResetPasswordFormProps {
  onBack: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred sending reset email'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-christmas-red focus:border-transparent"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-christmas-red text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-christmas-red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-christmas-red hover:text-red-700 text-sm underline"
            disabled={loading}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
