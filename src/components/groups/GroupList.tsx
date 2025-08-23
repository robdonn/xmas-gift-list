'use client';

import React from 'react';
import { GiftGroup } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useAppState } from '@/context/AppStateContext';
import { GroupCard } from './GroupCard';

interface GroupListProps {
  onCreateGroup: () => void;
  onSelectGroup: (group: GiftGroup) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  onCreateGroup,
  onSelectGroup,
}) => {
  const { user } = useAuth();
  const { groups } = useAppState();

  if (!user) return null;

  const activeGroups = groups.filter((group) => group.isActive);
  const inactiveGroups = groups.filter((group) => !group.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Gift Groups</h2>
        <button
          onClick={onCreateGroup}
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
          New Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No gift groups yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first gift group to start organizing your Christmas
            lists
          </p>
          <button
            onClick={onCreateGroup}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-christmas-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-christmas-red"
          >
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Groups */}
          {activeGroups.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Active Groups
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onClick={() => onSelectGroup(group)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive Groups */}
          {inactiveGroups.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-500 mb-4">
                Past Groups
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onClick={() => onSelectGroup(group)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
