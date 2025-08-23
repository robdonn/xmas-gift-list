'use client';

import React, { useState } from 'react';
import { GiftItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ItemService } from '@/lib/firestore-operations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit, Trash2, Star, Check } from 'lucide-react';

interface ItemListProps {
  listId: string;
  items: GiftItem[];
}

export const ItemList: React.FC<ItemListProps> = ({ listId, items }) => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftItem | null>(null);

  const handleMarkPurchased = async (itemId: string, purchased: boolean) => {
    if (!user) return;

    try {
      if (purchased) {
        await ItemService.markAsPurchased(itemId, user.id);
      } else {
        await ItemService.markAsUnpurchased(itemId);
      }
    } catch (error) {
      console.error('Failed to update purchase status:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await ItemService.delete(itemId);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const getPriorityColor = (priority: GiftItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Gift Items</h3>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">No gift items yet</p>
          <p className="mb-4">Add some gift ideas to get started</p>
          <Button onClick={() => setShowAddModal(true)} variant="outline">
            Add Your First Item
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg transition-colors ${
                item.isPurchased
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-300 hover:border-christmas-green'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4
                      className={`font-medium ${
                        item.isPurchased
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Star
                        className={`w-4 h-4 ${getPriorityColor(item.priority)}`}
                      />
                      <span
                        className={`text-xs font-medium uppercase ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <p
                      className={`mt-2 text-sm ${
                        item.isPurchased ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4">
                      {item.estimatedPrice && (
                        <span
                          className={`text-sm font-medium ${
                            item.isPurchased ? 'text-gray-400' : 'text-gray-900'
                          }`}
                        >
                          ${item.estimatedPrice.toFixed(2)}
                        </span>
                      )}

                      {item.links && item.links.length > 0 && (
                        <a
                          href={item.links[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-christmas-green hover:underline"
                        >
                          {item.links[0].label || 'View Link'}
                        </a>
                      )}

                      {item.isPurchased && item.purchasedBy && (
                        <span className="text-xs text-gray-500">
                          Purchased by {item.purchasedBy}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleMarkPurchased(item.id, !item.isPurchased)
                        }
                        className={`flex items-center space-x-1 ${
                          item.isPurchased
                            ? 'text-gray-600 hover:text-gray-900'
                            : 'text-christmas-green hover:text-christmas-green'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>
                          {item.isPurchased
                            ? 'Mark Unpurchased'
                            : 'Mark Purchased'}
                        </span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Gift Item"
      >
        <AddItemForm listId={listId} onClose={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Gift Item"
      >
        {editingItem && (
          <EditItemForm
            item={editingItem}
            onClose={() => setEditingItem(null)}
          />
        )}
      </Modal>
    </div>
  );
};

// Add Item Form Component
interface AddItemFormProps {
  listId: string;
  onClose: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ listId, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedPrice: '',
    linkUrl: '',
    linkLabel: '',
    priority: 'medium' as GiftItem['priority'],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const itemData = {
        title: formData.title,
        description: formData.description,
        estimatedPrice: formData.estimatedPrice
          ? parseFloat(formData.estimatedPrice)
          : 0,
        links: formData.linkUrl
          ? [
              {
                url: formData.linkUrl,
                label: formData.linkLabel || 'Link',
              },
            ]
          : [],
        priority: formData.priority,
        notes: formData.notes,
      };

      await ItemService.create(listId, itemData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Input
        label="Item Title *"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter item title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add a description (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-christmas-green focus:border-christmas-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          value={formData.estimatedPrice}
          onChange={(e) =>
            setFormData({ ...formData, estimatedPrice: e.target.value })
          }
          placeholder="0.00"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as GiftItem['priority'],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-christmas-green focus:border-christmas-green"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Link URL"
          type="url"
          value={formData.linkUrl}
          onChange={(e) =>
            setFormData({ ...formData, linkUrl: e.target.value })
          }
          placeholder="https://example.com/product"
        />

        <Input
          label="Link Label"
          value={formData.linkLabel}
          onChange={(e) =>
            setFormData({ ...formData, linkLabel: e.target.value })
          }
          placeholder="Product Link"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes (optional)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-christmas-green focus:border-christmas-green"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add Item
        </Button>
      </div>
    </form>
  );
};

// Edit Item Form Component
interface EditItemFormProps {
  item: GiftItem;
  onClose: () => void;
}

const EditItemForm: React.FC<EditItemFormProps> = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || '',
    estimatedPrice: item.estimatedPrice?.toString() || '',
    linkUrl: item.links?.[0]?.url || '',
    linkLabel: item.links?.[0]?.label || '',
    priority: item.priority,
    notes: item.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const updates = {
        title: formData.title,
        description: formData.description,
        estimatedPrice: formData.estimatedPrice
          ? parseFloat(formData.estimatedPrice)
          : 0,
        links: formData.linkUrl
          ? [
              {
                url: formData.linkUrl,
                label: formData.linkLabel || 'Link',
              },
            ]
          : [],
        priority: formData.priority,
        notes: formData.notes,
      };

      await ItemService.update(item.id, updates);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Input
        label="Item Title *"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter item title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add a description (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-christmas-green focus:border-christmas-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          value={formData.estimatedPrice}
          onChange={(e) =>
            setFormData({ ...formData, estimatedPrice: e.target.value })
          }
          placeholder="0.00"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as GiftItem['priority'],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-christmas-green focus:border-christmas-green"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Link URL"
          type="url"
          value={formData.linkUrl}
          onChange={(e) =>
            setFormData({ ...formData, linkUrl: e.target.value })
          }
          placeholder="https://example.com/product"
        />

        <Input
          label="Link Label"
          value={formData.linkLabel}
          onChange={(e) =>
            setFormData({ ...formData, linkLabel: e.target.value })
          }
          placeholder="Product Link"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes (optional)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-christmas-green focus:border-christmas-green"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Update Item
        </Button>
      </div>
    </form>
  );
};
