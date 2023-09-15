import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Layout from '../components/Layout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
// import { Carousel } from 'react-responsive-carousel';
// import backgroundImg from '../assets/polygon-scatter-haikei.svg';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {responsive} from "./Data.js"


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
  const [userDocs, setUserDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const allUsers = userSnapshot.docs.reduce((acc, doc) => {
        const userData = doc.data();
        console.log(userData)
        acc[userData.uid] = userData; // Store user data by uid
        return acc;
      }, {});

      const userDocsCollection = collection(db, 'userDocs');
      const q = query(userDocsCollection, where("userId", "!=", "Admin")); // Replace "admin" with the admin's user ID
      const userDocsSnapshot = await getDocs(q);
      const userDocsData = userDocsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Map userDocs data to include userImage and username from users collection
      const userDocsWithUserData = userDocsData.map(doc => ({
        ...doc,
        photoURL: allUsers[doc.userId]?.photoURL,
        displayName: allUsers[doc.userId]?.displayName,
      }));

      setUserDocs(userDocsWithUserData);
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
    <Layout title='admin' >
    <div className="admin-container" >
      <div className="users-container" >
        <h2>Users</h2>
        {/* Render user data... */}
      </div>
      <div className="docs-container">
        <h2>User Docs</h2>
        <Carousel
        showDots={true}
        responsive={responsive}
        infinite={true}
        //   autoPlay={this.props.deviceType !== "mobile" ? true : false}
        autoPlay={true}
        autoPlaySpeed={1000}
        customTransition="all 500ms ease"
        transitionDuration={1000}

        
        >
          {userDocs.map((doc, index) => (
            <div key={index} onClick={() => handleSelectDoc(doc)}>
              <img
                src={doc.photoURL}
                alt={doc.displayName}
                style={{ height: '200px', width: 'auto' }} // Adjust image height and width
              />
              <p className="legend" style={{width:"full"}}>{doc.displayName}</p>
            </div>
          ))}
        </Carousel>
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
    </div>
  </Layout>
  );
};

export default Admin;