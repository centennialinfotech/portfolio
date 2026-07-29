import PublicLayout from "../layouts/PublicLayout";
import usePageCSS from "../hooks/usePageCSS";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Sparkles,
  FileText,
  Rocket,
  Smartphone,
  LayoutDashboard,
} from "lucide-react";

export default function Features() {
  usePageCSS("/css/features.css");
  const navigate = useNavigate();

  const features = [
    {
      title: "Custom Domain",
      desc: "Use your own domain name for professional branding.",
      icon: <Globe size={32} />,
    },
    {
      title: "Modern Templates",
      desc: "Beautiful recruiter-focused portfolio designs.",
      icon: <Sparkles size={32} />,
    },
    {
      title: "Resume Upload",
      desc: "Upload your resume and allow recruiters to download it.",
      icon: <FileText size={32} />,
    },
    {
      title: "Fast Hosting",
      desc: "Optimized hosting with excellent performance.",
      icon: <Rocket size={32} />,
    },
    {
      title: "Mobile Responsive",
      desc: "Looks perfect on desktop, tablet and mobile.",
      icon: <Smartphone size={32} />,
    },
    {
      title: "Easy Dashboard",
      desc: "Manage your profile, projects and skills easily.",
      icon: <LayoutDashboard size={32} />,
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-28 py-22">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-center">
            Powerful Features
          </h1>

          <p className="text-white/60 mt-6 text-base sm:text-xl font-normal max-w-2xl mx-auto text-center mb-16">
            Everything you need to build a modern professional portfolio
            website.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="
                bg-white/[0.03]
                border
                border-white/5
                rounded-3xl
                p-8
                backdrop-blur-lg
                transition-all
                duration-300
                hover:-translate-y-2
                hover:bg-white/5
                hover:border-white/15
                "
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-8 mx-auto">
                    {item.icon}
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-white/90 text-center">{item.title}</h3>

                <p className="text-white/50 mt-4 leading-relaxed text-center">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
           <button
            onClick={() => navigate("/pricing")}
            className="
              inline-flex
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-pink-600
              px-8
              py-4
              font-semibold
              text-white
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-lg
              hover:shadow-purple-500/30
            "
          >
            View Pricing
          </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
