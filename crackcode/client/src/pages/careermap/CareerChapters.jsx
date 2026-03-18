import programmingFund from "../../assets/icons/careermap/softwareEngineer/SE_ch1.png"
import dataStructures from "../../assets/icons/careermap/softwareEngineer/SE_ch2.png"
import webSecurity from "../../assets/icons/careermap/softwareEngineer/SE_ch3.png"
import systemDesign from "../../assets/icons/careermap/softwareEngineer/SE_ch4.png"

import MLFund from "../../assets/icons/careermap/MLEngineer/ML_ch1.png"
import deepLearning from "../../assets/icons/careermap/MLEngineer/ML_ch2.png"
import mlops from "../../assets/icons/careermap/MLEngineer/ML_ch3.png"
import mlSystemDesign from "../../assets/icons/careermap/MLEngineer/ML_ch4.png"

import DataStat from "../../assets/icons/careermap/DataScientist/DS_ch1.png"
import MLforDS from "../../assets/icons/careermap/DataScientist/DS_ch2.png"
import databaseManagement from "../../assets/icons/careermap/DataScientist/DS_ch3.png"
import dataEngineering from "../../assets/icons/careermap/DataScientist/DS_ch4.png"


const CAREER_CHAPTERS_DATA = {

    //Software developer
    'Software-Engineer': [
        {
            id: 'oop',
            icon: programmingFund,
            title: 'Object Oriented Programming',
            description: 'Core programming concepts, design patterns, languages and frameworks.',
            categories:["General Programming","Languages and Frameworks"],
            questionCount: 15,
            
        },

        {
            id: 'dsa',
            icon: dataStructures,
            title: 'Data Structures & Algorithms',
            description: 'Arrays, linked lists, sorting, searching, Big O notation and dynamic programming.',
            categories:["Data Structures","Algorithms"],
            questionCount: 15,
          
        },


        {
            id: 'web-security',
            icon: webSecurity,
            title: 'Web Development & Security',
            description: 'Web fundamentals, HTTP, REST APIs and security best practices.',
            categories:["Web Development","Security"],
            questionCount: 15,
            
        },


        {
            id: 'devops-system-design',
            icon: systemDesign,
            title: 'Devops & System Design',
            description: 'Scalability, CI/CD pipelines, system architecture and DevOps practices.',
            categories:["System Design","DevOps"],
            questionCount:15,
            
        },
    ],

    //ML Engineer
    'ML-Engineer': [
        {
            id: 'ml-fundamentals',
            icon: MLFund,
            title: 'Machine Learning Fundamentals',
            description: 'Core ML concepts, supervised and unsupervised learning.',
            categories : ['Machine Learning'],
            questionCount: 15,
            
        },

        {
            id: 'deep-learning',
            icon: deepLearning,
            title: 'Deep Learning & Neural Networks',
            description: 'Neural networks, CNNs, RNNs, transformers and training techniques.',
            categories:['Deep Learning'],
            questionCount:15,
            
        },


        {
            id: 'mlops',
            icon: mlops,
            title: 'MLOps & Deployment',
            description: 'Model deployment, version control, data pipelines and DevOps for ML.',
            categories: ['Devops','Version Control','Data Engineering'],
            questionCount: 15,
            
        },


        {
            id: 'ml-system-design',
            icon: mlSystemDesign,
            title: 'ML System Design',
            description: 'Algorithm selection, scalable ML system architecture and design patterns.',
            categories: ['System Design','Algorithms'],
            questionCount: 15,
            
        },
    ],

    //Data Scientist
    'Data-Scientist': [
        {
            id: 'data-science-statistics',
            icon: DataStat,
            title: 'Data Science & Statistics',
            description: 'Statistical analysis, probability, hypothesis testing and data science fundamentals.',
            categories: ['Data Science'],
            questionCount: 15,
            
        },
    
        {
            id: 'ml-for-data-science',
            icon: MLforDS,
            title: 'Machine Learning for Data Science',
            description: 'Applying ML algorithms to data science problems and feature engineering.',
            categories: ['Machine Learning'],
            questionCount: 15,
            
        },


        {
            id: 'database-management',
            icon: databaseManagement,
            title: 'Database & Data Management',
            description: 'SQL, database design, data warehousing and full-stack data management.',
            categories: ['Database and SQL','Database Systems','Full-stack'],
            questionCount: 15,
            
        },


        {
            id: 'data-Engineering',
            icon: dataEngineering,
            title: 'Data Engineering & Infrastructure',
            description: 'Data pipelines, distributed systems, networking and low-level systems.',
            categories: ['Data Engineering', 'Distributed Systems', 'Back-end', 'Networking', 'Low-level Systems'],
            questionCount: 15,
            
        },
    ],

};

//Get chapters by career id
export const getChapterByCareerId = (careerId) => {
    return CAREER_CHAPTERS_DATA[careerId] || [];
};