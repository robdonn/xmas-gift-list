'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserProfile } from '@/components/auth/UserProfile';
import { useAppState } from '@/context/AppStateContext';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-christmas-red shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">
                  🎄 Christmas Gifts
                </h1>
              </div>
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-2">
              Welcome to your Christmas gift organizer
            </p>
          </div>

          <DashboardContent />
        </main>
      </div>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { groups } = useAppState();
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-christmas-red rounded-md flex items-center justify-center">
                <span className="text-white font-medium">👥</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Groups
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {groups.filter((g) => g.isActive).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-christmas-green rounded-md flex items-center justify-center">
                <span className="text-white font-medium">📝</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Gift Lists
                </dt>
                <dd className="text-lg font-medium text-gray-900">0</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-christmas-gold rounded-md flex items-center justify-center">
                <span className="text-white font-medium">🎁</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Gift Ideas
                </dt>
                <dd className="text-lg font-medium text-gray-900">0</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Groups */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Your Gift Groups
          </h3>
        </div>
        <div className="p-6">
          {groups.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎄</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No gift groups yet
              </h4>
              <p className="text-gray-600 mb-4">
                Create your first gift group to start organizing your Christmas
                lists
              </p>
              <button
                className="bg-christmas-red text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                onClick={() => router.push('/groups')}
              >
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {group.name}
                      </h4>
                      <p className="text-sm text-gray-600">{group.year}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {group.memberIds.length} member
                        {group.memberIds.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-christmas-green font-medium">
                        ${group.overallBudget}
                      </span>
                      <p className="text-xs text-gray-500">budget</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
                      onClick={() => router.push('/groups')}
                    >
                      View Groups
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
