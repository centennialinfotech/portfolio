import React from "react";
import { Download } from "lucide-react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaRocket,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import githubLogo from "../assets/github.png";
import linkedinLogo from "../assets/linkedin.png";


const HeroSection = () => {
  const projects = [
  {
    title: "Sales Funnel Optimization",
    description:
      "Improved a company’s sales funnel to increase conversions.",
    tag: "Funnel steps (lead → call → close)",
    code: "#",
    demo: "#",
    hasDemo: true,
  },
  {
    title: "CRM Management Project",
    description:
      "Managed leads using tools like HubSpot or Salesforce.",
    tag: "Lead tracking system",
    code: "#",
    hasDemo: false,
  },
  {
    title: "Product Sales Campaign",
    description:
      "Sold a product/service using digital or direct sales methods.",
    tag: "Strategy used",
    code: "#",
    hasDemo: false,
  },
  {
    title: "Sign IN/UP",
    description: "check it",
    tag: "MERN Stack project",
    code: "#",
    hasDemo: false,
  },
];
  return (
    <>
      {/* Header */}
      <header className="dashboard header">
        <div className="logo">Portfolio.</div>

        <nav className="navbar">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Skills</a>
          <a href="#">Projects</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Hi, I'm <span>Ashwani</span>
            <br />
            Kumar Chauhan
          </h1>

          <h2>MERN Stack Developer</h2>

          <p>
            Passionate to create websites that are helpful for users.
          </p>

          <div className="hero-buttons">
            <button className="cv-btn">
              DOWNLOAD CV
            </button>

            <div className="social-icons">
  <a
    href="https://github.com/yourusername"
    target="_blank"
    rel="noreferrer"
  >
    <FaGithub size={28} />
  </a>

  <a
    href="https://linkedin.com/in/yourusername"
    target="_blank"
    rel="noreferrer"
  >
    <FaLinkedin size={28} />
  </a>
</div>
          </div>
        </div>

        <div className="hero-right">
          <div className="image-circle">
            <img
              src="/profile.png"
              alt="Ashwani"
            />
          </div>
        </div>
      </section>
      <section className="about-section">
  <div className="section-title">
    <h2>About Me</h2>
    <div className="underline"></div>
  </div>

  <div className="about-container">

    <div className="about-card">
      <div className="icon">{`</>`}</div>

      <h3>Web Development</h3>

      <p>
        Passionate about creating responsive applications.
      </p>
    </div>

    <div className="about-card">
      <div className="icon">🎓</div>

      <h3>Continuous Learning</h3>

      <p>
        Always eager to learn new technologies.
      </p>
    </div>

    <div className="about-card">
      <div className="icon">⚙️</div>

      <h3>Problem Solving</h3>

      <p>
        Enjoy tackling complex challenges.
      </p>
    </div>

    <div className="about-card">
      <div className="icon">🖌️</div>

      <h3>My Hobby Is Learning New Technology</h3>

      <p>
        My aim is clear to become full stack developer
      </p>
    </div>

  </div>
</section>
<section className="skills-section">

  <div className="skills-title">
    <h2>Skills & Technologies</h2>
    <div className="skills-line"></div>
  </div>

  <div className="skills-container">

    {/* Left Side */}
    <div className="skills-left">

      <h3>Technical Proficiency</h3>

      <div className="skill">
        <div className="skill-info">
          <span>AI</span>
          <span>85%</span>
        </div>

        <div className="progress-bar">
          <div className="progress ai"></div>
        </div>
      </div>

      <div className="skill">
        <div className="skill-info">
          <span>ABC</span>
          <span>80%</span>
        </div>

        <div className="progress-bar">
          <div className="progress abc"></div>
        </div>
      </div>

      <div className="skill">
        <div className="skill-info">
          <span>MERN stack</span>
          <span>90%</span>
        </div>

        <div className="progress-bar">
          <div className="progress mern"></div>
        </div>
      </div>

      <div className="skill">
        <div className="skill-info">
          <span>Generative AI</span>
          <span>70%</span>
        </div>

        <div className="progress-bar">
          <div className="progress genai"></div>
        </div>
      </div>

      <div className="skill">
        <div className="skill-info">
          <span>HTML</span>
          <span>90%</span>
        </div>

        <div className="progress-bar">
          <div className="progress html"></div>
        </div>
      </div>

      <div className="skill">
        <div className="skill-info">
          <span>CSS</span>
          <span>79%</span>
        </div>

        <div className="progress-bar">
          <div className="progress css"></div>
        </div>
      </div>

    </div>

    {/* Right Side */}
    <div className="skills-right">

      <h3>Technologies I Work With</h3>

      <div className="tech-grid">

        <div className="tech-card">AI</div>
        <div className="tech-card">ABC</div>
        <div className="tech-card">MERN stack</div>

        <div className="tech-card">Generative AI</div>
        <div className="tech-card">HTML</div>
        <div className="tech-card">CSS</div>

      </div>

    </div>

  </div>

</section>
 <section className="projects-section">
      <h1 className="section-title">Recent Projects</h1>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <h2>
              <FaRocket className="rocket-icon" /> {project.title}
            </h2>

            <p>{project.description}</p>

            <span className="project-tag">{project.tag}</span>

            <div className="project-buttons">
              <a href={project.code} className="btn-outline">
                <FaGithub /> CODE
              </a>

              {project.hasDemo && (
                <a href={project.demo} className="btn-filled">
                  <FaExternalLinkAlt /> LIVE DEMO
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="github-section">
        <p>WANT TO SEE MORE OF MY WORK?</p>

        <a href="https://github.com/" className="github-btn">
          <FaGithub /> VISIT MY GITHUB
        </a>
      </div>
    </section>
    <section className="contact-section">
      <h1 className="contact-title">Get In Touch</h1>

      <div className="contact-container">
        {/* LEFT SIDE */}
        <div className="contact-left">
          <h2>Contact Information</h2>

          <div className="info-card">
            <div className="icon-box">
              <FaEnvelope />
            </div>

            <div>
              <span>EMAIL</span>
              <p>Ashwanikumarchauhan014@gmail.com</p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon-box">
              <FaPhoneAlt />
            </div>

            <div>
              <span>PHONE</span>
              <p>9616129738</p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon-box">
              <FaMapMarkerAlt />
            </div>

            <div>
              <span>LOCATION</span>
              <p>U.P, INDIA</p>
            </div>
          </div>

          <div className="opportunity-card">
            <h3>Open for Opportunities</h3>

            <p>
              I'm actively looking for entry-level MERN Stack Developer
              roles and internship opportunities. If you have an exciting
              project or role, feel free to connect with me!
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-right">
          <h2>Send me a Message</h2>

          <form className="contact-form">
            <input type="text" placeholder="Your Name * *" />
            <input type="email" placeholder="Email Address * *" />

            <textarea
              rows="6"
              placeholder="Your Message * *"
            ></textarea>

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
          <h1>ashwani</h1>

          <p>
            Building digital experiences with
            <br />
            precision and passion.
          </p>
        </div>

        <div className="footer-icons">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a>

          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin />
          </a>

          <a href="mailto:yourmail@gmail.com">
            <FaEnvelope />
          </a>
        </div>
      </div>

      <div className="footer-line"></div>

      <div className="footer-bottom">
        <p>
          © 2026 Ashwani kumar chauhan. All rights reserved.
        </p>

        <span>Lucknow, Uttar Pradesh, India</span>
      </div>
    </footer>
    </>
  );
};

export default HeroSection;