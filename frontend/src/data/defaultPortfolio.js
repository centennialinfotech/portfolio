export const defaultPortfolio = {
  headerSection: {
    logo: "Portfolio",
    logoImage: "",
  },

  heroSection: {
    greeting: "Hi, I'm",
    firstName: "John",
    lastName: "Michael",
    role: "MERN Stack Developer",
    description: "Passionate about creating responsive applications.",
    githubUsername: "yourusername",
    linkedinUsername: "yourusername",
    showGithub: true,
    showLinkedin: true,
    image: "/profile.png",
    cv: "",
  },

  aboutSection: {
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
  },

  skillsSection: {
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
  },

  projectsSection: {
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
  },

  contactSection: {
    title: "Get In Touch",
    leftTitle: "Contact Information",
    rightTitle: "Send me a Message",
    email: "johnmichael@example.com",
    phone: "+1 (212) 555-1234",
    location: "123 Main Street, Apt 4B, Los Angeles, CA 90001, USA",
    opportunityTitle: "Open for Opportunities",
    opportunityDescription:
      "I'm actively looking for entry-level MERN Stack Developer roles and internship opportunities. If you have an exciting project or role, feel free to connect with me!",
  },

  footerSection: {
    name: "John Michael",
    description: "Building digital experiences with precision and passion.",
    githubUsername: "yourusername",
    linkedinUsername: "yourusername",
    email: "yourmail@gmail.com",
    showGithub: true,
    showLinkedin: true,
    showEmail: true,
    copyright: "© 2026 John Michael. All rights reserved.",
    location: "123 Main Street, Apt 4B, Los Angeles, CA 90001, USA",
  },

  updatedAt: Date.now(),
};
