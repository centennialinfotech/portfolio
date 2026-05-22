import {
  User,
  Briefcase,
  Link,
  ShieldCheck,
  Sparkles,
  Globe,
  LayoutDashboard,
  FileText,
  Rocket,
  Smartphone,
} from "lucide-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-blue-500/20 rounded-full blur-[120px]"></div>

      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-purple-500/20 rounded-full blur-[120px]"></div>

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-16 lg:px-28 py-6 border-b border-white/10 backdrop-blur-xl">

        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Centennial
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Portfolio
            </span>
          </h1>

          <p className="text-xs text-gray-500 mt-1 tracking-[3px] uppercase">
            Build Your Digital Identity
          </p>
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>

          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>

          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </div>

        <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 px-6 py-3 rounded-2xl font-semibold transition-all shadow-2xl">
          Get Started
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 px-6 md:px-16 lg:px-28 py-10">

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center">

          {/* LEFT SIDE */}
          <div>


            <h1 className="text-6xl md:text-8xl font-black leading-[1.02] tracking-tight">

              Get Your

              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Dream Portfolio
              </span>

              <span className="block text-white text-4xl md:text-5xl mt-5">
                Starting Less Than a Burger 🍔
              </span>
            </h1>

            <p className="mt-10 text-xl text-gray-300 leading-relaxed max-w-2xl">
              Create a stunning portfolio website with your own custom domain,
              modern recruiter-focused design and powerful personal branding.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-5 mt-12">

              <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 px-10 py-5 rounded-2xl font-semibold transition-all shadow-2xl">
                Create My Portfolio
              </button>

              <button className="px-10 py-5 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md hover:bg-white/10 transition-all">
                View Demo
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-10 mt-16 max-w-xl">

              <div>
                <h2 className="text-4xl font-black">500+</h2>
                <p className="text-gray-400 mt-2">
                  Portfolios Created
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black">99.9%</h2>
                <p className="text-gray-400 mt-2">
                  Uptime
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black">24/7</h2>
                <p className="text-gray-400 mt-2">
                  Support
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">

            <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-500/30 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-pink-500/30 rounded-full blur-3xl"></div>

            <div className="relative bg-white/[0.06] border border-white/15 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl">
              
              {/* PROFILE */}
              <div className="flex items-center justify-between mb-8">
                
                <div>
                  <h3 className="text-3xl font-black">
                    Michael Anderson
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Senior UI/UX Designer
                  </p>
                </div>

                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
  <User size={34} />
</div>
              </div>

              {/* ABOUT */}
              <div className="bg-black/30 rounded-3xl p-6 border border-white/5">

                <h4 className="font-semibold text-xl">
                  About
                </h4>

                <p className="text-gray-400 mt-4 leading-relaxed">
                  Passionate designer building premium digital experiences
                  for startups and modern brands worldwide.
                </p>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-5 mt-6">

                <div className="bg-black/30 rounded-3xl p-6 border border-white/5">
                  <h4 className="text-gray-400">
                    Projects
                  </h4>

                  <p className="text-4xl font-black mt-3">
                    24
                  </p>
                </div>

                <div className="bg-black/30 rounded-3xl p-6 border border-white/5">
                  <h4 className="text-gray-400">
                    Experience
                  </h4>

                  <p className="text-4xl font-black mt-3">
                    5Y+
                  </p>
                </div>
              </div>

              {/* DOMAIN BUTTON */}
              <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold mt-8 hover:opacity-90 transition-opacity text-lg">
                michaelanderson.com
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="relative z-10 px-6 md:px-16 lg:px-28 py-10">

        <div className="max-w-[1400px] mx-auto text-center">

          <h2 className="text-5xl md:text-6xl font-black leading-tight">
            Why You Need a Portfolio Website
          </h2>

          <p className="text-gray-400 text-xl mt-8 max-w-3xl mx-auto leading-relaxed">
            A professional portfolio helps recruiters and clients trust you
            faster, discover your work easily and remember your personal brand.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">

            {[
              "Look More Professional",
              "Share One Simple Link",
              "Increase Recruiter Trust",
              "Stand Out From Competition",
            ].map((item, index) => (

              <div
                key={index}
                className="bg-white/[0.06] border border-white/15 rounded-3xl p-10 backdrop-blur-lg hover:-translate-y-2 transition-transform"
              >

                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 mb-8 mx-auto flex items-center justify-center">
  {index === 0 && <Briefcase size={28} />}
  {index === 1 && <Link size={28} />}
  {index === 2 && <ShieldCheck size={28} />}
  {index === 3 && <Sparkles size={28} />}
</div>

                <h3 className="text-xl font-bold leading-relaxed">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 px-6 md:px-16 lg:px-28 py-10 "
      >

        <div className="max-w-[1400px] mx-auto">

          <div className="text-center mb-24">

            <h2 className="text-5xl md:text-6xl font-black">
              Powerful Features
            </h2>

            <p className="text-gray-400 mt-8 text-xl max-w-2xl mx-auto">
              Everything needed to build a recruiter-focused online portfolio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              {
                title: "Custom Domain",
                desc: "Use your own domain name for better branding.",
              },
              {
                title: "Modern Templates",
                desc: "Beautiful responsive designs optimized for hiring.",
              },
              {
                title: "Resume Upload",
                desc: "Upload resume PDF with recruiter download access.",
              },
              {
                title: "Fast Hosting",
                desc: "Optimized servers with excellent loading speed.",
              },
              {
                title: "Mobile Responsive",
                desc: "Perfect look across desktop, tablet and mobile.",
              },
              {
                title: "Easy Dashboard",
                desc: "Manage skills, projects and bio in one place.",
              },
            ].map((item, index) => (

              <div
                key={index}
                className="bg-white/[0.06] border border-white/15 rounded-3xl p-10 hover:-translate-y-2 transition-transform backdrop-blur-lg"
              >

                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 mb-8 flex items-center justify-center">
  {index === 0 && <Globe size={28} />}
  {index === 1 && <Sparkles size={28} />}
  {index === 2 && <FileText size={28} />}
  {index === 3 && <Rocket size={28} />}
  {index === 4 && <Smartphone size={28} />}
  {index === 5 && <LayoutDashboard size={28} />}
</div>

                <h3 className="text-3xl font-black">
                  {item.title}
                </h3>

                <p className="text-gray-400 mt-5 leading-relaxed text-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* PRICING */}
<section
  id="pricing"
  className="relative z-10 px-6 md:px-16 lg:px-28 py-32 border-t border-white/[0.03]"
>
  <div className="max-w-[1400px] mx-auto">

    <div className="text-center mb-20">
      <h2 className="text-5xl md:text-6xl font-black">
        Simple Pricing
      </h2>

      <p className="text-gray-400 text-xl mt-6 max-w-2xl mx-auto">
        Affordable portfolio websites designed to help you stand out.
      </p>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">

      {/* BASIC */}
      <div className="bg-white/[0.06] border border-white/10 rounded-[32px] p-10 backdrop-blur-xl">

        <h3 className="text-3xl font-black">
          Basic
        </h3>

        <div className="flex items-end gap-2 mt-8">
          <span className="text-6xl font-black">
            $19
          </span>

          <span className="text-gray-400 mb-2">
            one time
          </span>
        </div>

        <div className="space-y-5 mt-10 text-gray-300">

          <p>✔ Responsive Portfolio</p>
          <p>✔ Free Hosting</p>
          <p>✔ Resume Upload</p>
          <p>✔ Contact Section</p>
          <p>✔ Mobile Friendly</p>
        </div>

        <button className="w-full mt-10 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-[1.02] transition-transform">
          Get Started
        </button>
      </div>

      {/* PRO */}
      <div className="relative rounded-[32px] p-[1px] bg-gradient-to-br from-blue-500 to-purple-600">

        <div className="bg-black rounded-[32px] p-10 h-full">

          <div className="inline-flex px-4 py-2 rounded-full bg-white text-black font-semibold mb-6">
            Most Popular
          </div>

          <h3 className="text-3xl font-black">
            Professional
          </h3>

          <div className="flex items-end gap-2 mt-8">
            <span className="text-6xl font-black">
              $35
            </span>

            <span className="text-gray-400 mb-2">
              one time
            </span>
          </div>

          <div className="space-y-5 mt-10 text-gray-300">

            <p>✔ Custom Domain</p>
            <p>✔ Premium Design</p>
            <p>✔ SEO Optimization</p>
            <p>✔ Unlimited Projects</p>
            <p>✔ Priority Support</p>
          </div>

          <button className="w-full mt-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* BUSINESS */}
      <div className="bg-white/[0.06] border border-white/10 rounded-[32px] p-10 backdrop-blur-xl">

        <h3 className="text-3xl font-black">
          Business
        </h3>

        <div className="flex items-end gap-2 mt-8">
          <span className="text-6xl font-black">
            $49
          </span>

          <span className="text-gray-400 mb-2">
            one time
          </span>
        </div>

        <div className="space-y-5 mt-10 text-gray-300">

          <p>✔ Advanced Portfolio</p>
          <p>✔ Admin Dashboard</p>
          <p>✔ Blog Support</p>
          <p>✔ Analytics</p>
          <p>✔ Premium Hosting</p>
        </div>

        <button className="w-full mt-10 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-[1.02] transition-transform">
          Contact Sales
        </button>
      </div>
    </div>
  </div>
</section>
{/* FAQ SECTION */}
<section
  id="faq"
  className="relative z-10 px-6 md:px-16 lg:px-28 py-32 border-t border-white/[0.03]"
>
  <div className="max-w-5xl mx-auto">

    {/* HEADING */}
    <div className="text-center mb-20">

      <h2 className="text-5xl md:text-6xl font-black leading-tight">
        Frequently Asked Questions
      </h2>

      <p className="text-gray-400 text-xl mt-6 leading-relaxed">
        Everything you need to know before getting started.
      </p>
    </div>

    {/* FAQ ITEMS */}
    <div className="space-y-6">

      {[
        {
          question: "How long does it take to build my portfolio?",
          answer:
            "Your portfolio website is instantly ready to launch with modern design, hosting and mobile responsiveness included."
        },

        {
          question: "Can I use my own custom domain?",
          answer:
            "Yes. You can connect your personal custom domain anytime for professional branding."
        },

        {
          question: "Will my portfolio work on mobile devices?",
          answer:
            "Absolutely. Every portfolio is fully responsive across desktop, tablet and mobile."
        },

        {
          question: "Can I update projects and skills later?",
          answer:
            "Yes. You can easily add or edit projects, skills, resume and other information anytime."
        },

        {
          question: "Is hosting included?",
          answer:
            "Yes. Hosting is included in all plans so your website stays online smoothly."
        },

        {
          question: "Do recruiters really prefer portfolio websites?",
          answer:
            "Yes. A professional portfolio creates stronger first impressions and increases trust with recruiters and clients."
        }
      ].map((item, index) => (

        <div
          key={index}
          className="bg-white/[0.06] border border-white/10 rounded-[28px] p-8 backdrop-blur-xl hover:border-white/20 transition-all"
        >

          <h3 className="text-2xl font-bold">
            {item.question}
          </h3>

          <p className="text-gray-400 mt-5 leading-relaxed text-lg">
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
    </div>
  );
}

