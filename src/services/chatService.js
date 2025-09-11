import { db } from '../firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  limit
} from 'firebase/firestore';

// Firestore paths
const CHATS_COL = 'chat';
const MESSAGES_COL = 'messege'; // keeping schema spelling
const USERS_COL = 'users';

function userRef(uid) {
  return doc(db, USERS_COL, uid);
}

function chatRef(id) {
  return doc(db, CHATS_COL, id);
}

export async function getOrCreateOneToOneChat(currentUid, otherUid) {
  const currentUserRef = userRef(currentUid);
  const otherUserRef = userRef(otherUid);

  // Try direct order
  const q1 = query(
    collection(db, CHATS_COL),
    where('userAuth', '==', currentUserRef),
    where('otherUser', '==', otherUserRef),
    limit(1)
  );
  const snap1 = await getDocs(q1);
  if (!snap1.empty) {
    return { id: snap1.docs[0].id, ref: snap1.docs[0].ref, data: snap1.docs[0].data() };
  }

  // Try swapped order
  const q2 = query(
    collection(db, CHATS_COL),
    where('userAuth', '==', otherUserRef),
    where('otherUser', '==', currentUserRef),
    limit(1)
  );
  const snap2 = await getDocs(q2);
  if (!snap2.empty) {
    return { id: snap2.docs[0].id, ref: snap2.docs[0].ref, data: snap2.docs[0].data() };
  }

  // Create new chat doc
  const newChat = {
    userAuth: currentUserRef,
    otherUser: otherUserRef,
    lastMessage: '',
    messageTime: serverTimestamp(),
    user: currentUserRef, // keeping fields per schema provided
    propertyCreatedBy: currentUserRef
  };

  const created = await addDoc(collection(db, CHATS_COL), newChat);
  const createdSnap = await getDoc(created);
  return { id: created.id, ref: created, data: createdSnap.data() };
}

export function subscribeToMessages(chatDocumentRef, cb) {
  const q = query(
    collection(db, MESSAGES_COL),
    where('chatRef', '==', chatDocumentRef)
  );
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        // Sort by messageTime, handling missing timestamps
        const timeA = a.messageTime?.toMillis?.() || 0;
        const timeB = b.messageTime?.toMillis?.() || 0;
        return timeA - timeB; // ascending order for messages
      });
    cb(msgs);
  });
}

export async function sendMessage({ chatDocumentRef, ownerUid, text, imagePath = null }) {
  const ownerRef = userRef(ownerUid);
  const msg = {
    messegeOwner: ownerRef,
    chatRef: chatDocumentRef,
    message: text || '',
    imagePath: imagePath,
    messageTime: serverTimestamp()
  };
  await addDoc(collection(db, MESSAGES_COL), msg);

  // Update chat summary
  await updateDoc(chatDocumentRef, {
    lastMessage: text || (imagePath ? '📷 Image' : ''),
    messageTime: serverTimestamp()
  });
}

// Subscribe to all chats that involve current user (userAuth == me OR otherUser == me)
export function subscribeToUserChats(currentUid, cb) {
  const meRef = userRef(currentUid);
  console.log('🔍 Subscribing to chats for user:', currentUid, 'User ref:', meRef);

  // Remove orderBy to avoid Firestore internal errors with missing fields
  const qAuth = query(collection(db, CHATS_COL), where('userAuth', '==', meRef));
  const qOther = query(collection(db, CHATS_COL), where('otherUser', '==', meRef));

  let chatsMap = new Map();

  const emit = () => {
    const list = Array.from(chatsMap.values())
      .sort((a, b) => {
        // Sort by messageTime if available, otherwise by document creation
        const timeA = a.messageTime?.toMillis?.() || 0;
        const timeB = b.messageTime?.toMillis?.() || 0;
        return timeB - timeA;
      });
    console.log('📋 Emitting chat list:', list);
    cb(list);
  };

  const unsub1 = onSnapshot(qAuth, (snap) => {
    console.log('📥 userAuth query snapshot:', snap.size, 'docs');
    snap.docChanges().forEach((ch) => {
      console.log('📄 userAuth doc change:', ch.type, ch.doc.id, ch.doc.data());
      if (ch.type === 'removed') {
        chatsMap.delete(ch.doc.id);
      } else {
        chatsMap.set(ch.doc.id, { id: ch.doc.id, ref: ch.doc.ref, ...ch.doc.data() });
      }
    });
    emit();
  }, (error) => {
    console.error('❌ Error in userAuth query:', error);
  });

  const unsub2 = onSnapshot(qOther, (snap) => {
    console.log('📥 otherUser query snapshot:', snap.size, 'docs');
    snap.docChanges().forEach((ch) => {
      console.log('📄 otherUser doc change:', ch.type, ch.doc.id, ch.doc.data());
      if (ch.type === 'removed') {
        chatsMap.delete(ch.doc.id);
      } else {
        chatsMap.set(ch.doc.id, { id: ch.doc.id, ref: ch.doc.ref, ...ch.doc.data() });
      }
    });
    emit();
  }, (error) => {
    console.error('❌ Error in otherUser query:', error);
  });

  return () => {
    unsub1 && unsub1();
    unsub2 && unsub2();
  };
}

// Resolve the other participant userRef field to a user object
export async function getOtherParticipant(chat, currentUid) {
  const { userAuth, otherUser } = chat;
  const otherRef = userAuth?.id === currentUid ? otherUser : userAuth;
  if (!otherRef) return null;
  const snap = await getDoc(otherRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ref: snap.ref, ...snap.data() };
}
