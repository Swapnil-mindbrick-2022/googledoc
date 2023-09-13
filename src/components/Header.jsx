import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase.js"; // Import your Firebase auth instance
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebase.js"; 
// Import your Firestore instance
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth"; 
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const navigate  = useNavigate()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore using the user's UID
        const userDocRef = doc(db, "users", user.uid);

        try {
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            console.log("User Data:", userData);
            setDisplayName(userData.displayName);
            setPhotoURL(userData.photoURL);
          } else {
            console.log("User document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      } else {
        console.log("No user is currently authenticated.");
      }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear user data
      setDisplayName("");
      setPhotoURL("");
      navigate('/login')
      
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-full h-18 bg-red-200 shadow-lg px-5 border border-x-cyan-950 flex justify-between items-center">
      <div className="flex items-center">
        {photoURL ? (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        )}
        <span className="ml-2">{displayName}</span>
      </div>

      <div className="flex space-x-4">
        {displayName ? (
          <button onClick={handleLogout} className="text-gray-700 hover:text-blue-500">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-500">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;