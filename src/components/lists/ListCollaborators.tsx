'use client';

import React, { useState } from 'react';
import { GiftList } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { GiftListService } from '@/lib/firestore-operations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ListCollaboratorsProps {
  list: GiftList;
  onClose: () => void;
}

export const ListCollaborators: React.FC<ListCollaboratorsProps> = ({
  list,
  onClose,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [error, setError] = useState('');

  const isOwner = user?.id === list.createdBy;

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollaboratorEmail.trim()) return;

    setLoading(true);
    setError('');

    try {
      // In a real implementation, you'd need to search for users by email
      // For now, this is a placeholder that shows the UI structure
      setError(
        'Adding collaborators by email requires additional implementation'
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add collaborator'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    setLoading(true);
    setError('');

    try {
      await GiftListService.removeCollaborator(list.id, collaboratorId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to remove collaborator'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          List Collaborators
        </h3>
        <p className="text-sm text-gray-600">
          Manage who can help with this gift list
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Collaborator Form */}
      {isOwner && (
        <form onSubmit={handleAddCollaborator} className="flex space-x-3">
          <Input
            type="email"
            placeholder="Enter email address"
            value={newCollaboratorEmail}
            onChange={(e) => setNewCollaboratorEmail(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="submit"
            loading={loading}
            disabled={!newCollaboratorEmail.trim() || loading}
          >
            Add Collaborator
          </Button>
        </form>
      )}

      {/* Collaborators List */}
      <div className="space-y-3">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-christmas-red text-white flex items-center justify-center text-sm font-medium">
                {user?.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-christmas-red text-white">
                Owner
              </span>
            </div>
          </div>
        </div>

        {list.collaboratorIds.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No collaborators added yet</p>
            {isOwner && (
              <p className="text-sm mt-2">
                Add collaborators to work together on this gift list
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
