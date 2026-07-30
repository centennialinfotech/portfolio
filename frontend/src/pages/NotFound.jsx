import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl font-black">404</h1>

      <h2 className="mt-4 text-3xl font-bold">
        Page Not Found
      </h2>

      <p className="mt-3 text-white/60 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold hover:scale-105 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}