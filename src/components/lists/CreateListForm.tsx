'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GiftListService } from '@/lib/firestore-operations';
import { useAuth } from '@/context/AuthContext';
import { useAppState } from '@/context/AppStateContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateListForm as CreateListFormType } from '@/types';

interface CreateListFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateListForm: React.FC<CreateListFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const { currentGroup } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateListFormType>({
    defaultValues: {
      recipientName: '',
      budget: 200,
      collaboratorEmails: [],
    },
  });

  const onSubmit = async (data: CreateListFormType) => {
    if (!user || !currentGroup) return;

    setLoading(true);
    setError('');

    try {
      await GiftListService.createList({
        groupId: currentGroup.id,
        recipientName: data.recipientName,
        budget: data.budget,
        createdBy: user.id,
        collaboratorIds: [], // TODO: Implement email to user ID lookup
      });

      reset();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Create New Gift List
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Create a list to organize gifts for a specific person.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Input
        label="Recipient Name"
        placeholder="e.g., Mom, Dad, Sarah, John"
        {...register('recipientName', {
          required: 'Recipient name is required',
          minLength: { value: 1, message: 'Recipient name cannot be empty' },
        })}
        error={errors.recipientName?.message}
        disabled={loading}
      />

      <Input
        label="Budget"
        type="number"
        min={0}
        step={0.01}
        placeholder="200.00"
        {...register('budget', {
          required: 'Budget is required',
          min: { value: 0, message: 'Budget cannot be negative' },
        })}
        error={errors.budget?.message}
        helperText="Budget for gifts for this person"
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
          Create List
        </Button>
      </div>
    </form>
  );
};
