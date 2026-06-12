import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
import "../css/pricing.css";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-28 py-6 border-b border-white/10">
        {/* LOGO */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl sm:text-3xl font-black">
            Centennial
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Portfolio
            </span>
          </h1>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        {/* DESKTOP MENU */}
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
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white"
          >
            Features
          </button>

          <button
            onClick={() => navigate("/")}
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
        </div>
      </nav>
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-4 px-6 py-6 border-b border-white/10 bg-black">
          <button onClick={() => navigate("/")}>Home</button>

          <button onClick={() => navigate("/login?type=demo")}>Try Demo</button>

          <button onClick={() => navigate("/login?type=register")}>
            Use Trial
          </button>

          <button onClick={() => navigate("/")}>Feature</button>

          <button onClick={() => navigate("/")}>FAQ</button>

          <button onClick={() => navigate("/support")}>Support</button>
        </div>
      )}

      {/* PRICING */}
      <section
        id="pricing"
        className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-28 py-16 sm:py-20 md:py-24 border-t border-white/[0.03]"
      >
        {" "}
        <div className="max-w-[1400px] mx-auto">
          {" "}
          <div className="text-center mb-20">
            {" "}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl sm:text-5xl md:text-6xl font-black">
              Simple Pricing
            </h2>{" "}
            <p className="text-white/70 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-2xl mx-auto">
              {" "}
              Affordable portfolio websites designed to help you stand out.{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {" "}
            {/* BASIC */}{" "}
            <div className="bg-white/[0.06] border border-white/10 rounded-[32px] p-6 sm:p-8 md:p-10 backdrop-blur-xl">
              {" "}
              <h3 className="text-2xl sm:text-3xl font-black">Basic</h3>{" "}
              <div className="flex items-end gap-2 mt-8">
                {" "}
                <span className="text-4xl sm:text-5xl md:text-4xl sm:text-5xl md:text-6xl font-black">
                  $19
                </span>{" "}
                <span className="text-white/70 mb-2">one time</span>{" "}
              </div>{" "}
              <div className="space-y-5 mt-10 text-white/80">
                {" "}
                <p>✔ Responsive Portfolio</p> <p>✔ Free Hosting</p>{" "}
                <p>✔ Resume Upload</p> <p>✔ Contact Section</p>{" "}
                <p>✔ Mobile Friendly</p>{" "}
              </div>{" "}
              <button
                onClick={() => navigate("/plan/basic")}
                className="w-full mt-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base bg-white text-black font-semibold hover:scale-[1.02] transition-transform"
              >
                {" "}
                View Plan and Checkout{" "}
              </button>{" "}
            </div>{" "}
            {/* PRO */}{" "}
            <div className="relative rounded-[32px] p-[1px] bg-gradient-to-br from-blue-500 to-purple-600">
              {" "}
              <div className="bg-black rounded-[32px] p-6 sm:p-8 md:p-10 h-full">
                {" "}
                <div className="inline-flex px-4 py-2 rounded-full bg-white text-black font-semibold mb-6">
                  {" "}
                  Most Popular{" "}
                </div>{" "}
                <h3 className="text-2xl sm:text-3xl font-black">
                  Professional
                </h3>{" "}
                <div className="flex items-end gap-2 mt-8">
                  {" "}
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black">
                    $35
                  </span>{" "}
                  <span className="text-white/70 mb-2">one time</span>{" "}
                </div>{" "}
                <div className="space-y-5 mt-10 text-white/80">
                  {" "}
                  <p>✔ Custom Domain</p> <p>✔ Premium Design</p>{" "}
                  <p>✔ SEO Optimization</p> <p>✔ Unlimited Projects</p>{" "}
                  <p>✔ Priority Support</p>{" "}
                </div>{" "}
                <button
                  onClick={() => navigate("/support")}
                  className="w-full mt-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:opacity-90 transition-opacity"
                >
                  {" "}
                  Contact Sales{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            {/* BUSINESS */}{" "}
            <div className="bg-white/[0.06] border border-white/10 rounded-[32px] p-6 sm:p-8 md:p-10 backdrop-blur-xl">
              {" "}
              <h3 className="text-2xl sm:text-3xl font-black">Business</h3>{" "}
              <div className="flex items-end gap-2 mt-8">
                {" "}
                <span className="text-4xl sm:text-5xl md:text-6xl font-black">
                  $49
                </span>{" "}
                <span className="text-white/70 mb-2">one time</span>{" "}
              </div>{" "}
              <div className="space-y-5 mt-10 text-white/80">
                {" "}
                <p>✔ Advanced Portfolio</p> <p>✔ Admin Dashboard</p>{" "}
                <p>✔ Blog Support</p> <p>✔ Analytics</p>{" "}
                <p>✔ Premium Hosting</p>{" "}
              </div>{" "}
              <button
                onClick={() => navigate("/support")}
                className="w-full mt-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base bg-white text-black font-semibold hover:scale-[1.02] transition-transform"
              >
                {" "}
                Contact Sales{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>
    </div>
  );
}
