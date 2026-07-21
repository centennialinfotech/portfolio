import { useState, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import "../css/home.css";
import {
  User,
  Briefcase,
  LinkIcon,
  ShieldCheck,
  Sparkles,
  Globe,
  FileText,
  Rocket,
  Smartphone,
  LayoutDashboard,
  X,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import faqData from "../data/faq.json";
import trustData from "../data/trust.json";
import statsData from "../data/stats.json";
import whyData from "../data/why.json";
import featuresData from "../data/features.json";
import plansData from "../data/plans.json";

const ICONS = {
  Briefcase, LinkIcon, ShieldCheck, Sparkles,
  Globe, FileText, Rocket, Smartphone, LayoutDashboard,
};

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const firstName = userData?.name?.split(" ")[0] || "";

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { setUserData(null); return; }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setUserData(snap.data());
      } catch (e) { console.log(e); }
    });
  }, []);

  return (
    <div className="home-bg">
      {show && (
        <div className="fixed bottom-8 right-0 z-50">
          <button onClick={() => scroll.scrollToTop({ duration: 500, smooth: true })} className="scroll-top-btn">
            Go to <br /> top
          </button>
        </div>
      )}

      <div className="glow-blue" id="fixed"></div>
      <div className="glow-purple"></div>

      <div className="sticky-nav">
        <nav className="nav-container">
          <div className="shrink-0">
            <h1 className="nav-logo" onClick={() => navigate("/")}>
              Centennial<span className="nav-logo-gradient">Portfolio</span>
            </h1>
            <p className="nav-logo-sub">Build Your Digital Identity</p>
          </div>

          <div className="nav-links">
            <button onClick={() => scroll.scrollToTop({ duration: 500, smooth: true })} className="nav-link">Get Started</button>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
            ))}
            {auth.currentUser && <a href="/retrieve-domain" className="nav-link">My Domains</a>}
          </div>

          <div className="nav-right">
            {(!userData || userData.premium !== true) && (
              <button onClick={() => navigate("/pricing")} className="go-premium-btn">
                Go Premium
              </button>
            )}

            {userData && (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="avatar-btn">
                  <div className="avatar-circle">{userData.name?.charAt(0).toUpperCase()}</div>
                  <span className="avatar-name">{firstName}</span>
                </button>
                {userMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-user-info">
                      <p className="dropdown-user-name">{userData?.name}</p>
                      <p className="dropdown-user-email">{userData?.email}</p>
                    </div>
                    <button onClick={() => navigate("/retrieve-domain")} className="dropdown-btn">My Domains</button>
                    <button onClick={async () => { await signOut(auth); setUserMenu(false); }} className="dropdown-btn-danger">Logout</button>
                  </div>
                )}
              </div>
            )}

            <button className="hamburger-btn" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        <div className={`mobile-menu-overlay ${mobileMenu ? "mobile-menu-open" : ""}`}>
          <div className="mobile-menu-container">
            <button
              onClick={() => { setMobileMenu(false); scroll.scrollToTop({ duration: 500, smooth: true }); }}
              className="mobile-menu-link"
            >
              Get Started
            </button>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMobileMenu(false)} className="mobile-menu-link">{l.label}</a>
            ))}
            {auth.currentUser && (
              <a href="/retrieve-domain" onClick={() => setMobileMenu(false)} className="mobile-menu-link">My Domains</a>
            )}
          </div>
        </div>
      </div>

      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-left">
            <h1 className="hero-title">
              Get Your
              <span className="hero-title-gradient">Dream Portfolio</span>
              <span className="hero-subtitle">Starting Less Than a Burger 🍔</span>
            </h1>

            <p id="hero" className="hero-desc">
              Create a stunning portfolio website with modern recruiter-focused design and powerful personal branding.
            </p>

            <div className="trust-strip">
              {trustData.map((t, i) => <span key={i} className="trust-tag">{t.label}</span>)}
            </div>

            <div className="hero-actions">
              <button onClick={() => navigate("/login?type=register")} className="btn-primary">Create My Portfolio</button>
              <button onClick={() => navigate("/login?type=login")} className="btn-secondary">Login</button>
              <button onClick={() => navigate("/login?type=demo")} className="btn-secondary">View Demo</button>
            </div>

            <div className="hero-stats">
              {statsData.map((s, i) => (
                <div key={i}>
                  <h2 className="stat-value">{s.value}</h2>
                  <p className="stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <div className="card-container">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Emma Johnson</h3>
                  <p className="card-subtitle">Senior UI/UX Designer</p>
                  <div className="card-badge">
                    <span className="card-badge-dot"></span>
                    Available for work
                  </div>
                </div>
                <div className="card-avatar-box"><User size={34} /></div>
              </div>

              <div className="card-section">
                <h4 className="card-section-title">About</h4>
                <p className="card-text">I design modern, user-centric digital experiences focused on usability, performance and conversion.</p>
              </div>

              <div className="card-section">
                <h4 className="card-section-title">Skills</h4>
                <div className="skill-list">
                  {["UI Design", "UX Research", "User Testing"].map((s, i) => (
                    <span key={i} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>

              <div className="card-stats">
                <div className="card-stat-card">
                  <h4 className="card-stat-label">Projects</h4>
                  <p className="card-stat-val">48+</p>
                  <p className="card-stat-desc">Completed successfully</p>
                </div>
                <div className="card-stat-card">
                  <h4 className="card-stat-label">Experience</h4>
                  <p className="card-stat-val">5+ Yrs</p>
                  <p className="card-stat-desc">Industry experience</p>
                </div>
              </div>

              <div className="card-section">
                <h4 className="card-section-title">Experience</h4>
                <ul className="card-list">
                  <li>• Designed SaaS dashboards for startup clients</li>
                  <li>• Improved user conversion rates by 35%</li>
                  <li>• Built scalable design systems for web & mobile</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-container">
          <h2 className="why-title">Why You Need a Portfolio Website</h2>
          <p className="why-desc">A professional portfolio helps recruiters and clients trust you faster, discover your work easily and remember your personal brand.</p>
          <div className="why-grid">
            {whyData.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <div key={i} className="why-card">
                  <div className="icon-wrapper">{Icon && <Icon size={28} />}</div>
                  <h3 className="why-card-title">{item.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="why-container">
          <div className="features-header">
            <h2 className="features-title">Powerful Features</h2>
            <p className="features-desc">Everything needed to build a recruiter-focused online portfolio.</p>
          </div>
          <div className="features-grid">
            {featuresData.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <div key={i} className="feature-card">
                  <div className="icon-wrapper">{Icon && <Icon size={28} />}</div>
                  <h3 className="feature-card-title">{item.title}</h3>
                  <p className="feature-card-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <div className="why-container">
          <div className="pricing-header">
            <h2 className="pricing-title">Simple Pricing</h2>
            <p className="pricing-desc">Affordable portfolio websites designed to help you stand out.</p>
          </div>
          <div className="pricing-grid">
            {plansData.map((plan, i) => {
              const inner = (
                <div className="h-full flex flex-col justify-between">
                  <div>
                    {plan.popular && <div className="pricing-popular-badge">Most Popular</div>}
                    <h3 className="pricing-card-title">{plan.name}</h3>
                    <div className="pricing-flex">
                      <span className="pricing-price">{plan.price}</span>
                      <span className="pricing-period">one time</span>
                    </div>
                    <div className="pricing-list">
                      {plan.features.map((f, j) => <p key={j}>✔ {f}</p>)}
                    </div>
                  </div>
                  <button onClick={() => navigate(plan.route)} className={plan.popular ? "pricing-btn-pro" : "pricing-btn-basic"}>
                    {plan.btnText}
                  </button>
                </div>
              );
              return plan.popular ? (
                <div key={i} className="pricing-card-pro-wrapper">
                  <div className="pricing-card-pro">{inner}</div>
                </div>
              ) : (
                <div key={i} className="pricing-card">{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="faq-section">
        <div className="why-container">
          <div className="faq-header">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-desc">Everything you need to know before getting started.</p>
          </div>
          <div className="faq-list">
            {faqData.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className={`faq-card ${isOpen ? "faq-card-open" : ""}`} onClick={() => setOpenIndex(isOpen ? null : i)}>
                  <div className="faq-card-header">
                    <h3 className="faq-question">{item.question}</h3>
                    <ChevronDown size={20} className={`faq-chevron ${isOpen ? "faq-chevron-open" : ""}`} />
                  </div>
                  <div className={`faq-answer-wrapper ${isOpen ? "faq-answer-open" : ""}`}>
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
