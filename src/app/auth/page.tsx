'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-christmas-red to-red-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-christmas-red to-red-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎄 Christmas Gifts
          </h1>
          <p className="text-white/80">Organize your holiday gift lists</p>
        </div>

        {mode === 'login' && (
          <LoginForm onSwitchToSignup={() => setMode('signup')} />
        )}

        {mode === 'signup' && (
          <SignupForm onSwitchToLogin={() => setMode('login')} />
        )}

        {mode === 'reset' && (
          <ResetPasswordForm onBack={() => setMode('login')} />
        )}

        {mode === 'login' && (
          <div className="text-center mt-4">
            <button
              onClick={() => setMode('reset')}
              className="text-white/80 hover:text-white text-sm underline"
            >
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
