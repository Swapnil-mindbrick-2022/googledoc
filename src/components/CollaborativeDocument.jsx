import React, { useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import Firepad from 'firepad';
// import 'codemirror/lib/codemirror.css';

import 'firepad/dist/firepad.css';


const CollaborativeDocument = ({ docId }) => {
  const firepadRef = useRef(null);

  useEffect(() => {
    const firepadDiv = firepadRef.current;
    const firepadFirebaseRef = firebase.database().ref().child(docId);
    const codeMirror = window.CodeMirror(firepadDiv, { lineWrapping: true });
    const firepad = Firepad.fromCodeMirror(firepadFirebaseRef, codeMirror, {
      richTextToolbar: true,
      richTextShortcuts: true,
    });

    return () => {
      firepad.dispose();
    };
  }, [docId]);

  return <div ref={firepadRef} style={{ height: '500px' }} />;
};

export default CollaborativeDocument;