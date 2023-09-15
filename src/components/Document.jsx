// import React, { useState, useEffect } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { doc, updateDoc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase.js';
// const modules = {
//   toolbar: [
//     ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//     ['blockquote', 'code-block'],
//     // [{ 'table': 'table' }], // Add table option
//     [{ 'header': 1 }, { 'header': 2 }], // custom button values
//     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//     [{ 'script': 'sub'}, { 'script': 'super' }], // superscript/subscript
//     [{ 'indent': '-1'}, { 'indent': '+1' }], // outdent/indent
//     [{ 'direction': 'rtl' }], // text direction

//     [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
//     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

//     [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
//     [{ 'font': [] }],
//     [{ 'align': [] }],

//     ['clean'], // remove formatting button

//     ['image', 'video'], // link and image, video
//   ],
// };


// const Document = ({ docId }) => {
//   const [value, setValue] = useState('');

//   useEffect(() => {
//     // Try to retrieve content from local storage
//     const localContent = localStorage.getItem(`docContent-${docId}`);
//     if (localContent) {
//       setValue(localContent);
//     } else {
//       // If not found in local storage, fetch from Firestore
//       fetchDoc();
//     }
//   }, [docId]);

//   useEffect(() => {
//     // Update local storage whenever the value changes
//     localStorage.setItem(`docContent-${docId}`, value);
//   }, [docId, value]);

//   const fetchDoc = async () => {
//     const docRef = doc(db, "userDocs", docId);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       setValue(docSnap.data().content);
//     } else {
//       console.log("No such document!");
//     }
//   };

//   const handleBlur = async () => {
//     const docRef = doc(db, "userDocs", docId);

//     await updateDoc(docRef, {
//       content: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Append the new content to the existing value
//     await handleBlur();
//     // Optionally, show a success message to the user
//     alert('Content saved successfully!');
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-md">
//     <ReactQuill 
//       theme="snow" 
//       modules={modules} 
//       value={value} 
//       onChange={setValue} 
//       onBlur={handleBlur} 
//       className="text-black h-[900px] border border-gray-300 p-2"
//     />
//     <button 
//       onClick={handleSubmit} 
//       className="mt-20 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//     >
//       Submit
//     </button>
//   </div>
//   );
// }

// export default Document;











import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const Document = ({ docId }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Try to retrieve content from local storage
    const localContent = localStorage.getItem(`docContent-${docId}`);
    if (localContent) {
      setValue(localContent);
    } else {
      // If not found in local storage, fetch from Firestore
      fetchDoc();
    }
  }, [docId]);

  useEffect(() => {
    // Update local storage whenever the value changes
    localStorage.setItem(`docContent-${docId}`, value);
  }, [docId, value]);

  const fetchDoc = async () => {
    const docRef = doc(db, "userDocs", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setValue(docSnap.data().content);
    } else {
      console.log("No such document!");
    }
  };

  const handleBlur = async () => {
    const docRef = doc(db, "userDocs", docId);

    await updateDoc(docRef, {
      content: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Append the new content to the existing value
    await handleBlur();
    // Optionally, show a success message to the user
    alert('Content saved successfully!');
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <CKEditor
        editor={ ClassicEditor }
        data={value}
        
        
        onChange={ ( event, editor ) => {
          const data = editor.getData();
          setValue(data);
        } }
        onBlur={handleBlur}
      />
      <button 
        onClick={handleSubmit} 
        className="mt-20 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}

export default Document;
