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
      alert('Please login');
      return;
    }
  
    try {
      const docRef = await addDoc(collection(db, "userDocs"), {
        // Initial document data
        content: '',
        createdAt: Date.now(),
        userId: user.uid, // Store the user UID
      });
      console.log("Document created with ID: ", docRef.id);
      setDocId(docRef.id);
  
      // Store docId in local storage
      localStorage.setItem('docId', docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <Layout title="home-page">
      {docId ? (
        // Document is open, hide the "Create Document" button
        <Document docId={docId} />
      ) : (
        // Document is not open, show the "Create Document" button
        <>
          <button onClick={createDocument}>Create Document</button>
          {user && docId && <Document docId={docId} />}
        </>
      )}
    </Layout>
  );
}

export default Home;
