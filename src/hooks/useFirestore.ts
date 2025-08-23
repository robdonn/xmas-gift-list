import { useState } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Query,
  WhereFilterOp,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FirestoreResponse } from '@/types';

export function useFirestore<T>(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Omit<T, 'id'>): Promise<FirestoreResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      const result = { id: newDoc.id, ...newDoc.data() } as T;

      setLoading(false);
      return { data: result, error: null, loading: false };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage, loading: false };
    }
  };

  const read = async (id: string): Promise<FirestoreResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = { id: docSnap.id, ...docSnap.data() } as T;
        setLoading(false);
        return { data: result, error: null, loading: false };
      } else {
        setError('Document not found');
        setLoading(false);
        return { data: null, error: 'Document not found', loading: false };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage, loading: false };
    }
  };

  const update = async (
    id: string,
    data: Partial<T>
  ): Promise<FirestoreResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      const updatedDoc = await getDoc(docRef);
      const result = { id: updatedDoc.id, ...updatedDoc.data() } as T;

      setLoading(false);
      return { data: result, error: null, loading: false };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage, loading: false };
    }
  };

  const remove = async (id: string): Promise<FirestoreResponse<null>> => {
    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, collectionName, id));
      setLoading(false);
      return { data: null, error: null, loading: false };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage, loading: false };
    }
  };

  const list = async (constraints?: {
    where?: { field: string; operator: WhereFilterOp; value: unknown }[];
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    limit?: number;
  }): Promise<FirestoreResponse<T[]>> => {
    setLoading(true);
    setError(null);

    try {
      let q: Query<DocumentData> = collection(db, collectionName);

      if (constraints?.where) {
        constraints.where.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      if (constraints?.orderBy) {
        q = query(
          q,
          orderBy(constraints.orderBy.field, constraints.orderBy.direction)
        );
      }

      const querySnapshot = await getDocs(q);
      const results: T[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...(doc.data() as Omit<T, 'id'>),
          } as T)
      );

      setLoading(false);
      return { data: results, error: null, loading: false };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage, loading: false };
    }
  };

  return {
    create,
    read,
    update,
    remove,
    list,
    loading,
    error,
  };
}
