'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GiftGroupService } from '@/lib/firestore-operations';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateGroupForm as CreateGroupFormType } from '@/types';

interface CreateGroupFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGroupFormType>({
    defaultValues: {
      name: '',
      year: new Date().getFullYear(),
      overallBudget: 1000,
    },
  });

  const onSubmit = async (data: CreateGroupFormType) => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await GiftGroupService.createGroup({
        name: data.name,
        year: data.year,
        overallBudget: data.overallBudget,
        ownerId: user.id,
        memberIds: [user.id], // Owner is automatically a member
        isActive: true,
      });

      reset();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Create New Gift Group
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Create a new group to organize gift lists for this Christmas season.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Input
        label="Group Name"
        placeholder="e.g., Christmas 2025, Family Gifts"
        {...register('name', {
          required: 'Group name is required',
          minLength: {
            value: 2,
            message: 'Group name must be at least 2 characters',
          },
        })}
        error={errors.name?.message}
        disabled={loading}
      />

      <Input
        label="Year"
        type="number"
        min={new Date().getFullYear()}
        max={new Date().getFullYear() + 5}
        {...register('year', {
          required: 'Year is required',
          min: {
            value: new Date().getFullYear(),
            message: 'Year cannot be in the past',
          },
        })}
        error={errors.year?.message}
        disabled={loading}
      />

      <Input
        label="Overall Budget"
        type="number"
        min={0}
        step={0.01}
        placeholder="1000.00"
        {...register('overallBudget', {
          required: 'Budget is required',
          min: { value: 0, message: 'Budget cannot be negative' },
        })}
        error={errors.overallBudget?.message}
        helperText="Total budget for all gifts in this group"
        disabled={loading}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          Create Group
        </Button>
      </div>
    </form>
  );
};
