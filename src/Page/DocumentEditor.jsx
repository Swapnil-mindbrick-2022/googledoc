import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import Layout from '../components/Layout';

function DocumentEditor() {
  const { docId } = useParams();
  const [documentContent, setDocumentContent] = useState('');

  useEffect(() => {
    const fetchDocumentContent = async () => {
      const documentRef = doc(db, 'userDocs', docId);
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        setDocumentContent(documentData.content);
      }
    };

    fetchDocumentContent();
  }, [docId]);

  const handleContentChange = (content) => {
    setDocumentContent(content);
  };

  const handleSave = async () => {
    const documentRef = doc(db, 'userDocs', docId);
    await updateDoc(documentRef, {
      content: documentContent
    });
    alert('Content saved successfully!');
  };

  return (
   <Layout>
   <div>
   <h2>Edit Document</h2>
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
         ]
       }}
       
     />
   </div>
   <div>
     <button onClick={handleSave}>Save</button>
   </div>
 </div>
   </Layout>
  );
}

export default DocumentEditor;