'use client';

import React from 'react';
import { GiftList } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useAppState } from '@/context/AppStateContext';
import { ListCard } from './ListCard';

interface ListOverviewProps {
  onCreateList: () => void;
  onSelectList: (list: GiftList) => void;
}

export const ListOverview: React.FC<ListOverviewProps> = ({
  onCreateList,
  onSelectList,
}) => {
  const { user } = useAuth();
  const { lists, currentGroup } = useAppState();

  if (!user || !currentGroup) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gift Lists</h2>
          <p className="text-gray-600">
            Manage gift lists for {currentGroup.name}
          </p>
        </div>
        <button
          onClick={onCreateList}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-christmas-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-christmas-red"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New List
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No gift lists yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first gift list to start organizing presents for someone
            special
          </p>
          <button
            onClick={onCreateList}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-christmas-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-christmas-red"
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onClick={() => onSelectList(list)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
