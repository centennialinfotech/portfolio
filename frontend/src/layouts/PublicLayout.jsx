import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">
        <Navbar />
      </div>
      {/* Add padding so content doesn't hide behind navbar */}
      <div className="pt-20">{children}</div>
    </div>
  );
}
