'use client';

import React from 'react';
import { GiftList, GiftItem } from '@/types';

interface SpendingSummaryProps {
  lists: GiftList[];
  items: GiftItem[];
}

export const SpendingSummary: React.FC<SpendingSummaryProps> = ({
  lists,
  items,
}) => {
  // Prepare data for charts
  const spendingByList = lists.map((list) => {
    const listItems = items.filter((item) => item.listId === list.id);
    const spent = listItems
      .filter((item) => item.isPurchased)
      .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
    const planned = listItems.reduce(
      (sum, item) => sum + (item.estimatedPrice || 0),
      0
    );

    return {
      name: list.recipientName,
      spent: spent,
      planned: planned,
      budget: list.budget,
      remaining: list.budget - spent,
    };
  });

  // Priority spending breakdown
  const prioritySpending = ['high', 'medium', 'low'].map((priority) => {
    const priorityItems = items.filter((item) => item.priority === priority);
    const spent = priorityItems
      .filter((item) => item.isPurchased)
      .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
    const planned = priorityItems.reduce(
      (sum, item) => sum + (item.estimatedPrice || 0),
      0
    );

    return {
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      spent,
      planned,
      count: priorityItems.length,
    };
  });

  // Monthly spending (simplified - actual implementation would use real dates)
  const monthlyData = [
    {
      month: 'Oct',
      spent: spendingByList.reduce((sum, list) => sum + list.spent, 0) * 0.1,
    },
    {
      month: 'Nov',
      spent: spendingByList.reduce((sum, list) => sum + list.spent, 0) * 0.3,
    },
    {
      month: 'Dec',
      spent: spendingByList.reduce((sum, list) => sum + list.spent, 0) * 0.6,
    },
  ];

  const COLORS = [
    '#dc2626',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ef4444',
  ];

  const totalSpent = spendingByList.reduce((sum, list) => sum + list.spent, 0);
  const totalBudget = spendingByList.reduce(
    (sum, list) => sum + list.budget,
    0
  );
  const totalPlanned = spendingByList.reduce(
    (sum, list) => sum + list.planned,
    0
  );

  if (lists.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">No spending data yet</p>
        <p className="mb-4">
          Create some gift lists and add items to see spending summaries
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Spending Summary
        </h2>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalSpent.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalBudget.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Planned</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalPlanned.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Items Purchased</p>
            <p className="text-2xl font-bold text-gray-900">
              {items.filter((item) => item.isPurchased).length}/{items.length}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending by List - Simple Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Spending by List
            </h3>
            <div className="space-y-3">
              {spendingByList.map((list, index) => (
                <div
                  key={list.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-900">
                      {list.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${list.spent.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      of ${list.budget.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Progress Bars */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Budget Progress
            </h3>
            <div className="space-y-4">
              {spendingByList.map((list, index) => {
                const percentage =
                  list.budget > 0 ? (list.spent / list.budget) * 100 : 0;
                return (
                  <div key={list.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{list.name}</span>
                      <span className="text-gray-500">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Spending */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Spending by Priority
            </h3>
            <div className="space-y-4">
              {prioritySpending.map((priority, index) => (
                <div
                  key={priority.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-medium text-gray-900">
                      {priority.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({priority.count} items)
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${priority.spent.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      of ${priority.planned.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Spending Trend */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Spending Trend
            </h3>
            <div className="space-y-3">
              {monthlyData.map((month) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">
                    {month.month}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${
                            (month.spent /
                              Math.max(...monthlyData.map((m) => m.spent))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      ${month.spent.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
