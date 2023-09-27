import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';
import { BsFileEarmarkWord } from 'react-icons/bs';

function Folder() {
  const { userId } = useParams();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const documentsCollection = collection(db, 'userDocs');
      const q = query(documentsCollection, where('userId', '==', userId));
      const documentsSnapshot = await getDocs(q);
      const allDocuments = documentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("all Documents", allDocuments)
      setDocuments(allDocuments);
    };

    fetchDocuments();
  }, [userId]);
  const isMobile = window.innerWidth < 640;

  return (
    <Layout title={`Documents for User ${userId}`}>
      <div className='mt-10'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-opacity-70 bg-white hover:bg-opacity-100 backdrop-blur-lg rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              <Link to={`/admin/edit/${doc.id}`} className="flex flex-col items-center justify-center">
                <BsFileEarmarkWord
                  style={{ fontSize: isMobile ? '50px' : '100px' }}
                  className="text-blue-500 mb-2"
                />
                <span className="text-sm block flex-wrap text-center group-hover:text-blue-600">
                  {doc.name} {/* Use the document's name */}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Folder;
