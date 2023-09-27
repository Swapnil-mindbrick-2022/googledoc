import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from 'firebase/storage';
import { uploadString } from 'firebase/storage';
import Layout from "./Layout";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const Document = () => {
  const { docId } = useParams();
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchDoc = async () => {
      const docRef = doc(db, "userDocs", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Fetch the content from the URL stored in Firestore
        const response = await fetch(docSnap.data().content);
        const text = await response.text();
        setValue(text);
      } else {
        console.log("No such document!");
      }
    };

    fetchDoc();
  }, [docId]);

  const handleBlur = async () => {
    const docRef = doc(db, 'userDocs', docId);

    // Create a storage reference
    const storageRef = ref(storage, `documents/${docId}`);

    // Upload the document content to Firebase Storage
    await uploadString(storageRef, value);

    // Get the download URL and update the Firestore document
    const url = await getDownloadURL(storageRef);
    await updateDoc(docRef, {
      content: url, // Store the download URL instead of the content
    });
  };

  const handleEditorChange = (content) => {
    setValue(content);
  };
  const handleKeyDown = (e) => {
    // Prevent copying (Ctrl+C)
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      alert("Copying is disabled in this editor.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleBlur();
    alert("Content saved successfully!");
  };
  return (
    <Layout title="Document Editor">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-screen-xl w-full border border-gray-300 flex-1 flex flex-col relative">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Edit Document
          </h2>
          <div className="border border-gray-300 p-4 rounded-lg h-[820px] w-full">
          <SunEditor
          setContents={value}
          onChange={handleEditorChange}
          setOptions={{
            height: 400,
            buttonList: [
              ["undo", "redo"],
              ["font", "fontSize", "formatBlock"],
              ["paragraphStyle", "blockquote"],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["fontColor", "hiliteColor", "textStyle"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["table", "link", "image", "video"],
              ["fullScreen", "showBlocks", "codeView"],
              ["preview", "print"],
              ["save", "template"],
            ],
         
          }}
          onKeyDown={handleKeyDown} // Handle Ctrl+C
        />
          </div>
          <button
            className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Document;