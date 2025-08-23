'use client';

import React from 'react';
import { GiftList } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface ListCardProps {
  list: GiftList;
  onClick: () => void;
}

export const ListCard: React.FC<ListCardProps> = ({ list, onClick }) => {
  const { user } = useAuth();
  const isOwner = user?.id === list.createdBy;
  const isCollaborator = list.collaboratorIds.includes(user?.id || '');

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {list.recipientName}
          </h3>
          <p className="text-sm text-gray-600">Gift list recipient</p>
          {isOwner ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-christmas-red text-white mt-1">
              Owner
            </span>
          ) : isCollaborator ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
              Collaborator
            </span>
          ) : null}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-christmas-green">
            ${list.budget.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500">Budget</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {list.collaboratorIds.length + 1} collaborator
          {list.collaboratorIds.length !== 0 ? 's' : ''}
        </div>

        <div className="text-xs text-gray-500">
          Updated {list.updatedAt.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
