'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import {
  GiftGroup,
  GiftList,
  GiftItem,
  AppState,
  AppContextType,
} from '@/types';

// App state reducer
type AppAction =
  | { type: 'SET_CURRENT_GROUP'; payload: GiftGroup | null }
  | { type: 'SET_CURRENT_LIST'; payload: GiftList | null }
  | { type: 'SET_GROUPS'; payload: GiftGroup[] }
  | { type: 'SET_LISTS'; payload: GiftList[] }
  | { type: 'SET_ITEMS'; payload: GiftItem[] }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  currentGroup: null,
  currentList: null,
  groups: [],
  lists: [],
  items: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_GROUP':
      return { ...state, currentGroup: action.payload };
    case 'SET_CURRENT_LIST':
      return { ...state, currentList: action.payload };
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    case 'SET_LISTS':
      return { ...state, lists: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

const AppStateContext = createContext<AppContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

interface AppStateProviderProps {
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  // Set up real-time listeners for user's groups
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'RESET_STATE' });
      return;
    }

    const groupsQuery = query(
      collection(db, 'giftGroups'),
      where('memberIds', 'array-contains', user.id),
      orderBy('year', 'desc')
    );

    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groups: GiftGroup[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          } as GiftGroup)
      );

      dispatch({ type: 'SET_GROUPS', payload: groups });
    });

    return unsubscribe;
  }, [user]);

  // Set up real-time listeners for current group's lists
  useEffect(() => {
    if (!user || !state.currentGroup) {
      dispatch({ type: 'SET_LISTS', payload: [] });
      return;
    }

    const listsQuery = query(
      collection(db, 'giftLists'),
      where('groupId', '==', state.currentGroup.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(listsQuery, (snapshot) => {
      const lists: GiftList[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          } as GiftList)
      );

      dispatch({ type: 'SET_LISTS', payload: lists });
    });

    return unsubscribe;
  }, [user, state.currentGroup]);

  // Set up real-time listeners for current list's items
  useEffect(() => {
    if (!user || !state.currentList) {
      dispatch({ type: 'SET_ITEMS', payload: [] });
      return;
    }

    const itemsQuery = query(
      collection(db, 'giftItems'),
      where('listId', '==', state.currentList.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const items: GiftItem[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            purchaseDate: doc.data().purchaseDate?.toDate(),
          } as GiftItem)
      );

      dispatch({ type: 'SET_ITEMS', payload: items });
    });

    return unsubscribe;
  }, [user, state.currentList]);

  const setCurrentGroup = (group: GiftGroup | null) => {
    dispatch({ type: 'SET_CURRENT_GROUP', payload: group });
    // Reset current list when changing groups
    dispatch({ type: 'SET_CURRENT_LIST', payload: null });
  };

  const setCurrentList = (list: GiftList | null) => {
    dispatch({ type: 'SET_CURRENT_LIST', payload: list });
  };

  const refreshGroups = async () => {
    // Groups are automatically updated via real-time listener
  };

  const refreshLists = async () => {
    // Lists are automatically updated via real-time listener
  };

  const refreshItems = async () => {
    // Items are automatically updated via real-time listener
  };

  const value: AppContextType = {
    ...state,
    setCurrentGroup,
    setCurrentList,
    refreshGroups,
    refreshLists,
    refreshItems,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
