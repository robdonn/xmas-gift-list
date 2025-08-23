'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserProfile } from '@/components/auth/UserProfile';
import { GroupList } from '@/components/groups/GroupList';
import { CreateGroupForm } from '@/components/groups/CreateGroupForm';
import { GroupMemberManager } from '@/components/groups/GroupMemberManager';
import { Modal } from '@/components/ui/Modal';
import { GiftGroup } from '@/types';
import { useAppState } from '@/context/AppStateContext';

export default function GroupsPage() {
  const router = useRouter();
  const { setCurrentGroup } = useAppState();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GiftGroup | null>(null);
  const [showMemberManager, setShowMemberManager] = useState(false);

  const handleSelectGroup = (group: GiftGroup) => {
    setCurrentGroup(group);
    router.push(`/groups/${group.id}`);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-christmas-red shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-white hover:text-white/80"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-white">
                  🎄 Gift Groups
                </h1>
              </div>
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <GroupList
            onCreateGroup={() => setShowCreateForm(true)}
            onSelectGroup={handleSelectGroup}
          />
        </main>

        {/* Create Group Modal */}
        <Modal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          title="Create New Group"
          maxWidth="md"
        >
          <CreateGroupForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>

        {/* Member Manager Modal */}
        <Modal
          isOpen={showMemberManager && selectedGroup !== null}
          onClose={() => {
            setShowMemberManager(false);
            setSelectedGroup(null);
          }}
          title="Manage Members"
          maxWidth="lg"
        >
          {selectedGroup && (
            <GroupMemberManager
              group={selectedGroup}
              onClose={() => {
                setShowMemberManager(false);
                setSelectedGroup(null);
              }}
            />
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
