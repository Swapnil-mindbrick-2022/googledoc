import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import { BsFileEarmarkWord } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docName, setDocName] = useState('');
  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      setUser(userAuth);
    });

    if (user) {
      const q = query(collection(db, 'userDocs'), where('userId', '==', user.uid));
      getDocs(q).then(querySnapshot => {
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(docs);
      });
    }

    return unsubscribe;
  }, [user]);

  const createDocument = async () => {
    if (!user) {
      alert('Please log in');
      return;
    }

    const docQuery = query(collection(db, 'userDocs'), where('name', '==', docName));
    const docQuerySnapshot = await getDocs(docQuery);

    if (!docQuerySnapshot.empty) {
      toast.error('Document name already exists. Please choose another name.');
    } else {
      try {
        const docRef = await addDoc(collection(db, 'userDocs'), {
          content: '',
          createdAt: Date.now(),
          userId: user.uid,
          name: docName,
        });
        console.log('Document created with ID:', docRef.id);
        setDocName('');
        setDocuments([...documents, { id: docRef.id, name: docName }]);
      } catch (e) {
        console.error('Error adding document:', e);
      }
    }
  };

  const handleNameChange = (e) => {
    setDocName(e.target.value);
  };

  return (
    <Layout title='Home'>
      <div className="bg-gray-100 min-h-screen p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {user ? user.displayName : 'Guest'}
        </h1>
        <div className="mb-4">
          <input
            type='text'
            placeholder='Enter Document Name'
            value={docName}
            onChange={handleNameChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          />
          <button
            onClick={createDocument}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            Create Document
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-opacity-70 bg-white hover:bg-opacity-100 backdrop-blur-lg rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              >
                <Link to={`/user/edit/${doc.id}`} className="flex flex-col items-center justify-center">
                  <BsFileEarmarkWord
                    style={{ fontSize: isMobile ? '50px' : '100px' }}
                    className="text-blue-500 mb-2"
                  />
                  <span className="text-sm block flex-wrap text-center group-hover:text-blue-600">
                    {doc.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </Layout>
  );
};

export default Home;
