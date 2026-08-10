import { useEffect, useState } from "react";
// import "../css/portfolio.css";
import publicPortfolioCSS from "../css/portfolio.css?inline";
import usePageCSS from "../hooks/usePageCSS";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCode,
  FaGraduationCap,
  FaCog,
  FaPaintBrush,
  FaExternalLinkAlt,
  FaLock,
} from "react-icons/fa";
import { Menu, X } from "lucide-react";
import portfolioDefault from "../data/portfolioDefault.json";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function PublicPortfolio({ subdomain: propSubdomain }) {
  usePageCSS(publicPortfolioCSS, "public-portfolio");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  const [headerSection, setHeaderSection] = useState(portfolioDefault.headerSection);
  const [heroSection, setHeroSection] = useState(portfolioDefault.heroSection);
  const [aboutSection, setAboutSection] = useState(portfolioDefault.aboutSection);
  const [skillsSection, setSkillsSection] = useState(portfolioDefault.skillsSection);
  const [projectsSection, setProjectsSection] = useState(portfolioDefault.projectsSection);
  const [contactSection, setContactSection] = useState(portfolioDefault.contactSection);
  const [footerSection, setFooterSection] = useState(portfolioDefault.footerSection);

  useEffect(() => {
    const getUserBySubdomain = async () => {
      try {
        const host = window.location.hostname;
        const searchSubdomain = new URLSearchParams(window.location.search).get("subdomain");
        const hostSubdomain = host.split(".")[0].toLowerCase();
        const targetSubdomain = (propSubdomain || params.subdomain || searchSubdomain || (hostSubdomain !== "localhost" && hostSubdomain !== "127" ? hostSubdomain : ""))?.toLowerCase();

        if (!targetSubdomain) {
          setError("No subdomain specified.");
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "users"),
          where("subdomain", "==", targetSubdomain),
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("No user found for this subdomain.");
          setLoading(false);
          return;
        }

        const userDoc = snapshot.docs[0];
        const uid = userDoc.id;
        const userData = userDoc.data();
        setIsPremium(userData?.premium === true);

        const portfolioRef = doc(db, "trialData", uid);
        const portfolioSnap = await getDoc(portfolioRef);

        if (!portfolioSnap.exists()) {
          setError("Portfolio data not found.");
          setLoading(false);
          return;
        }

        const data = portfolioSnap.data();

        if (data.headerSection) setHeaderSection(data.headerSection);
        if (data.heroSection) {
          setHeroSection({
            ...data.heroSection,
            showGithub: data.heroSection.showGithub ?? true,
            showLinkedin: data.heroSection.showLinkedin ?? true,
          });
        }
        if (data.aboutSection) setAboutSection(data.aboutSection);
        if (data.skillsSection) setSkillsSection(data.skillsSection);
        if (data.projectsSection) setProjectsSection(data.projectsSection);
        if (data.contactSection) setContactSection(data.contactSection);
        if (data.footerSection) {
          setFooterSection({
            ...data.footerSection,
            showGithub: data.footerSection.showGithub ?? true,
            showLinkedin: data.footerSection.showLinkedin ?? true,
            showEmail: data.footerSection.showEmail ?? true,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    getUserBySubdomain();
  }, [propSubdomain]);

  if (loading) {
    return (
      <div className="portfolio-bg flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="saving-spinner border-4 border-cyan-400 border-t-transparent rounded-full"></div>
          <p className="font-semibold text-lg text-white/80">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-bg flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="max-w-md bg-[#07122b] border border-cyan-500/20 rounded-3xl p-8 shadow-2xl">
          <span className="text-4xl mb-4 block">🔍</span>
          <h2 className="text-2xl font-bold text-white mb-2">{error}</h2>
          <p className="text-white/60 text-sm mb-6">The requested subdomain portfolio could not be located.</p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const iconMap = {
    code: <FaCode />,
    learn: <FaGraduationCap />,
    cog: <FaCog />,
    hobby: <FaPaintBrush />,
  };
  const getIcon = (key) => iconMap[key] || <FaCode />;

  const contactItems = [
    { label: "Email", value: contactSection.email, icon: <FaEnvelope /> },
    { label: "Phone", value: contactSection.phone, icon: <FaPhoneAlt /> },
    { label: "Location", value: contactSection.location, icon: <FaMapMarkerAlt /> },
  ];

  return (
    <div className="portfolio-bg">
      <header className="portfolio-header">
        <div className="header-container">
          <div className="header-logo" onClick={() => navigate("/")}>
            {headerSection.logoImage ? (
              <img
                src={headerSection.logoImage}
                alt="Logo"
                className="logo-img"
              />
            ) : null}
            <span>{headerSection.logo}</span>
          </div>

          <nav className="header-nav">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="header-nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu-drawer ${mobileMenu ? "mobile-menu-drawer-open" : ""}`}>
          <div className="mobile-menu-content">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="mobile-menu-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="portfolio-hero" id="home">
        <div className="hero-grid">
          <div className="hero-left">
            <p className="hero-greeting">{heroSection.greeting}</p>
            <h1 className="hero-name">
              {heroSection.firstName} {heroSection.lastName}
            </h1>
            <h2 className="hero-role">{heroSection.role}</h2>
            <p className="hero-desc">{heroSection.description}</p>

            <div className="hero-buttons">
              {heroSection.cv ? (
                isPremium ? (
                  <a
                    href={heroSection.cv}
                    download="Resume.pdf"
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaPaperPlane /> Download CV
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      alert("🔒 Upgrade to Premium to download CV!");
                      navigate("/pricing");
                    }}
                    className="btn-primary flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
                  >
                    <FaLock className="text-yellow-400 animate-pulse" /> Download CV
                  </button>
                )
              ) : null}

              {heroSection.showGithub && (
                <a
                  href={`https://github.com/${heroSection.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaGithub /> GitHub
                </a>
              )}

              {heroSection.showLinkedin && (
                <a
                  href={`https://linkedin.com/in/${heroSection.linkedinUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="hero-right flex flex-col items-center justify-center">
            <div className="profile-img-box">
              <img
                src={heroSection.image || "/profile.png"}
                alt="Profile"
                className="profile-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-container" id="about">
        <div className="section-max">
          <h2 className="section-title">{aboutSection.title}</h2>

          <div className="about-grid">
            {aboutSection.cards.map((card) => (
              <div key={card.id} className="about-card relative">
                <div className="card-icon-wrapper">
                  {getIcon(card.icon)}
                </div>
                <h3 className="about-card-title">{card.title}</h3>
                <p className="about-card-desc">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container-skills" id="skills">
      <div className="section-max">
        <h2 className="section-skills-title">{skillsSection.title}</h2>

          <div className="skills-grid">
            <div className="skills-card">
              <h3 className="text-xl font-bold text-white mb-6">
                {skillsSection.leftTitle}
              </h3>
              <div className="space-y-4">
                {skillsSection.skills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{skill.name}</span>
                      <span className="text-white font-bold">
                        {skill.percentage}%
                      </span>
                    </div>
                    <div className="skill-bar-container">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="skills-card">
              <h3 className="text-xl font-bold text-white mb-6">
                {skillsSection.rightTitle}
              </h3>
              <div className="tech-tags-list">
                {skillsSection.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container" id="projects">
        <div className="section-max">
          <h2 className="section-title">{projectsSection.title}</h2>

          <div className="projects-grid">
            {projectsSection.projects.map((proj) => (
              <div key={proj.id} className="project-card">
                <div>
                  <h3 className="project-title">{proj.title}</h3>
                  <p className="project-desc">{proj.description}</p>
                  <span className="project-tag">{proj.tag}</span>
                  <div className="project-links">
                    {proj.showDemo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-white hover:text-white/80 flex items-center gap-1 font-semibold underline underline-offset-4"
                      >
                        Live Demo <FaExternalLinkAlt size={10} />
                      </a>
                    )}
                    {proj.showCode && (
                      <a
                        href={proj.code}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-white/70 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        Source Code <FaGithub size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container-contact" id="contact">
        <div className="section-max">
          <h2 className="section-title-contact">{contactSection.title}</h2>

          <div className="contact-grid">
            <div className="contact-info-card">
              <h3 className="text-xl font-bold text-white mb-6">
                {contactSection.leftTitle}
              </h3>
              <div>
                {contactItems.map((item, idx) => (
                  <div key={idx} className="contact-item">
                    <div className="contact-item-icon">
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 uppercase">
                        {item.label}
                      </p>

                      <p className="text-sm sm:text-base text-white font-medium break-all">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-info-card-right">
              <h3 className="text-xl font-bold text-white mb-6">
                {contactSection.rightTitle}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Message sent! (Demo)");
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full bg-[#0d1e42] border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full bg-[#0d1e42] border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                />

                <textarea
                  placeholder="Your Message"
                  rows={4}
                  required
                  className="w-full bg-[#0d1e42] border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 resize-y"
                />

                <button type="submit" className="btn-primary-contact w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="portfolio-footer">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{footerSection.copyright}</p>
          <div className="flex gap-4">
            {footerSection.showGithub && (
              <a
                href={`https://github.com/${footerSection.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            )}
            {footerSection.showLinkedin && (
              <a
                href={`https://linkedin.com/in/${footerSection.linkedinUsername}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
