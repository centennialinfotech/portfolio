import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import "../css/navbar-mobile.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check URL for menu parameter
  const [menuOpen, setMenuOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("menu") === "open";
  });

  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userMenu, setUserMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const firstName = userData?.name?.split(" ")[0] || "";

  const hidePremiumButton =
    location.pathname.startsWith("/pricing") ||
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/plan/basic");

  // ✅ ONE useEffect - Removed duplicate
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsPremium(false);
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setIsPremium(data?.premium === true);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update menu state when URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMenuOpen(params.get("menu") === "open");
  }, [location.search]);

  // ✅ Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenu && !e.target.closest(".user-menu-wrapper")) {
        setUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenu]);

  const toggleMenu = () => {
    const newState = !menuOpen;
    const params = new URLSearchParams(window.location.search);
    if (newState) {
      params.set("menu", "open");
    } else {
      params.delete("menu");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // ✅ Logout function
  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login?type=register";
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-28 py-6 border-b border-white/10 bg-black">
        {/* Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl sm:text-3xl font-black">
            Centennial
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Portfolio
            </span>
          </h1>
        </div>

        {/* Mobile Upgrade Button */}
        {!hidePremiumButton && !loading && !isPremium && (
          <button
            onClick={() => navigate("/pricing")}
            className="lg:hidden bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-2 rounded-full text-sm font-semibold"
          >
            Upgrade
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden" onClick={toggleMenu}>
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-5">
          <button
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/login?type=demo")}
            className="text-white/70 hover:text-white"
          >
            Try Demo
          </button>
          <button
            onClick={() => navigate("/login?type=register")}
            className="text-white/70 hover:text-white"
          >
            Use Trial
          </button>
          <button
            onClick={() => navigate("/features")}
            className="text-white/70 hover:text-white"
          >
            Features
          </button>
          <button
            onClick={() => navigate("/faq")}
            className="text-white/70 hover:text-white"
          >
            FAQ
          </button>
          <button
            onClick={() => navigate("/support")}
            className="text-white/70 hover:text-white"
          >
            Support
          </button>

          {!hidePremiumButton && !loading && !isPremium && (
            <button
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 px-5 py-2 rounded-full font-semibold"
            >
              Go Premium
            </button>
          )}
        </div>

        {/* ✅ User Avatar with Dropdown - Desktop */}
        {userData && (
          <div className="relative user-menu-wrapper">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white/70 text-sm hidden sm:block">
                {firstName}
              </span>
            </button>

            {/* ✅ User Dropdown Menu */}
            {userMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1b1b1b] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white font-semibold break-words">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-xs text-white/60 break-all">
                    {userData?.email}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/retrieve-domain")}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 text-white"
                >
                  My Domains
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
          {/* ✅ User Info in Mobile Menu */}

          <div className="flex flex-row flex-nowrap items-center justify-between gap-1 px-2 py-2 w-full">
            <a
              href="/?menu=open"
              className="flex-1 text-center text-[10px] sm:text-xs text-white/80 hover:text-white px-1 py-1.5 whitespace-nowrap"
            >
              Home
            </a>
            <a
              href="/login?type=demo&menu=open"
              className="flex-1 text-center text-[10px] sm:text-xs text-white/80 hover:text-white px-1 py-1.5 whitespace-nowrap"
            >
              Demo
            </a>
            <a
              href="/login?type=register&menu=open"
              className="flex-1 text-center text-[10px] sm:text-xs text-white/80 hover:text-white px-1 py-1.5 whitespace-nowrap"
            >
              Trial
            </a>
            <a
              href="/features?menu=open"
              className="flex-1 text-center text-[10px] sm:text-xs text-white/80 hover:text-white px-1 py-1.5 whitespace-nowrap"
            >
              Features
            </a>
            <a
              href="/faq?menu=open"
              className="flex-1 text-center text-[10px] sm:text-xs text-white/80 hover:text-white px-1 py-1.5 whitespace-nowrap"
            >
              FAQ
            </a>
            <a
              href="/support?menu=open"
              className="flex-1 text-center text-[10px] sm:text-xs text-white/80 hover:text-white px-1 py-1.5 whitespace-nowrap"
            >
              Support
            </a>
          </div>
        </div>
      )}
    </>
  );
}
