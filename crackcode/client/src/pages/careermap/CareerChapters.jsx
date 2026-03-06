
import programmingFund from "../../assets/icons/careermap/softwareDeveloper/SD_ch1.png"
import dataStructures from "../../assets/icons/careermap/softwareDeveloper/SD_ch2.png"
import databases from "../../assets/icons/careermap/softwareDeveloper/SD_ch3.png"
import systemDesign from "../../assets/icons/careermap/softwareDeveloper/SD_ch4.png"


const CAREER_CHAPTERS_DATA = {

    //Software developer
    'Software-Developer': [
        {
            id: 'programming-fundamentals',
            icon: programmingFund,
            title: 'Programming Fundamentals',
            description: 'Core programming concepts, design patterns, SOLID principles and clean code.',
            questionCount: 9,
            completed: 9,
            total: 9,
            isUnlocked: true,
            Route: '',
        },

        {
            id: 'data-structures-algorithms',
            icon: dataStructures,
            title: 'Data Structures & Algorithms',
            description: 'Arrays, linked lists, sorting, searching, Big O notation and dynamic programming.',
            questionCount: 21,
            completed: 5,
            total: 21,
            isUnlocked: true,
            Route: '',
        },


        {
            id: 'languages-databases',
            icon: databases,
            title: 'Languages & Databases',
            description: 'Programming languages, frameworks,joins, normalization and ORMs.',
            questionCount: 20,
            completed: 0,
            total: 20,
            isUnlocked: false,
            Route: '',
        },


        {
            id: 'testing-system-design',
            icon: systemDesign,
            title: 'Testing & System Design',
            description: 'Unit testing, load testing, debugging, scalability and system architecture.',
            questionCount: 34,
            completed: 0,
            total: 34,
            isUnlocked: false,
            Route: '',
        },
    ],

    //ML Engineer
    'ML-Engineer': [
        {
            id: '',
            icon: '',
            title: '',
            description: '',
            questionCount: '',
            completed: '',
            total: '',
            isUnlocked: '',
            Route: '',
        },

        {
            id: '',
            icon: '',
            title: '',
            description: '',
            questionCount: '',
            completed: '',
            total: '',
            isUnlocked: '',
            Route: '',
        },


        {
            id: '',
            icon: '',
            title: '',
            description: '',
            questionCount: '',
            completed: '',
            total: '',
            isUnlocked: '',
            Route: '',
        },


        {
            id: '',
            icon: '',
            title: '',
            description: '',
            questionCount: '',
            completed: '',
            total: '',
            isUnlocked: '',
            Route: '',
        },
    ],

    //Data Scientist
    'Data-Scientist': [
        {
            id: '',
            icon: '',
            title: '',
            description: '',
            questionCount: '',
            completed: '',
            total: '',
            isUnlocked: '',
            Route: '',
        },

        {
            id: '',
            icon: '',
            title: '',
            description: '',
            questionCount: '',
            completed: '',
            total: '',
            isUnlocked: '',
            Route: '',
        },


        {
            id: '',
            icon: '',
            title: '',
            description: '',
            questionCount: '',
            completed: '',
            total: '',
            isUnlocked: '',
            Route: '',
        },


        {
            id: '',
            icon: '',
            title: '',
            description: '',
            questionCount: '',
            completed: '',
            total: '',
            isUnlocked: '',
            Route: '',
        },
    ],

};

//Get chapters by career id
export const getChapterByCareerId = (careerId) => {
    return CAREER_CHAPTERS_DATA[careerId] || [];
};