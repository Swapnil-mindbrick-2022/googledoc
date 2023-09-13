import { Link } from "react-router-dom";


const Header = () => {
  return (
    <div className="w-full h-18 bg-red-200 shadow-lg px-5 border border-x-cyan-950 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </div>

      <div className="flex space-x-4">
        <Link to="/login" className="text-gray-700 hover:text-blue-500">
          Login
        </Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-500">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Header;
