import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from './Page/Home'
import Register from "./auth/Register";
import Login from "./auth/Login";
import Admin from "./Page/Admin";
import ProtectedRoute from './auth/ProtectedRoutes.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
        element={<ProtectedRoute element={<Home />} />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={<ProtectedRoute element={<Admin />} />}
        /> {/* Wrap ProtectedRoute in a Route component */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;
