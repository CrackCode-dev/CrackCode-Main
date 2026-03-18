const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Attach JWT token to requests if available
const authHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const toBackendCareerId = (frontendId) => {

    // Convert frontend career ID to backend format
    const map = {
        "Software-Engineer": "SoftwareEngineer",
        "ML-Engineer": "MLEngineer",
        "Data-Scientist": "DataScientist",
    }

    return map[frontendId] || frontendId;
}

// Fetch questions for one category + difficulty
const fetchByCategory = async (career, difficulty, category) => {
    const res = await fetch(
        `${BASE_URL}/questions?career=${career}&difficulty=${difficulty}&category=${encodeURIComponent(category)}`,
        { credentials: 'include', headers: authHeader() }
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
};

// Fetch all 15 questions for a chapter (5 Easy + 5 Medium + 5 Hard)
export const fetchChapterQuestions = async (careerId, categories) => {
    const career = toBackendCareerId(careerId);
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const allQuestions = [];

    for (const difficulty of difficulties) {
        const results = await Promise.all(
            categories.map((category) => fetchByCategory(career, difficulty, category))
        );
        // Take ALL questions for this difficulty across all categories
        const flat = results.flat();
        allQuestions.push(...flat);
    }

    return allQuestions;
};

// Submit user's answer for a question
export const submitAnswer = async (careerId, questionId, answer) => {
    const career = toBackendCareerId(careerId);
    const res = await fetch(`${BASE_URL}/questions/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ career, questionId, answer }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data; // { correct: bool, correctAnswer: string | null }
};

// Get user's progress for a career
export const fetchProgress = async (careerId) => {
    const career = toBackendCareerId(careerId);
    const res = await fetch(`${BASE_URL}/progress?career=${career}`, {
        credentials: "include",
        headers: { ...authHeader() },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data; // { easyScore, mediumScore, hardScore, easyCompleted, mediumCompleted, hardCompleted }
};

//Send full chapter scores when user finishes a chapter
export const updateProgress = async (careerId, chapterId, easyScore, mediumScore, hardScore, passed) => {
    const career = toBackendCareerId(careerId);
    const res = await fetch(`${BASE_URL}/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        credentials: "include",
        body: JSON.stringify({ career, chapterId, easyScore, mediumScore, hardScore, passed }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
};