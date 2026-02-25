//contains all the career information
import softwareDeveloper from "../../assets/icons/careermap/softwareDeveloper.png";
import mobileAppDeveloper from "../../assets/icons/careermap/mobileAppDeveloper.png";
import webDeveloper from "../../assets/icons/careermap/webDeveloper.png";
import backendDeveloper from "../../assets/icons/careermap/backendDeveloper.png";
import gameDeveloper from "../../assets/icons/careermap/gameDeveloper.png";
import dataAnalyst from "../../assets/icons/careermap/dataAnalyst.png";


export const careers = [
    {
        id: "Software-Developer",
        title: "Software Developer",
        level: "General",
        gradient: "from-[#1C29E4] to-[#0BADED]",
        languages: "Python/Java/ C++/JavaScript",
        focus: ["Core programming concepts", "Data structures and algorithms", "Databases", "System Design and Testing",],
        difficulty: "easy",
        locked: false,
        category: "software",
        icon : softwareDeveloper,
    },

    {
        id: "ML-Engineer",
        title: "ML Engineer",
        level: "",
        gradient: "from-[#FF0004] to-[#DE4E00]",
        languages: "",
        focus: ["", "", ""],
        difficulty: "hard",
        locked: false,
        category: "",
        icon :mobileAppDeveloper,
    },

    {
        id: "Data-Scientist",
        title: "Data Scientist",
        level: "",
        gradient: "from-[#FFA807] to-[#FFEA00]",
        languages: "",
        focus: ["", "", "", "", "",],
        difficulty: "medium",
        locked: false,
        category: "",
        icon : dataAnalyst,
    },

    {
        id: "backend-developer",
        title: "Backend Developer",
        level: "Beginner Level",
        gradient: "from-[#6200A9] to-[#A501C2]",
        languages: "Python / Java / C++ / JavaScript \n\t\t\t\t\t(Node.js fundamentals)",
        focus: ["Understanding server-side task flow", "Handling input/output", "Simple CRUD logic", "Basic error handling"],
        difficulty: "medium",
        locked: true,
        category: "backend",
        icon : backendDeveloper,
    },

    {
        id: "game-developer",
        title: "Game Developer",
        level: "Entry Level",
        gradient: "from-[#08C908] to-[#00FF6E]",
        languages: "C/C++",
        focus: ["Memory Basics", "Performance thinking", "C/C++ syntax", "Basic loops/ physics logic"],
        difficulty: "hard",
        locked: true,
        category: "gaming",
        icon : gameDeveloper,

    },

     {
        id: "web-developer",
        title: "Web Developer",
        level: "Frontend + Backend Basics",
        gradient: "from-[#FFA807] to-[#FFEA00]",
        languages: "JavaScript (Primary)",
        focus: ["JS Fundamentals", "DOM Basics", "Functions, Events", "JSON", "Basic API concepts",],
        difficulty: "medium",
        locked: true,
        category: "web",
        icon : webDeveloper,
    },
];


//Get career by id
export const getCareerById = (id) => {
    return careers.find((career) => career.id === id);
};

//Get careers by difficulty
export const getCareersByDifficulty = (difficulty) => {
  return careers.filter((career) => career.difficulty === difficulty);
};

// Get careers by category
export const getCareersByCategory = (category) => {
  return careers.filter((career) => career.category === category);
};

// Get unlocked careers
export const getUnlockedCareers = () => {
  return careers.filter((career) => !career.locked);
};

// Get locked careers
export const getLockedCareers = () => {
  return careers.filter((career) => career.locked);
};

// Get difficulty label
export const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: "BEGINNER",
    medium: "INTERMEDIATE",
    hard: "ADVANCED",
  };
  return labels[difficulty] || "BEGINNER";
};