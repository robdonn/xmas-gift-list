import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  collection,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GiftGroup, GiftList, GiftItem, User } from '@/types';

// Gift Groups CRUD operations
export class GiftGroupService {
  static async createGroup(
    data: Omit<GiftGroup, 'id' | 'createdAt'>
  ): Promise<GiftGroup> {
    const docRef = await addDoc(collection(db, 'giftGroups'), {
      ...data,
      createdAt: serverTimestamp(),
    });

    const newDoc = await getDoc(docRef);
    return {
      id: newDoc.id,
      ...newDoc.data(),
      createdAt: newDoc.data()?.createdAt?.toDate() || new Date(),
    } as GiftGroup;
  }

  static async updateGroup(
    id: string,
    data: Partial<GiftGroup>
  ): Promise<void> {
    const docRef = doc(db, 'giftGroups', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteGroup(id: string): Promise<void> {
    await deleteDoc(doc(db, 'giftGroups', id));
  }

  static async addMember(groupId: string, userId: string): Promise<void> {
    const docRef = doc(db, 'giftGroups', groupId);
    await updateDoc(docRef, {
      memberIds: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  }

  static async removeMember(groupId: string, userId: string): Promise<void> {
    const docRef = doc(db, 'giftGroups', groupId);
    await updateDoc(docRef, {
      memberIds: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  }
}

// Gift Lists CRUD operations
export class GiftListService {
  static async createList(
    data: Omit<GiftList, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<GiftList> {
    const docRef = await addDoc(collection(db, 'giftLists'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newDoc = await getDoc(docRef);
    return {
      id: newDoc.id,
      ...newDoc.data(),
      createdAt: newDoc.data()?.createdAt?.toDate() || new Date(),
      updatedAt: newDoc.data()?.updatedAt?.toDate() || new Date(),
    } as GiftList;
  }

  static async updateList(id: string, data: Partial<GiftList>): Promise<void> {
    const docRef = doc(db, 'giftLists', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteList(id: string): Promise<void> {
    await deleteDoc(doc(db, 'giftLists', id));
  }

  static async addCollaborator(listId: string, userId: string): Promise<void> {
    const docRef = doc(db, 'giftLists', listId);
    await updateDoc(docRef, {
      collaboratorIds: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  }

  static async removeCollaborator(
    listId: string,
    userId: string
  ): Promise<void> {
    const docRef = doc(db, 'giftLists', listId);
    await updateDoc(docRef, {
      collaboratorIds: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  }
}

// Gift Items CRUD operations
export class GiftItemService {
  static async createItem(
    data: Omit<GiftItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<GiftItem> {
    const docRef = await addDoc(collection(db, 'giftItems'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newDoc = await getDoc(docRef);
    return {
      id: newDoc.id,
      ...newDoc.data(),
      createdAt: newDoc.data()?.createdAt?.toDate() || new Date(),
      updatedAt: newDoc.data()?.updatedAt?.toDate() || new Date(),
      purchaseDate: newDoc.data()?.purchaseDate?.toDate(),
    } as GiftItem;
  }

  static async updateItem(id: string, data: Partial<GiftItem>): Promise<void> {
    const docRef = doc(db, 'giftItems', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteItem(id: string): Promise<void> {
    await deleteDoc(doc(db, 'giftItems', id));
  }

  static async markAsPurchased(id: string, purchasedBy: string): Promise<void> {
    const docRef = doc(db, 'giftItems', id);
    await updateDoc(docRef, {
      isPurchased: true,
      purchasedBy,
      purchaseDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  static async markAsUnpurchased(id: string): Promise<void> {
    const docRef = doc(db, 'giftItems', id);
    await updateDoc(docRef, {
      isPurchased: false,
      purchasedBy: null,
      purchaseDate: null,
      updatedAt: serverTimestamp(),
    });
  }
}

// User operations
export class UserService {
  static async updateUser(id: string, data: Partial<User>): Promise<void> {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async getUser(id: string): Promise<User | null> {
    const docSnap = await getDoc(doc(db, 'users', id));

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      } as User;
    }

    return null;
  }
}
