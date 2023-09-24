import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Layout from '../components/Layout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {responsive} from "./Data.js"

// ... (modules and other code)
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
// const adminContainerStyle = {
//   backgroundImage: `url(${backgroundImg})`,
//   backgroundRepeat: 'no-repeat',
//   backgroundSize: 'cover', // Adjust as needed
//   backgroundPosition: 'center', // Adjust as needed
// };

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      // Assuming that you have a 'role' field in your user data
      // Exclude the admin user based on their role
      const allUsers = userSnapshot.docs
        .filter(doc => doc.data().role !== 'Admin')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(allUsers);
    };

    fetchUsers();
  }, []);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    const userDocsCollection = collection(db, 'userDocs');
    const q = query(userDocsCollection, where("userId", "==", user.uid));
    const userDocsSnapshot = await getDocs(q);
    const userDocsData = userDocsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSelectedDoc(userDocsData[0]); // Select the first document of the user
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
    <Layout title='admin' >
      <div className="admin-container" >
        <div className="users-container" >
          <h2>Users</h2>
          {users.map((user, index) => (
            <div key={index} onClick={() => handleSelectUser(user)}>
              <p>{user.displayName}</p>
            </div>
          ))}
        </div>
        {selectedDoc && (
          <div className="doc-editor">
            <ReactQuill
              theme="snow"
              modules={modules}
              value={selectedDoc.content}
              onChange={handleContentChange}
              className="text-black"
            />
            <button
              onClick={handleSave}
              className="save-button"
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