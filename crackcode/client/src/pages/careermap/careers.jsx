//contains all the career information
import softwareDeveloper from "../../assets/icons/softwareDeveloper.png";
import mobileAppDeveloper from "../../assets/icons/mobileAppDeveloper.png";
import webDeveloper from "../../assets/icons/webDeveloper.png";
import backendDeveloper from "../../assets/icons/backendDeveloper.png";
import gameDeveloper from "../../assets/icons/gameDeveloper.png";
import dataAnalyst from "../../assets/icons/dataAnalyst.png";


export const careers = [
    {
        id: "Software-developer",
        title: "Software Developer",
        level: "General",
        gradient: "from-[#1C29E4] to-[#0BADED]",
        languages: "Python/Java/ C++/JavaScript",
        focus: ["Variables, loops, conditionals", "Data structures", "Basic algorithms", "Debugging logic",],
        difficulty: "easy",
        locked: false,
        category: "software",
        icon : softwareDeveloper,
    },

    {
        id: "mobile-app-developer",
        title: "Mobile App Developer",
        level: "Fundamentals",
        gradient: "from-[#FF0004] to-[#DE4E00]",
        languages: "Java (Android Basics)",
        focus: ["Java OOP fundamentals", "Activity lifecycle concepts (basic)", "Logic building"],
        difficulty: "easy",
        locked: true,
        category: "mobile",
        icon :mobileAppDeveloper,
    },

    {
        id: "web-developer",
        title: "Web Developer",
        level: "Frontend + Backend Basics",
        gradient: "from-[#FFA807] to-[#FFEA00]",
        languages: "JavaScript (Primary)",
        focus: ["JS Fundamentals", "DOM Basics", "Functions, Events", "JSON", "Basic API concepts",],
        difficulty: "medium",
        locked: false,
        category: "web",
        icon : webDeveloper,
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
        locked: false,
        category: "gaming",
        icon : gameDeveloper,

    },

    {
        id: "data-analyst",
        title: "Data Analyst",
        level: "Beginner Level",
        gradient: "from-[#502B00] to-[#8A5A00]",
        languages: "Python",
        focus: ["Python Basics", "Working with lists, dictionaries", "Simple data manipulation", "Logical thinking"],
        difficulty: "hard",
        locked: true,
        category: "data",
        icon : dataAnalyst,
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