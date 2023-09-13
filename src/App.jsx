import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from './Page/Home'
import Register from "./auth/Register";
import Login from "./auth/Login";
import Admin from "./Page/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/admin" element={<Admin />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;
