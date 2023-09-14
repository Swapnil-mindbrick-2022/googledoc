import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.js';
import Layout from '../components/Layout.jsx';
import Document from '../components/Document.jsx';

const Home = () => {
  const [user, setUser] = useState(null);
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      setUser(userAuth);
    });

    // Check local storage for docId and set it if available
    const storedDocId = localStorage.getItem('docId');
    if (storedDocId) {
      setDocId(storedDocId);
    }

    return unsubscribe;
  }, []);

  const createDocument = async () => {
    if (!user) {
      alert('Please log in');
      return;
    }
  
    try {
      const docRef = await addDoc(collection(db, "userDocs"), {
        // Initial document data
        content: '',
        createdAt: Date.now(),
        userId: user.uid, // Store the user UID
      });
      console.log("Document created with ID:", docRef.id);
      setDocId(docRef.id);
  
      // Store docId in local storage
      localStorage.setItem('docId', docRef.id);
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  const resetDocument = () => {
    setDocId(null); // Reset the docId to null
  };

  return (
    <Layout title="home-page">
      <div>
        {docId ? (
          // Document is open, display the "Create Document" button
          <Document docId={docId} />
        ) : (
          // Document is not open, show the "Create Document" button
          <button onClick={createDocument}>Create Document</button>
        )}
        {docId && (
          // If a document is open, provide an option to reset it
          <button onClick={resetDocument}>Back to Home</button>
        )}
      </div>
    </Layout>
  );
}

export default Home;
