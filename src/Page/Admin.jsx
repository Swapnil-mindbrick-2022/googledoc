import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Layout from '../components/Layout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], 
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['image', 'video'],
  ],
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [userDocs, setUserDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      setUsers(userSnapshot.docs.map(doc => doc.data()));

      const userDocsCollection = collection(db, 'userDocs');
      const q = query(userDocsCollection, where("userId", "!=", "admin")); // Replace "admin" with the admin's user ID
      const userDocsSnapshot = await getDocs(q);
      setUserDocs(userDocsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, []);

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
  };

  const handleContentChange = (content) => {
    setSelectedDoc({ ...selectedDoc, content });
  };

  const handleSave = async () => {
    const docRef = doc(db, "userDocs", selectedDoc.id);
    await updateDoc(docRef, {
      content: selectedDoc.content
    });
    alert('Content saved successfully!');
  };

  return (
    <Layout title='admin'>
      <div> admin page </div>
      <div>
        <h2>Users</h2>
        {users.map((user, index) => (
          <div key={index}>
            {/* Render your user data here */}
          </div>
        ))}
      </div>
      <div>
        <h2>User Docs</h2>
        {userDocs.map((doc, index) => (
          <div key={index}>
            <button onClick={() => handleSelectDoc(doc)}>
              View Document
            </button>
          </div>
        ))}
        {selectedDoc && (
          <div className="p-6 bg-white shadow-md rounded-md">
            <ReactQuill 
              theme="snow" 
              modules={modules} 
              value={selectedDoc.content} 
              onChange={handleContentChange} 
              className="text-black h-[500px] border border-gray-300 p-2"
            />
            <button 
              onClick={handleSave} 
              className="mt-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;