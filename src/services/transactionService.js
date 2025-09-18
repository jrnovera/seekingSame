import { collection, query, where, getDocs, orderBy, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Fetch transactions for a specific user
 * @param {string} userId - The ID of the logged-in user
 * @param {Object} options - Additional filtering options
 * @param {string} [options.paidToId] - Optional ID to filter by paidTo field
 * @param {string} [options.filterType] - Optional filter type ('all', 'incoming', 'outgoing')
 * @returns {Promise<Array>} - Array of transaction documents
 */
export const fetchUserTransactions = async (userId, options = {}) => {
  try {
    const { paidToId, filterType } = options;
    let payerQuery, recipientQuery;
    let payerTransactions = [];
    let recipientTransactions = [];
    
    // If we're not filtering by a specific recipient or we want outgoing transactions
    if (!filterType || filterType === 'all' || filterType === 'outgoing') {
      // Create a query for transactions where the user is the payer
      if (paidToId) {
        // Filter by both payer and specific recipient
        payerQuery = query(
          collection(db, 'transactions'),
          where('payerId', '==', userId),
          where('paidTo', '==', paidToId)
        );
      } else {
        // Just filter by payer
        payerQuery = query(
          collection(db, 'transactions'),
          where('payerId', '==', userId)
        );
      }
      
      const payerSnapshot = await getDocs(payerQuery);
      payerTransactions = payerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'outgoing'
      }));
    }
    
    // If we're not filtering by a specific payer or we want incoming transactions
    if (!filterType || filterType === 'all' || filterType === 'incoming') {
      // Create a query for transactions where the user is the recipient
      if (paidToId && paidToId !== userId) {
        // If paidToId is specified and not the current user, we need to check if
        // the current user is the payer for this specific recipient
        recipientQuery = query(
          collection(db, 'transactions'),
          where('payerId', '==', paidToId),
          where('paidTo', '==', userId)
        );
      } else {
        // Just filter by recipient
        recipientQuery = query(
          collection(db, 'transactions'),
          where('paidTo', '==', userId)
        );
      }
      
      const recipientSnapshot = await getDocs(recipientQuery);
      recipientTransactions = recipientSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'incoming'
      }));
    }
    
    // Combine and sort by date (newest first)
    const allTransactions = [...payerTransactions, ...recipientTransactions]
      .sort((a, b) => {
        // Handle Firestore timestamps or date strings
        const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
        const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
      
    return allTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Filter transactions by type (incoming/outgoing)
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - 'incoming', 'outgoing', or 'all'
 * @returns {Array} - Filtered array of transactions
 */
export const filterTransactionsByType = (transactions, type) => {
  if (type === 'all') return transactions;
  return transactions.filter(transaction => transaction.type === type);
};

/**
 * Filter transactions by a specific paidTo user
 * @param {Array} transactions - Array of transaction objects
 * @param {string} paidToId - User ID to filter by in the paidTo field
 * @returns {Array} - Filtered array of transactions
 */
export const filterTransactionsByPaidTo = (transactions, paidToId) => {
  if (!paidToId) return transactions;
  return transactions.filter(transaction => transaction.paidTo === paidToId);
};

/**
 * Filter transactions by both user and paidTo fields
 * @param {Array} transactions - Array of transaction objects
 * @param {string} userId - The authenticated user's ID
 * @param {string} paidToId - User ID to filter by in the paidTo field
 * @param {string} filterType - 'incoming', 'outgoing', or 'all'
 * @returns {Array} - Filtered array of transactions
 */
export const filterTransactionsByUserAndPaidTo = (transactions, userId, paidToId, filterType = 'all') => {
  if (!transactions || transactions.length === 0) return [];
  
  let filteredTransactions = transactions;
  
  // First filter by type if specified
  if (filterType !== 'all') {
    filteredTransactions = filterTransactionsByType(filteredTransactions, filterType);
  }
  
  // Then filter by paidTo if specified
  if (paidToId) {
    filteredTransactions = filteredTransactions.filter(transaction => {
      if (filterType === 'outgoing' || filterType === 'all') {
        // For outgoing transactions, check if paidTo matches the specified ID
        if (transaction.type === 'outgoing' && transaction.paidTo === paidToId) {
          return true;
        }
      }
      
      if (filterType === 'incoming' || filterType === 'all') {
        // For incoming transactions, check if payerId matches the specified ID
        if (transaction.type === 'incoming' && transaction.payerId === paidToId) {
          return true;
        }
      }
      
      return false;
    });
  }
  
  return filteredTransactions;
};

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} - Created transaction reference
 */
export const createTransaction = async (transactionData) => {
  try {
    const transactionWithTimestamp = {
      ...transactionData,
      date: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'transactions'), transactionWithTimestamp);
    return { id: docRef.id, ...transactionWithTimestamp };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

/**
 * Get property details for a transaction
 * @param {string} propertyId - ID of the property
 * @returns {Promise<Object>} - Property data
 */
export const getPropertyDetails = async (propertyId) => {
  try {
    const propertyDoc = await getDoc(doc(db, 'properties', propertyId));
    if (propertyDoc.exists()) {
      return { id: propertyDoc.id, ...propertyDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching property details:', error);
    return null;
  }
};
