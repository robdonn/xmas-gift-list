'use client';

import React, { useState, useEffect } from 'react';
import { GiftGroup, User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { GiftGroupService, UserService } from '@/lib/firestore-operations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface GroupMemberManagerProps {
  group: GiftGroup;
  onClose: () => void;
}

interface MemberInfo extends User {
  isOwner: boolean;
}

export const GroupMemberManager: React.FC<GroupMemberManagerProps> = ({
  group,
  onClose,
}) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');

  const isOwner = user?.id === group.ownerId;

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      try {
        const memberPromises = group.memberIds.map(async (memberId) => {
          const memberData = await UserService.getUser(memberId);
          if (memberData) {
            return {
              ...memberData,
              isOwner: memberId === group.ownerId,
            };
          }
          return null;
        });

        const memberResults = await Promise.all(memberPromises);
        const validMembers = memberResults.filter(Boolean) as MemberInfo[];
        setMembers(validMembers);
      } catch (err) {
        setError('Failed to load group members');
        console.error('Error loading members:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [group.memberIds, group.ownerId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    setActionLoading(true);
    setError('');

    try {
      // In a real implementation, you'd need to search for users by email
      // For now, this is a placeholder that shows the UI structure
      setError('Adding members by email requires additional implementation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (memberId === group.ownerId) {
      setError('Cannot remove the group owner');
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      await GiftGroupService.removeMember(group.id, memberId);
      setMembers((prev) => prev.filter((member) => member.id !== memberId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Group Members</h3>
        <p className="text-sm text-gray-600">
          Manage who can collaborate on this group&apos;s gift lists
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Member Form */}
      {isOwner && (
        <form onSubmit={handleAddMember} className="flex space-x-3">
          <Input
            type="email"
            placeholder="Enter email address"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="flex-1"
            disabled={actionLoading}
          />
          <Button
            type="submit"
            loading={actionLoading}
            disabled={!newMemberEmail.trim() || actionLoading}
          >
            Add Member
          </Button>
        </form>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-christmas-red text-white flex items-center justify-center text-sm font-medium">
                    {member.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.displayName}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  {member.isOwner && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-christmas-red text-white">
                      Owner
                    </span>
                  )}
                </div>

                {isOwner && !member.isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={actionLoading}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
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
