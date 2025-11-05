import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-red-500 shadow-md flex items-center px-4 z-50">
      <Link to="/" className="text-white font-bold text-lg">Home</Link>
      <div className="ml-auto flex gap-4">
        <Link to="/quiz-home" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Vai ai Quiz
        </Link>
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Login
        </Link>
      </div>
    </nav>
  );
}
