import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';
import { FcOpenedFolder } from 'react-icons/fc';

function FoldersList() {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const foldersCollection = collection(db, 'users');
      const foldersSnapshot = await getDocs(foldersCollection);
      const allFolders = foldersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter out users with the role 'Admin'
      const filteredFolders = allFolders.filter(folder => folder.role !== 'Admin');

      setFolders(filteredFolders);
    };

    fetchFolders();
  }, []);

  const isMobile = window.innerWidth < 640; // Adjust the screen width threshold as needed

  return (
    <Layout title="admin-folder">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">ALL-USERS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div key={folder.id} className="p-4 bg-opacity-70 bg-white hover:bg-opacity-100 backdrop-blur-lg rounded-lg shadow-md transition duration-300 transform hover:scale-105">
              <Link to={`/admin/folder/${folder.id}`} className="flex flex-col items-center justify-center">
                <FcOpenedFolder
                  style={{ fontSize: isMobile ? '50px' : '100px' }}
                  className="text-blue-500 mb-2"
                />
                <span className="text-lg block text-center group-hover:text-blue-600">
                  {folder.displayName}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default FoldersList;
