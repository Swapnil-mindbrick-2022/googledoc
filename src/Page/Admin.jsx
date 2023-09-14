import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // assuming you have a firebase.js file that exports your Firestore instance
import Layout from '../components/Layout';
import mammoth from 'mammoth';
import { collection, getDocs } from 'firebase/firestore'; // Import mammoth library

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [userDocs, setUserDocs] = useState([]);

 
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      setUsers(userSnapshot.docs.map(doc => doc.data()));
  
      const userDocsCollection = collection(db, 'userDocs');
      const userDocsSnapshot = await getDocs(userDocsCollection);
      setUserDocs(userDocsSnapshot.docs.map(doc => doc.data()));
    };
  
    fetchUsers();
  }, []);

  // Function to convert HTML content to Word (.docx) format
  const convertToDocx = (htmlContent, fileName) => {
    const options = {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
      ],
    };

    mammoth.convertToHtml(htmlContent, options)
      .then((result) => {
        const blob = new Blob([result.value], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.docx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error converting to Word document:', error);
      });
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
            <button
              onClick={() => convertToDocx(doc.content, `UserDoc_${index}`)}
            >
              Download as Word
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Admin;
