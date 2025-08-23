import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  Query,
  DocumentData,
  WhereFilterOp,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useRealtimeCollection<T extends { id: string }>(
  collectionName: string,
  constraints?: {
    where?: { field: string; operator: WhereFilterOp; value: unknown }[];
    orderBy?: { field: string; direction: 'asc' | 'desc' };
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const constraintsString = useMemo(
    () => JSON.stringify(constraints),
    [constraints]
  );

  useEffect(() => {
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

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items: T[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...(doc.data() as Omit<T, 'id'>),
              createdAt: doc.data().createdAt?.toDate(),
              updatedAt: doc.data().updatedAt?.toDate(),
              purchaseDate: doc.data().purchaseDate?.toDate(),
            } as unknown as T)
        );

        setData(items);
        setLoading(false);
        setError(null);
      },
      (err: Error) => {
        console.error('Realtime listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, constraintsString]);

  return { data, loading, error };
}
