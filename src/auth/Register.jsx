import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js"; // Import your Firebase auth instance
import { setDoc, doc, collection } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebase.js"; // Import your Firestore instance
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Import Firebase Storage functions
import toast from "react-hot-toast";
import { storage } from "../firebase.js"; // Import your Firebase Storage instance
import Layout from "../components/Layout.jsx";
import logo from "../assets/logo.jpeg"
import { updateProfile } from "firebase/auth"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
  
      let photoURL = null;
  
      // Upload the user's photo to Firebase Storage
      if (photo) {
        const storageRef = ref(storage, `user-photos/${user.uid}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }
  
      // Update the user's profile in Firebase Authentication
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });
  
      // If successful, update the user's profile in Firestore
      const userCollectionRef = collection(db, "users");
      await setDoc(doc(userCollectionRef, user.uid), {
        displayName: name,
        email: email,
        photoURL: photoURL, // Set this to the URL of the user's profile photo
      });
  
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Firebase authentication error:", error);
      toast.error("Registration failed. Please try again later.");
    }
  };

  return (
   <Layout title="Register">
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
   <div className="max-w-md w-full space-y-8">
     <div>
       <img
         className="mx-auto h-12 w-auto"
         src={logo}
         alt="Logo"
       />
       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
         Register your account
       </h2>
     </div>
     <form className="mt-8 space-y-6" onSubmit={handleRegister}>
     <div className="rounded-md shadow-sm -space-y-px">
       <div>
         <label htmlFor="name" className="sr-only">
           Name
         </label>
         <input
           id="name"
           name="name"
           type="text"
           required
           className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
           placeholder="Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
         />
       </div>
         <div>
           <label htmlFor="email" className="sr-only">
             Email address
           </label>
           <input
             id="email"
             name="email"
             type="email"
             autoComplete="email"
             required
             className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
             placeholder="Email address"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
           />
         </div>
         <div>
           <label htmlFor="password" className="sr-only">
             Password
           </label>
           <input
             id="password"
             name="password"
             type="password"
             autoComplete="new-password"
             required
             className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
             placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
         </div>
         <div>
           <label htmlFor="confirmPassword" className="sr-only">
             Confirm Password
           </label>
           <input
             id="confirmPassword"
             name="confirmPassword"
             type="password"
             autoComplete="new-password"
             required
             className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
             placeholder="Confirm Password"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
           />
         </div>
         <div>
           <label htmlFor="photo" className="sr-only">
             Photo
           </label>
           <input
             id="photo"
             name="photo"
             type="file"
             accept="image/*"
             onChange={(e) => setPhoto(e.target.files[0])}
           />
         </div>
       </div>

       <div>
         <button
           type="submit"
           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
         >
           Register
         </button>
       </div>
     </form>
     <p className="mt-2 text-center text-sm text-gray-600">
       Already have an account?{" "}
       <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
         Log in
       </Link>
     </p>
   </div>
 </div>
   
   </Layout>
  );
};

export default Register;
