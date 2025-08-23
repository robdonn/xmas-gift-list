'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {user.photoURL ? (
        <Image
          src={user.photoURL}
          alt={user.displayName}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-christmas-red text-white flex items-center justify-center text-sm font-medium">
          {user.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <span className="text-white font-medium">{user.displayName}</span>
        <button
          onClick={handleSignOut}
          className="text-white/80 hover:text-white text-sm underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
