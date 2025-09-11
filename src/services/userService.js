import { db } from '../firebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

const USERS_COL = 'users';

export async function findUserByEmail(email) {
  const q = query(collection(db, USERS_COL), where('email', '==', email.toLowerCase()), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ref: d.ref, ...d.data() };
}
