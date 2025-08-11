import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase'; // Your initialized firestore instance
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

const BlogContext = createContext();

export function useBlog() {
  return useContext(BlogContext);
}

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // This useEffect sets up a REAL-TIME listener to Firestore
  useEffect(() => {
    setLoading(true);
    const postsCollectionRef = collection(db, 'posts');
    const q = query(postsCollectionRef, orderBy('timestamp', 'desc'));

    // onSnapshot is the real-time listener. It fires whenever the data changes.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ ...doc.data(), id: doc.id }); // Use the Firestore doc ID
      });
      setPosts(postsData);
      setLoading(false);
    });

    // Cleanup function to remove the listener when the component unmounts
    return unsubscribe;
  }, []);

  // --- Firestore Functions ---
  const addPost = async (postToAdd) => {
    const postsCollectionRef = collection(db, 'posts');
    await addDoc(postsCollectionRef, {
      ...postToAdd,
      timestamp: serverTimestamp(), // Use Firestore's server time
    });
  };

  const updatePost = async (updatedPost) => {
    const postDocRef = doc(db, 'posts', updatedPost.id);
    // You need to remove the id from the object before updating
    const { id, ...postData } = updatedPost;
    await updateDoc(postDocRef, postData);
  };

  const deletePost = async (postId) => {
    const postDocRef = doc(db, 'posts', postId);
    await deleteDoc(postDocRef);
  };

  const getPostById = (postId) => {
    return posts.find(p => p.id === postId);
  };

  const value = {
    posts,
    loading, // We can use this to show a loading spinner
    addPost,
    updatePost,
    deletePost,
    getPostById,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
}