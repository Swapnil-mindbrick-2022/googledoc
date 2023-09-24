import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Page/Home";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoutes.jsx";
import FoldersList from "./Page/FoldersList";
import Folder from "./Page/Folder";
import DocumentEditor from "./Page/DocumentEditor";
import Document from "./components/Document";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<FoldersList />} />
          <Route path="/admin/folder/:userId" element={<Folder />} />
          <Route path="/admin/edit/:docId" element={<DocumentEditor />} />
          <Route
            path="/user/edit/:docId"
            element={<ProtectedRoute element={<Document />} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
