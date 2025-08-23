'use client';

import React from 'react';
import { GiftList, GiftItem, GiftGroup } from '@/types';

interface BudgetProgressProps {
  group: GiftGroup;
  lists: GiftList[];
  items: GiftItem[];
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  group,
  lists,
  items,
}) => {
  // Calculate spending for each list
  const listSpending = lists.map((list) => {
    const listItems = items.filter((item) => item.listId === list.id);
    const totalSpent = listItems
      .filter((item) => item.isPurchased)
      .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
    const totalBudget = list.budget;

    return {
      list,
      totalSpent,
      totalBudget,
      remaining: totalBudget - totalSpent,
      percentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    };
  });

  // Calculate overall group spending
  const overallSpent = listSpending.reduce((sum, ls) => sum + ls.totalSpent, 0);
  const overallBudget = group.overallBudget;
  const overallRemaining = overallBudget - overallSpent;
  const overallPercentage =
    overallBudget > 0 ? (overallSpent / overallBudget) * 100 : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 80) return 'bg-yellow-500';
    if (percentage <= 100) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTextColor = (percentage: number) => {
    if (percentage <= 50) return 'text-green-700';
    if (percentage <= 80) return 'text-yellow-700';
    if (percentage <= 100) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Budget Overview
        </h2>

        {/* Overall Group Budget */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Overall Budget: {group.name}
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ${overallSpent.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                of ${overallBudget.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                overallPercentage
              )}`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className={`font-medium ${getTextColor(overallPercentage)}`}>
              {overallPercentage.toFixed(1)}% used
            </span>
            <span
              className={
                overallRemaining >= 0 ? 'text-green-600' : 'text-red-600'
              }
            >
              ${Math.abs(overallRemaining).toFixed(2)}{' '}
              {overallRemaining >= 0 ? 'remaining' : 'over budget'}
            </span>
          </div>
        </div>

        {/* Individual List Budgets */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">List Budgets</h3>

          {listSpending.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No gift lists created yet</p>
              <p className="text-sm mt-2">
                Create some gift lists to track spending
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {listSpending.map(
                ({ list, totalSpent, totalBudget, remaining, percentage }) => (
                  <div
                    key={list.id}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {list.recipientName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Budget: ${totalBudget.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${totalSpent.toFixed(2)}
                        </p>
                        <p
                          className={`text-sm font-medium ${getTextColor(
                            percentage
                          )}`}
                        >
                          {percentage.toFixed(1)}% used
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                          percentage
                        )}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span
                        className={
                          remaining >= 0 ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        ${Math.abs(remaining).toFixed(2)}{' '}
                        {remaining >= 0 ? 'remaining' : 'over budget'}
                      </span>
                      <span className="text-gray-500">
                        {items.filter((item) => item.listId === list.id).length}{' '}
                        items
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Budget Alerts */}
      {(overallPercentage > 80 ||
        listSpending.some((ls) => ls.percentage > 80)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Budget Alerts
          </h3>
          <div className="space-y-2">
            {overallPercentage > 100 && (
              <p className="text-red-600 text-sm">
                ⚠️ Overall budget exceeded by $
                {(overallSpent - overallBudget).toFixed(2)}
              </p>
            )}
            {overallPercentage > 80 && overallPercentage <= 100 && (
              <p className="text-yellow-600 text-sm">
                ⚠️ Overall budget is {overallPercentage.toFixed(1)}% used
              </p>
            )}
            {listSpending
              .filter((ls) => ls.percentage > 80)
              .map((ls) => (
                <p
                  key={ls.list.id}
                  className={`text-sm ${
                    ls.percentage > 100 ? 'text-red-600' : 'text-yellow-600'
                  }`}
                >
                  ⚠️ {ls.list.recipientName} budget is{' '}
                  {ls.percentage.toFixed(1)}% used
                  {ls.percentage > 100 &&
                    ` (over by $${(ls.totalSpent - ls.totalBudget).toFixed(
                      2
                    )})`}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
