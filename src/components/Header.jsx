import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        try {
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
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

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDisplayName("");
      setPhotoURL("");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-blue-500 text-white py-4 px-6 shadow-md flex justify-between items-center">
      <div className="flex items-center">
        {photoURL ? (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={photoURL}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        )}
        <span className="ml-2 text-xl">{displayName}</span>
      </div>

      <div className="flex space-x-4">
        {displayName ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-300 hover:text-gray-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-300 hover:text-gray-100"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
