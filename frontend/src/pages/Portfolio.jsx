import React, { useEffect, useState, useRef } from "react";
import "../css/portfolio.css";
import portfolioDefault from "../data/portfolioDefault.json";

import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCode,
  FaGraduationCap,
  FaCog,
  FaPaintBrush,
  FaExternalLinkAlt,
  FaPaperPlane,
  FaLock,
} from "react-icons/fa";
import { Menu, X, Plus, Trash2 } from "lucide-react";
import imageCompression from "browser-image-compression";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Portfolio() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const imageInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const [headerSection, setHeaderSection] = useState(portfolioDefault.headerSection);
  const [heroSection, setHeroSection] = useState(portfolioDefault.heroSection);
  const [aboutSection, setAboutSection] = useState(portfolioDefault.aboutSection);
  const [skillsSection, setSkillsSection] = useState(portfolioDefault.skillsSection);
  const [projectsSection, setProjectsSection] = useState(portfolioDefault.projectsSection);
  const [contactSection, setContactSection] = useState(portfolioDefault.contactSection);
  const [footerSection, setFooterSection] = useState(portfolioDefault.footerSection);

  const firstName = userData?.name?.split(" ")[0] || "";

  const validatePhone = (value) => {
    if (!value) return "";
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(value)) {
      return "⚠️ Enter a valid mobile number (7-15 digits, optional +).";
    }
    return "";
  };

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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 300,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderSection((prev) => ({
          ...prev,
          logoImage: reader.result,
          logoFileName: file.name,
        }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Logo compression error:", error);
    }
  };

  const removeLogo = () => {
    setHeaderSection((prev) => ({ ...prev, logoImage: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeroSection((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeroSection((prev) => ({ ...prev, cv: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setHeroSection((prev) => ({ ...prev, image: "/default-profile.jpg" }));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeCV = () => {
    setHeroSection((prev) => ({ ...prev, cv: "" }));
    if (cvInputRef.current) cvInputRef.current.value = "";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        navigate("/login");
        return;
      }

      try {
        await user.getIdToken();
        setCurrentUser(user);

        const portfolioSnap = await getDoc(doc(db, "trialData", user.uid));
        const userSnap = await getDoc(doc(db, "users", user.uid));

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setIsPremium(data?.premium === true);
        }

        if (portfolioSnap.exists()) {
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
        }
      } catch (error) {
        console.error("Firestore Error:", error);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const savePortfolio = async () => {
    if (!currentUser || isSaving) return;

    const phoneValErr = validatePhone(contactSection.phone);
    if (phoneValErr) {
      setPhoneError(phoneValErr);
      alert("Please correct your phone number.");
      setTimeout(() => {
        phoneInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        phoneInputRef.current?.focus();
      }, 300);
      return;
    }

    try {
      setIsSaving(true);
      await setDoc(doc(db, "trialData", currentUser.uid), {
        headerSection: {
          logo: headerSection.logo,
          logoImage: headerSection.logoImage,
        },
        heroSection: {
          ...heroSection,
          showGithub: heroSection.showGithub === true,
          showLinkedin: heroSection.showLinkedin === true,
        },
        aboutSection,
        skillsSection,
        projectsSection,
        contactSection,
        footerSection: {
          ...footerSection,
          showGithub: footerSection.showGithub === true,
          showLinkedin: footerSection.showLinkedin === true,
          showEmail: footerSection.showEmail === true,
        },
        updatedAt: Date.now(),
      });

      alert("Portfolio saved successfully! ✅");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login?type=register";
  };

  const addAboutCard = () => {
    setAboutSection((prev) => ({
      ...prev,
      cards: [
        ...prev.cards,
        {
          id: Date.now(),
          icon: "code",
          title: "New Skill",
          description: "Description here...",
        },
      ],
    }));
  };

  const removeAboutCard = (id) => {
    setAboutSection((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== id),
    }));
  };

  const addSkill = () => {
    setSkillsSection((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: Date.now(), name: "New Skill", percentage: 80 },
      ],
    }));
  };

  const removeSkill = (id) => {
    setSkillsSection((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const addProject = () => {
    setProjectsSection((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          title: "New Project",
          description: "Project description...",
          tag: "Tag",
          code: "#",
          demo: "#",
          showCode: true,
          showDemo: true,
        },
      ],
    }));
  };

  const removeProject = (id) => {
    setProjectsSection((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  return (
    <div className="portfolio-bg">
      {isSaving && (
        <div className="saving-overlay">
          <div className="flex flex-col items-center gap-3">
            <div className="saving-spinner border-4 border-cyan-400 border-t-transparent rounded-full"></div>
            <p className="font-semibold text-lg">Saving Portfolio...</p>
          </div>
        </div>
      )}

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
              className={`btn-customize ${editMode ? "btn-customize-active" : ""}`}
              onClick={async () => {
                if (editMode) await savePortfolio();
                setEditMode(!editMode);
              }}
            >
              {editMode ? "💾 Save" : "⚙️ Customize"}
            </button>

            {!isPremium && (
              <button
                className="btn-premium"
                onClick={() => navigate("/pricing")}
              >
                Go Premium
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="user-avatar-btn"
              >
                <div className="user-avatar-circle">
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden md:block text-sm text-white font-medium">
                  {firstName}
                </span>
              </button>

              {userMenu && (
                <div className="user-dropdown-menu">
                  <div className="p-3 border-b border-white/10">
                    <p className="font-semibold text-sm text-white break-words">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-white/60 break-all mt-0.5">
                      {userData?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/retrieve-domain")}
                    className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all rounded-lg mt-1"
                  >
                    My Domains
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

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
            {!isPremium && (
              <button
                className="btn-premium-mobile"
                onClick={() => {
                  setMobileMenu(false);
                  navigate("/pricing");
                }}
              >
                👑 Go Premium
              </button>
            )}
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
            {editMode ? (
              <div className="edit-box">
                <input
                  type="text"
                  className="edit-input"
                  value={heroSection.greeting}
                  onChange={(e) =>
                    setHeroSection({ ...heroSection, greeting: e.target.value })
                  }
                  placeholder="Greeting"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    className="edit-input"
                    value={heroSection.firstName}
                    onChange={(e) =>
                      setHeroSection({
                        ...heroSection,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    className="edit-input"
                    value={heroSection.lastName}
                    onChange={(e) =>
                      setHeroSection({
                        ...heroSection,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Last Name"
                  />
                </div>
                <input
                  type="text"
                  className="edit-input"
                  value={heroSection.role}
                  onChange={(e) =>
                    setHeroSection({ ...heroSection, role: e.target.value })
                  }
                  placeholder="Role"
                />
                <textarea
                  className="edit-textarea"
                  value={heroSection.description}
                  onChange={(e) =>
                    setHeroSection({
                      ...heroSection,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                />
              </div>
            ) : (
              <>
                <p className="hero-greeting">{heroSection.greeting}</p>
                <h1 className="hero-name">
                  {heroSection.firstName} {heroSection.lastName}
                </h1>
                <h2 className="hero-role">{heroSection.role}</h2>
                <p className="hero-desc">{heroSection.description}</p>
              </>
            )}

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

            {editMode && (
              <div className="edit-box mt-4">
                <p className="text-xs font-semibold text-cyan-300 uppercase">
                  Hero Settings & Links
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    className="edit-input"
                    value={heroSection.githubUsername}
                    onChange={(e) =>
                      setHeroSection({
                        ...heroSection,
                        githubUsername: e.target.value,
                      })
                    }
                    placeholder="GitHub Username"
                  />
                  <input
                    type="text"
                    className="edit-input"
                    value={heroSection.linkedinUsername}
                    onChange={(e) =>
                      setHeroSection({
                        ...heroSection,
                        linkedinUsername: e.target.value,
                      })
                    }
                    placeholder="LinkedIn Username"
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <label className="text-xs text-white/70 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroSection.showGithub}
                      onChange={(e) =>
                        setHeroSection({
                          ...heroSection,
                          showGithub: e.target.checked,
                        })
                      }
                    />
                    Show GitHub
                  </label>
                  <label className="text-xs text-white/70 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroSection.showLinkedin}
                      onChange={(e) =>
                        setHeroSection({
                          ...heroSection,
                          showLinkedin: e.target.checked,
                        })
                      }
                    />
                    Show LinkedIn
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="hero-right flex flex-col items-center justify-center">
            <div className="profile-img-box">
              <img
                src={heroSection.image || "/profile.png"}
                alt="Profile"
                className="profile-img"
              />
            </div>

            {editMode && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-center gap-2">
                  <label className="cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    Upload Photo
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={removeProfileImage}
                  >
                    Remove
                  </button>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    Upload CV (PDF)
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleCVUpload}
                      className="hidden"
                    />
                  </label>
                  {heroSection.cv && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={removeCV}
                    >
                      Remove CV
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-container" id="about">
        <div className="section-max">
          {editMode ? (
            <input
              type="text"
              className="edit-input text-center max-w-md mx-auto text-2xl font-bold mb-6"
              value={aboutSection.title}
              onChange={(e) =>
                setAboutSection({ ...aboutSection, title: e.target.value })
              }
            />
          ) : (
            <h2 className="section-title">{aboutSection.title}</h2>
          )}

          <div className="about-grid">
            {aboutSection.cards.map((card) => (
              <div key={card.id} className="about-card relative">
                {editMode ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <select
                        className="edit-input text-xs w-auto"
                        value={card.icon}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAboutSection((prev) => ({
                            ...prev,
                            cards: prev.cards.map((c) =>
                              c.id === card.id ? { ...c, icon: val } : c
                            ),
                          }));
                        }}
                      >
                        <option value="code">Code</option>
                        <option value="learn">Learn</option>
                        <option value="cog">Cog</option>
                        <option value="hobby">Hobby</option>
                      </select>
                      <button
                        className="remove-btn"
                        onClick={() => removeAboutCard(card.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="edit-input"
                      value={card.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAboutSection((prev) => ({
                          ...prev,
                          cards: prev.cards.map((c) =>
                            c.id === card.id ? { ...c, title: val } : c
                          ),
                        }));
                      }}
                    />
                    <textarea
                      className="edit-textarea"
                      value={card.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAboutSection((prev) => ({
                          ...prev,
                          cards: prev.cards.map((c) =>
                            c.id === card.id ? { ...c, description: val } : c
                          ),
                        }));
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="card-icon-wrapper">
                      {getIcon(card.icon)}
                    </div>
                    <h3 className="about-card-title">{card.title}</h3>
                    <p className="about-card-desc">{card.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          {editMode && (
            <button className="add-btn mx-auto" onClick={addAboutCard}>
              <Plus size={16} /> Add Card
            </button>
          )}
        </div>
      </section>

      <section className="section-container" id="skills">
        <div className="section-max">
          {editMode ? (
            <input
              type="text"
              className="edit-input text-center max-w-md mx-auto text-2xl font-bold mb-6"
              value={skillsSection.title}
              onChange={(e) =>
                setSkillsSection({ ...skillsSection, title: e.target.value })
              }
            />
          ) : (
            <h2 className="section-title">{skillsSection.title}</h2>
          )}

          <div className="skills-grid">
            <div className="skills-card">
              <h3 className="text-xl font-bold text-white mb-6">
                {skillsSection.leftTitle}
              </h3>
              <div className="space-y-4">
                {skillsSection.skills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    {editMode ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="edit-input"
                          value={skill.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSkillsSection((prev) => ({
                              ...prev,
                              skills: prev.skills.map((s) =>
                                s.id === skill.id ? { ...s, name: val } : s
                              ),
                            }));
                          }}
                        />
                        <input
                          type="number"
                          className="edit-input w-20"
                          value={skill.percentage}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSkillsSection((prev) => ({
                              ...prev,
                              skills: prev.skills.map((s) =>
                                s.id === skill.id
                                  ? { ...s, percentage: val }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <button
                          className="remove-btn"
                          onClick={() => removeSkill(skill.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm font-medium">
                          <span>{skill.name}</span>
                          <span className="text-cyan-400 font-bold">
                            {skill.percentage}%
                          </span>
                        </div>
                        <div className="skill-bar-container">
                          <div
                            className="skill-bar-fill"
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {editMode && (
                <button className="add-btn" onClick={addSkill}>
                  <Plus size={16} /> Add Skill
                </button>
              )}
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
          {editMode ? (
            <input
              type="text"
              className="edit-input text-center max-w-md mx-auto text-2xl font-bold mb-6"
              value={projectsSection.title}
              onChange={(e) =>
                setProjectsSection({
                  ...projectsSection,
                  title: e.target.value,
                })
              }
            />
          ) : (
            <h2 className="section-title">{projectsSection.title}</h2>
          )}

          <div className="projects-grid">
            {projectsSection.projects.map((proj) => (
              <div key={proj.id} className="project-card">
                {editMode ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        className="edit-input font-bold"
                        value={proj.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProjectsSection((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === proj.id ? { ...p, title: val } : p
                            ),
                          }));
                        }}
                      />
                      <button
                        className="remove-btn"
                        onClick={() => removeProject(proj.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      className="edit-textarea"
                      value={proj.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjectsSection((prev) => ({
                          ...prev,
                          projects: prev.projects.map((p) =>
                            p.id === proj.id ? { ...p, description: val } : p
                          ),
                        }));
                      }}
                    />
                    <input
                      type="text"
                      className="edit-input"
                      placeholder="Tag"
                      value={proj.tag}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjectsSection((prev) => ({
                          ...prev,
                          projects: prev.projects.map((p) =>
                            p.id === proj.id ? { ...p, tag: val } : p
                          ),
                        }));
                      }}
                    />
                    <input
                      type="text"
                      className="edit-input"
                      placeholder="Demo Link"
                      value={proj.demo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjectsSection((prev) => ({
                          ...prev,
                          projects: prev.projects.map((p) =>
                            p.id === proj.id ? { ...p, demo: val } : p
                          ),
                        }));
                      }}
                    />
                    <input
                      type="text"
                      className="edit-input"
                      placeholder="Code Link"
                      value={proj.code}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjectsSection((prev) => ({
                          ...prev,
                          projects: prev.projects.map((p) =>
                            p.id === proj.id ? { ...p, code: val } : p
                          ),
                        }));
                      }}
                    />
                  </div>
                ) : (
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
                          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
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
                )}
              </div>
            ))}
          </div>

          {editMode && (
            <button className="add-btn mx-auto" onClick={addProject}>
              <Plus size={16} /> Add Project
            </button>
          )}
        </div>
      </section>

      <section className="section-container" id="contact">
        <div className="section-max">
          <h2 className="section-title">{contactSection.title}</h2>

          <div className="contact-grid">
            <div className="contact-info-card">
              <h3 className="text-xl font-bold text-white mb-6">
                {contactSection.leftTitle}
              </h3>

              {editMode ? (
                <div className="space-y-3">
                  <input
                    type="email"
                    className="edit-input"
                    value={contactSection.email}
                    onChange={(e) =>
                      setContactSection({
                        ...contactSection,
                        email: e.target.value,
                      })
                    }
                    placeholder="Email"
                  />
                  <div>
                    <input
                      ref={phoneInputRef}
                      type="text"
                      className="edit-input"
                      value={contactSection.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContactSection({ ...contactSection, phone: val });
                        setPhoneError(validatePhone(val));
                      }}
                      placeholder="Phone (+1...)"
                    />
                    {phoneError && (
                      <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                    )}
                  </div>
                  <input
                    type="text"
                    className="edit-input"
                    value={contactSection.location}
                    onChange={(e) =>
                      setContactSection({
                        ...contactSection,
                        location: e.target.value,
                      })
                    }
                    placeholder="Location"
                  />
                </div>
              ) : (
                <div>
                  {contactItems.map((item, idx) => (
                    <div key={idx} className="contact-item">
                      <div className="contact-item-icon">{item.icon}</div>
                      <div>
                        <p className="text-xs text-white/40 uppercase">
                          {item.label}
                        </p>
                        <p className="text-sm sm:text-base text-white font-medium">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="contact-info-card">
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
                  className="w-full bg-[#050b18] border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full bg-[#050b18] border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  required
                  className="w-full bg-[#050b18] border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 resize-y"
                />
                <button type="submit" className="btn-primary w-full">
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
                className="hover:text-cyan-400 transition-colors"
              >
                GitHub
              </a>
            )}
            {footerSection.showLinkedin && (
              <a
                href={`https://linkedin.com/in/${footerSection.linkedinUsername}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors"
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
