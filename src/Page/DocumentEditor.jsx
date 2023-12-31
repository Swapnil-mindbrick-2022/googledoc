import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import Layout from '../components/Layout';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

function DocumentEditor() {
  const { docId } = useParams();
  const [documentContent, setDocumentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentContent = async () => {
      const documentRef = doc(db, 'userDocs', docId);
      const documentSnapshot = await getDoc(documentRef);

      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        const documentURL = documentData.content;

        try {
          const response = await fetch(documentURL);

          if (!response.ok) {
            throw new Error(`Failed to fetch document: ${response.statusText}`);
          }

          const text = await response.text();
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
              <button   className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleBlur}>Save</button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default DocumentEditor;
