import { useEffect, useState } from "react";
import "../css/portfolio.css";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaRocket,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCode,
  FaGraduationCap,
  FaCog,
  FaPaintBrush,
} from "react-icons/fa";
import { Menu, X } from "lucide-react";

export default function PublicPortfolio() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [headerSection, setHeaderSection] = useState({
    logo: "Portfolio",
    logoImage: "",
  });

  const [heroSection, setHeroSection] = useState({
    greeting: "Hi, I'm",
    firstName: "Ashwani",
    lastName: "Kumar Chauhan",
    role: "MERN Stack Developer",
    description: "Passionate about creating responsive applications.",
    githubUsername: "yourusername",
    linkedinUsername: "yourusername",
    showGithub: true,
    showLinkedin: true,
    image: "/profile.png",
    cv: "",
  });

  const [aboutSection, setAboutSection] = useState({
    title: "About Me",
    cards: [
      {
        id: 1,
        icon: "code",
        title: "Web Development",
        description: "Passionate about creating responsive applications.",
      },
      {
        id: 2,
        icon: "learn",
        title: "Continuous Learning",
        description: "Always eager to learn new technologies.",
      },
      {
        id: 3,
        icon: "cog",
        title: "Problem Solving",
        description: "Enjoy tackling complex challenges.",
      },
      {
        id: 4,
        icon: "hobby",
        title: "My Hobby",
        description: "My aim is clear to become full stack developer.",
      },
    ],
  });

  const [skillsSection, setSkillsSection] = useState({
    title: "Skills & Technologies",
    leftTitle: "Technical Proficiency",
    rightTitle: "Technologies I Work With",
    skills: [
      { id: 1, name: "AI", percentage: 85 },
      { id: 2, name: "ABC", percentage: 80 },
      { id: 3, name: "MERN Stack", percentage: 90 },
      { id: 4, name: "Generative AI", percentage: 70 },
      { id: 5, name: "HTML", percentage: 90 },
      { id: 6, name: "CSS", percentage: 79 },
    ],
    technologies: ["AI", "ABC", "MERN Stack", "Generative AI", "HTML", "CSS"],
  });

  const [projectsSection, setProjectsSection] = useState({
    title: "Recent Projects",
    githubText: "WANT TO SEE MORE OF MY WORK?",
    githubLink: "https://github.com/",
    projects: [
      {
        id: 1,
        title: "Sales Funnel Optimization",
        description:
          "Improved a company's sales funnel to increase conversions.",
        tag: "Funnel steps (lead → call → close)",
        code: "#",
        demo: "#",
        showCode: true,
        showDemo: true,
      },
      {
        id: 2,
        title: "CRM Management Project",
        description: "Managed leads using tools like HubSpot or Salesforce.",
        tag: "Lead tracking system",
        code: "#",
        demo: "#",
        showCode: true,
        showDemo: true,
      },
    ],
  });

  const [contactSection, setContactSection] = useState({
    title: "Get In Touch",
    leftTitle: "Contact Information",
    rightTitle: "Send me a Message",
    email: "Ashwanikumarchauhan014@gmail.com",
    phone: "9616129738",
    location: "U.P, INDIA",
    opportunityTitle: "Open for Opportunities",
    opportunityDescription:
      "I'm actively looking for entry-level MERN Stack Developer roles and internship opportunities. If you have an exciting project or role, feel free to connect with me!",
  });

  const [footerSection, setFooterSection] = useState({
    name: "ashwani",
    description: "Building digital experiences with precision and passion.",
    githubUsername: "yourusername",
    linkedinUsername: "yourusername",
    email: "yourmail@gmail.com",
    showGithub: true,
    showLinkedin: true,
    showEmail: true,
    copyright: "© 2026 Ashwani kumar chauhan. All rights reserved.",
    location: "Lucknow, Uttar Pradesh, India",
  });

  useEffect(() => {
    const getUserBySubdomain = async () => {
      try {
        const host = window.location.hostname;
        const subdomain = host.split(".")[0].toLowerCase();

        console.log("Host:", host);
        console.log("Searching:", subdomain);

        const q = query(
          collection(db, "users"),
          where("subdomain", "==", subdomain),
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("No user found for this subdomain.");
          setLoading(false);
          return;
        }

        const userDoc = snapshot.docs[0];
        const uid = userDoc.id;

        console.log("User UID:", uid);

        console.log("Loading portfolio for uid:", uid);

        const portfolioRef = doc(db, "trialData", uid);

        console.log("Document Path:", portfolioRef.path);

        const portfolioSnap = await getDoc(portfolioRef);

        console.log("Exists:", portfolioSnap.exists());

        if (!portfolioSnap.exists()) {
          setError("Portfolio not found.");
          setLoading(false);
          return;
        }

        const data = portfolioSnap.data();

        console.log("Portfolio:", data);

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
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h2>{error}</h2>
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

  return (
    <>
      {/* Header */}
      <header className="dashboard header">
        <div className="logo">
          <>
            {headerSection.logoImage && (
              <img
                src={headerSection.logoImage}
                alt="logo"
                className="logo-img"
              />
            )}
            <span className="logo-display">{headerSection.logo}</span>
          </>
        </div>

        <nav className={`navbar ${mobileMenu ? "mobile-open" : ""}`}>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {mobileMenu && (
        <div className="mobile-nav-panel">
          <div className="mobile-nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-left">
          <>
            <h1>
              {heroSection.greeting} <span>{heroSection.firstName}</span>
              <br />
              {heroSection.lastName}
            </h1>
            <h2>{heroSection.role}</h2>
            <p>{heroSection.description}</p>
          </>

          <div className="hero-buttons">
            <button
              className="cv-btn"
              onClick={() => {
                if (!heroSection.cv) {
                  alert("Resume not available");
                  return;
                }

                const link = document.createElement("a");
                link.href = heroSection.cv;
                link.download = `${heroSection.firstName || "resume"}-Resume`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              DOWNLOAD RESUME
            </button>

            {/* ✅ Social Icons - Now using heroSection directly */}
            <div className="social-icons">
              {heroSection.showGithub === true && (
                <a
                  href={`https://github.com/${heroSection.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub size={28} />
                </a>
              )}

              {heroSection.showLinkedin === true && (
                <a
                  href={`https://linkedin.com/in/${heroSection.linkedinUsername}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin size={28} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="image-circle">
            <img src={heroSection.image} alt="profile" />
            {!isPremium && <div className="image-watermark">TRIAL</div>}
          </div>
        </div>
      </section>
      <section className="about-section" id="about">
        <div className="section-title">
          <h2>{aboutSection.title}</h2>
          <div className="underline"></div>
        </div>

        <div className="about-container">
          {aboutSection.cards.map((card, index) => (
            <div className="about-card" key={card.id}>
              <div className="icon"> {getIcon(card.icon)}</div>

              <>
                <h3>{card.title}</h3>

                <p>{card.description}</p>
              </>
            </div>
          ))}
        </div>
      </section>
      <section className="skills-section" id="skills">
        <div className="skills-title">
          <h2>skillsSection.title</h2>

          <div className="skills-line"></div>
        </div>

        <div className="skills-container">
          {/* LEFT */}

          <div className="skills-left">
            <h3>{skillsSection.leftTitle}</h3>

            {skillsSection.skills.map((skill, index) => (
              <div className="skill" key={skill.id}>
                <div className="skill-info">
                  <>
                    <span>{skill.name}</span>

                    <span>{skill.percentage}%</span>
                  </>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${skill.percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}

          <div className="skills-right">
            <h3>{skillsSection.rightTitle}</h3>

            <div className="tech-grid">
              {skillsSection.technologies.map((tech, index) => (
                <div className="tech-card" key={index}>
                  tech
                  {/* DELETE BUTTON MOVED HERE (AFTER TEXT) */}
                </div>
              ))}
            </div>

            {/* ADD BUTTON */}
          </div>
        </div>
      </section>
      <section className="projects-section" id="projects">
        <h1 className="section-title">projectsSection.title</h1>

        <div className="projects-grid">
          {projectsSection.projects.map((project, index) => (
            <div className="project-card" key={project.id}>
              <h2>
                <FaRocket className="rocket-icon" />
                project.title
              </h2>

              <p>{project.description}</p>

              <span className="project-tag">{project.tag}</span>

              <div className="project-buttons">
                <>
                  {project.showCode && (
                    <a href={project.code} className="btn-outline">
                      <FaGithub /> CODE
                    </a>
                  )}

                  {project.showDemo && (
                    <a
                      href={project.demo}
                      className="btn-filled"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaExternalLinkAlt /> LIVE DEMO
                    </a>
                  )}
                </>
              </div>
            </div>
          ))}
        </div>

        <div className="github-section">
          <>
            <p>{projectsSection.githubText}</p>

            <a href={projectsSection.githubLink} className="github-btn">
              <FaGithub />
              VISIT MY GITHUB
            </a>
          </>
        </div>
      </section>
      <section className="contact-section" id="contact">
        <h1 className="contact-title">contactSection.title</h1>

        <div className="contact-container">
          {/* LEFT */}

          <div className="contact-left">
            <h2>{contactSection.leftTitle}</h2>

            {/* EMAIL */}

            <div className="info-card">
              <div className="icon-box">
                <FaEnvelope />
              </div>

              <div>
                <span>EMAIL</span>

                <p>{contactSection.email}</p>
              </div>
            </div>

            {/* PHONE */}

            <div className="info-card">
              <div className="icon-box">
                <FaPhoneAlt />
              </div>

              <div>
                <span>PHONE</span>

                <p>{contactSection.phone}</p>
              </div>
            </div>

            {/* LOCATION */}

            <div className="info-card">
              <div className="icon-box">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>LOCATION</span>

                <p>{contactSection.location}</p>
              </div>
            </div>

            {/* OPPORTUNITY */}

            <div className="opportunity-card">
              <>
                <h3>{contactSection.opportunityTitle}</h3>

                <p>{contactSection.opportunityDescription}</p>
              </>
            </div>
          </div>

          {/* RIGHT */}

          <div className="contact-right">
            <h2>{contactSection.rightTitle}</h2>

            <form className="contact-form">
              <input type="text" placeholder="Your Name" />

              <input type="email" placeholder="Email Address" />

              <textarea rows="6" placeholder="Your Message"></textarea>

              <button type="submit">
                <FaPaperPlane />
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-left">
            <>
              <h1>{footerSection.name}</h1>

              <p>{footerSection.description}</p>
            </>
          </div>

          <div className="footer-icons">
            <>
              {footerSection.showGithub && (
                <a
                  href={`https://github.com/${footerSection.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub />
                </a>
              )}

              {footerSection.showLinkedin && (
                <a
                  href={`https://linkedin.com/in/${footerSection.linkedinUsername}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin />
                </a>
              )}

              {footerSection.showEmail && (
                <a href={`mailto:${footerSection.email}`}>
                  <FaEnvelope />
                </a>
              )}
            </>
          </div>
        </div>

        <div className="footer-line"></div>

        <div className="footer-bottom">
          <>
            <p>{footerSection.copyright}</p>

            <span>{footerSection.location}</span>
          </>
        </div>
      </footer>
    </>
  );
}
