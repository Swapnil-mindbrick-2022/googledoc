import { useState } from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js"; // Import your Firebase auth instance
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import logo from "../assets/logo.jpeg"
const Login = () => {
  // const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in with email and password
      const data = await signInWithEmailAndPassword(auth, email, password);

      // If successful, you can retrieve user data from Firebase Firestore here
      // Example: Fetch user data from Firestore using the user's UID

      // Show a success toast message
      toast.success("Login successful!");
      console.log("login successfully")
      console.log(data)
      

      // Redirect to a different page upon successful login
      // You can use the useHistory hook or React Router for navigation
      // Example: history.push("/dashboard");
      navigate('/')
    } catch (error) {
      console.error("Firebase authentication error:", error);
      toast.error("Login failed. Please check your email and password.");
    }
  };

  return (
   <Layout title="Login">
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
   <div className="max-w-md w-full space-y-8">
     <div>
       <img
         className="mx-auto h-12 w-auto"
         src={logo}
         alt="Logo"
       />
       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
         Login to your account
       </h2>
     </div>
     <form className="mt-8 space-y-6" onSubmit={handleLogin}>
       <div className="rounded-md shadow-sm -space-y-px">
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
             autoComplete="current-password"
             required
             className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
             placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
         </div>
       </div>

       <div>
         <button
           type="submit"
           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
         >
           Login
         </button>
       </div>
     </form>
     <p className="mt-2 text-center text-sm text-gray-600">
       dont have account
       <a
         href="/register"
         className="font-medium text-indigo-600 hover:text-indigo-500"
       >
         Register
       </a>
     </p>
   </div>
 </div>
   </Layout>
  );
};

export default Login;
