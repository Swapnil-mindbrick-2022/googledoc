import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const Document = ({ docId }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Try to retrieve content from local storage
    const localContent = localStorage.getItem(`docContent-${docId}`);
    if (localContent) {
      setValue(localContent);
    } else {
      // If not found in local storage, fetch from Firestore
      fetchDoc();
    }
  }, [docId]);

  useEffect(() => {
    // Update local storage whenever the value changes
    localStorage.setItem(`docContent-${docId}`, value);
  }, [docId, value]);

  const fetchDoc = async () => {
    const docRef = doc(db, "userDocs", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setValue(docSnap.data().content);
    } else {
      console.log("No such document!");
    }
  };

  const handleBlur = async () => {
    const docRef = doc(db, "userDocs", docId);

    await updateDoc(docRef, {
      content: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Append the new content to the existing value
    await handleBlur();
    // Optionally, show a success message to the user
    alert('Content saved successfully!');
  };

  return (
    <div>
      <ReactQuill theme="snow" value={value} onChange={setValue} onBlur={handleBlur} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Document;
