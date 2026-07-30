import { useEffect, useState, useRef } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  const mobileMenuRef = useRef(null);
  const firstName = userData?.name?.split(" ")[0] || "";

  const hidePremiumButton =
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        toggleMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-3 md:px-10 lg:px-20 py-4 lg:py-3">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer select-none min-w-0 flex-1"
        >
          <h1 className="text-[15px] min-[390px]:text-[17px] lg:text-[27px] font-black tracking-tight">
            Centennial
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>

          <p className="hidden lg:block text-[11px] uppercase tracking-[3px] text-white/40 ">
            Build Your Digital Identity
          </p>
        </div>

        {/* Mobile Right Section */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 xl:hidden">
          {!hidePremiumButton && !loading && !isPremium && (
            <button
              onClick={() => navigate("/pricing")}
              className="
                bg-gradient-to-r
                from-yellow-500
                via-orange-500
                to-red-500
                text-white
                text-xs
                font-bold
                px-2.5 py-1.5 text-[11px]
                min-[390px]:px-4
                min-[390px]:py-2
                rounded-full
                border
                border-white/10
                shadow-lg
                transition-all
                duration-300
              "
            >
              Upgrade
            </button>
          )}

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

          <button
            onClick={toggleMenu}
            className="
              w-10
              h-10
              flex
              items-center
              justify-center
              text-white
              rounded-lg
              hover:bg-white/5
              transition-all
            "
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden xl:flex items-center gap-30">
          <div className="hidden xl:flex flex-1 items-center justify-center gap-8">
            <button
            onClick={() => navigate("/")}
            className="
            relative
            text-sm
            font-bold
            text-white/70
            hover:text-white
            transition-all
            duration-300
            after:absolute
            after:left-0
            after:-bottom-1
            after:h-[2px]
            after:w-0
            after:bg-purple-500
            after:transition-all
            after:duration-300
            hover:after:w-full
          "
          >
            Home
          </button>
          <button
            onClick={() => navigate("/login?type=demo")}
            className="
            relative
            text-sm
            font-bold
            text-white/70
            hover:text-white
            transition-all
            duration-300
            after:absolute
            after:left-0
            after:-bottom-1
            after:h-[2px]
            after:w-0
            after:bg-purple-500
            after:transition-all
            after:duration-300
            hover:after:w-full
          "
                  >
            Try Demo
          </button>
          <button
            onClick={() => navigate("/login?type=register")}
            className="
              relative
              text-sm
              font-bold
              text-white/70
              hover:text-white
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-purple-500
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Use Trial
          </button>
          <button
            onClick={() => navigate("/features")}
            className="
              relative
              text-sm
              font-bold
              text-white/70
              hover:text-white
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-purple-500
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Features
          </button>
          <button
            onClick={() => navigate("/faq")}
            className="
              relative
              text-sm
              font-bold
              text-white/70
              hover:text-white
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-purple-500
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            FAQ
          </button>
          <button
            onClick={() => navigate("/support")}
            className="
              relative
              text-sm
              font-bold
              text-white/70
              hover:text-white
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-purple-500
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Support
          </button>
          </div>

          <div className="flex items-center gap-4">
          {!hidePremiumButton && !loading && !isPremium && (
            <button
              onClick={() => navigate("/pricing")}
              className="
                bg-gradient-to-r
                from-yellow-500
                via-orange-500
                to-red-500
                text-white
                font-bold
                px-6
                py-2.5
                rounded-full
                text-sm
                border
                border-white/10
                shadow-lg
                hover:scale-105
                active:scale-95
                transition-all
                duration-300
              "
            >
              Go Premium
            </button>
          )}

          <div className="hidden xl:block">
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
        </div>
        </div>
        </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="
            fixed
            top-[72px]
            left-0
            right-0
            z-40
            xl:hidden
            bg-black/95
            backdrop-blur-xl
            border-t
            border-white/10
            shadow-2xl
          "
        >
          {/* ✅ User Info in Mobile Menu */}

          <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/?menu=open"
              className="
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              text-white/80
              hover:text-white
              hover:bg-white/5
              transition-all
              duration-300
              whitespace-nowrap
              "
            >
              Home
            </Link>
            <Link
              to="/login?type=demo&menu=open"
              className="
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              text-white/80
              hover:text-white
              hover:bg-white/5
              transition-all
              duration-300
              whitespace-nowrap
              "
            >
              Demo
            </Link>
            <Link
              to="/login?type=register&menu=open"
              className="
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              text-white/80
              hover:text-white
              hover:bg-white/5
              transition-all
              duration-300
              whitespace-nowrap
              "
            >
              Trial
            </Link>
            <Link
              to="/features?menu=open"
              className="
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              text-white/80
              hover:text-white
              hover:bg-white/5
              transition-all
              duration-300
              whitespace-nowrap
              "
            >
              Features
            </Link>
            <Link
              to="/faq?menu=open"
              className="
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              text-white/80
              hover:text-white
              hover:bg-white/5
              transition-all
              duration-300
              whitespace-nowrap
              "
            >
              FAQ
            </Link>
            <Link
              to="/support?menu=open"
              className="
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              text-white/80
              hover:text-white
              hover:bg-white/5
              transition-all
              duration-300
              whitespace-nowrap
              "
            >
              Support
            </Link>
          </div>
        </div>
      )}
    </>
  );
}