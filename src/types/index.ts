// Core application types

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Date;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

export interface GiftGroup {
  id: string;
  name: string;
  year: number;
  ownerId: string;
  memberIds: string[];
  overallBudget: number;
  createdAt: Date;
  isActive: boolean;
}

export interface GiftList {
  id: string;
  groupId: string;
  recipientName: string;
  recipientId?: string; // optional if recipient is a user
  budget: number;
  createdBy: string;
  collaboratorIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftItem {
  id: string;
  listId: string;
  title: string;
  description: string;
  imageUrl?: string;
  links: ItemLink[];
  estimatedPrice: number;
  isPurchased: boolean;
  purchasedBy?: string;
  purchaseDate?: Date;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemLink {
  url: string;
  label: string;
}

// Authentication types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// App state types
export interface AppState {
  currentGroup: GiftGroup | null;
  currentList: GiftList | null;
  groups: GiftGroup[];
  lists: GiftList[];
  items: GiftItem[];
}

export interface AppContextType extends AppState {
  setCurrentGroup: (group: GiftGroup | null) => void;
  setCurrentList: (list: GiftList | null) => void;
  refreshGroups: () => Promise<void>;
  refreshLists: () => Promise<void>;
  refreshItems: () => Promise<void>;
}

// Form types
export interface CreateGroupForm {
  name: string;
  year: number;
  overallBudget: number;
}

export interface CreateListForm {
  recipientName: string;
  budget: number;
  collaboratorEmails: string[];
}

export interface CreateItemForm {
  title: string;
  description: string;
  imageUrl?: string;
  links: ItemLink[];
  estimatedPrice: number;
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

// API response types
export interface FirestoreResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
