import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase'; // Assuming you've imported Firebase correctly
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import Layout from '../components/Layout';
import { ref, uploadString, getDownloadURL } from 'firebase/storage'; // Add these imports

function DocumentEditorrr() {
  const { docId } = useParams();
  const [documentContent, setDocumentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch documents using the Firebase Cloud Function
  async function fetchDocument(documentURL) {
    try {
      const response = await fetch(`https://us-central1-doc-3f582.cloudfunctions.net/fetchDocument?docId=${documentURL}`);
      if (!response.ok) {
        const errorMessage = `Failed to fetch document: ${response.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
  
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }
  
  useEffect(() => {
    const fetchDocumentContent = async () => {
      const documentRef = doc(db, 'userDocs', docId);
      const documentSnapshot = await getDoc(documentRef);

      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        const documentURL = documentData.content;

        try {
          const text = await fetchDocument(documentURL);
          setDocumentContent(text);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching document:', error);
          setError(error.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDocumentContent();
  }, [docId]);

  const handleBlur = async () => {
    try {
      const docRef = doc(db, 'userDocs', docId);
      const storageRef = ref(storage, `documents/${docId}`);

      // Upload the document content to Firebase Storage
      await uploadString(storageRef, documentContent);

      // Get the download URL and update the Firestore document
      const url = await getDownloadURL(storageRef);
      await updateDoc(docRef, {
        content: url,
      });

      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      setError(error.message);
    }
  };

  const handleContentChange = (content) => {
    setDocumentContent(content);
  };

  return (
    <Layout>
      <div>
        <h2>Edit Document</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <div>
              <SunEditor
                setContents={documentContent}
                onChange={handleContentChange}
                setOptions={{
                  height: 500,
                  buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link', 'image', 'video'],
                    ['fullScreen', 'showBlocks', 'codeView'],
                    ['preview', 'print'],
                    ['save', 'template'],
                  ],
                }}
              />
            </div>
            <div>
              <button
                className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleBlur}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default DocumentEditorrr;
