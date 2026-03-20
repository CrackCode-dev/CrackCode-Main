import User from "../auth/User.model.js";
import Submission from "../learn/Submission.model.js";
import UserProgress from "../learn/UserProgress.model.js";
import UserQuestionProgress from "../progress/UserQuestionProgress.model.js";
import Question from "../learn/Question.model.js";
import mongoose from "mongoose";

export const getUserData = async (req, res) => {
  try {
    console.log(`📋 getUserData called for user:`, req.user?._id || req.userId);
    
    if (req.user) {
      console.log(`✅ Found req.user, completedQuestionIds:`, req.user.completedQuestionIds);
      return res.json({
        success: true,
        data: {
          // Basic Info
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          username: req.user.username,
          avatar: req.user.avatar,
          isAccountVerified: req.user.isAccountVerified,
          
          // Game Stats
          level: req.user.level || 0,
          xp: req.user.xp || 0,
          xpMax: 5000, // XP needed for next level
          tokens: req.user.tokens || 0,
          tokensMax: 2000, // Max tokens cap
          rank: req.user.rank || "Rookie",
          rankMax: 100,
          casesSolved: req.user.casesSolved || 0,
          currentStreak: req.user.currentStreak || 0,
          totalXP: req.user.totalXP || 0,
          achievements: Array.isArray(req.user.achievements) ? req.user.achievements : [],
          
          // Completed Questions (for learn page progress tracking)
          completedQuestionIds: req.user.completedQuestionIds || [],
        },
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      console.log(`❌ User not found:`, req.userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`✅ Found user in DB, completedQuestionIds:`, user.completedQuestionIds);

    return res.json({
      success: true,
      data: {
        // Basic Info
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        isAccountVerified: user.isAccountVerified,
        
        // Game Stats
        level: user.level || 0,
        xp: user.xp || 0,
        xpMax: 5000, // XP needed for next level
        tokens: user.tokens || 0,
        tokensMax: 2000, // Max tokens cap
        rank: user.rank || "Rookie",
        rankMax: 100,
        casesSolved: user.casesSolved || 0,
        currentStreak: user.currentStreak || 0,
        totalXP: user.totalXP || 0,
        achievements: Array.isArray(user.achievements) ? user.achievements : [],
        
        // Completed Questions (for learn page progress tracking)
        completedQuestionIds: user.completedQuestionIds || [],
      },
    });
  } catch (error) {
    console.error(`❌ Error in getUserData:`, error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProgressSummary = async (req, res) => {
  try {
    // If auth middleware populated req.user, use it; otherwise fetch by req.userId
    const user = req.user ? req.user : await User.findById(req.userId).select('casesSolved currentStreak achievements');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Ensure we have a full user document (some auth middleware supplies a partial `req.user`)
    let fullUser = user;
    if (!fullUser.completedQuestions) {
      fullUser = await User.findById(user._id).select('+completedQuestions completedQuestionIds casesSolved currentStreak achievements').lean();
    }

    // Difficulty distribution and language progress from UserQuestionProgress
    const userId = fullUser._id;

    const difficultyAgg = await UserQuestionProgress.aggregate([
      { $match: { userId: userId, solved: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    const languageAgg = await UserQuestionProgress.aggregate([
      { $match: { userId: userId, solved: true, language: { $ne: null } } },
      { $group: { _id: { $toLower: '$language' }, count: { $sum: 1 } } }
    ]);

    const totalSolved = difficultyAgg.reduce((s, r) => s + (r.count || 0), 0) || 0;

    const difficultyDist = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };
    difficultyAgg.forEach((r) => {
      if (r._id) difficultyDist[r._id] = r.count;
    });

    // Build language counts map and normalize common language keys
    const languageCounts = { Python: 0, JavaScript: 0, Java: 0, 'C++': 0 };
    languageAgg.forEach((r) => {
      const key = (r._id || '').toLowerCase();
      if (key.includes('py') || key === 'python') languageCounts.Python += r.count;
      else if (key.includes('js') || key === 'javascript') languageCounts.JavaScript += r.count;
      else if (key.includes('java') && key !== 'javascript') languageCounts.Java += r.count;
      else if (key.includes('cpp') || key === 'c++' || key === 'cpp') languageCounts['C++'] += r.count;
      else {
        // put unknown languages into JavaScript bucket as fallback
        languageCounts.JavaScript += r.count;
      }
    });

    // If there are no progress documents, fall back to user's completedQuestions
    if (totalSolved === 0 && Array.isArray(fullUser.completedQuestions) && fullUser.completedQuestions.length > 0) {
      // helper maps
      const idMap = {
        50: 'c',
        54: 'cpp',
        62: 'java',
        63: 'javascript',
        71: 'python'
      };
      const langNameMap = { py: 'Python', js: 'JavaScript', java: 'Java', cpp: 'C++' };
      const diffMap = { fundamentals: 'Easy', easy: 'Easy', intermediate: 'Medium', medium: 'Medium', hard: 'Hard' };

      for (const cq of fullUser.completedQuestions) {
        let qid = cq.questionId;
        let difficulty = null;
        let language = null;

        // language from completedQuestions may be stored as numeric languageId
        if (cq.language) {
          const langKey = idMap[cq.language] || null;
          if (langKey) {
            language = langNameMap[langKey] || (langKey === 'cpp' ? 'C++' : langKey.charAt(0).toUpperCase() + langKey.slice(1));
          }
        }

        // Try find in main Question collection by problemId
        try {
          let question = null;
          if (typeof qid === 'string') {
            question = await Question.findOne({ problemId: qid }).lean();
          }
          if (!question && typeof qid === 'string' && qid.match(/^[0-9a-f]{24}$/i)) {
            question = await Question.findById(qid).lean();
          }
          // If question found in main collection
          if (question) {
            difficulty = question.difficulty || difficulty;
            // try to extract language from question if available
            if (!language && question.language) language = question.language;
          } else if (typeof qid === 'string') {
            // Try learn collections pattern: {lang}_{diff}_{number}
            const parts = qid.split('_');
            if (parts.length >= 2) {
              const langKey = parts[0].toLowerCase();
              const diffKey = parts[1].toLowerCase();
              const langVal = langNameMap[langKey];
              const diffVal = diffMap[diffKey];
              if (langVal) language = langVal;
              if (diffVal) difficulty = diffVal;

              // attempt to confirm by searching the collection
              try {
                const collectionName = `learn${langVal?.replace(/\+\+/g, 'Plus')}${diffVal ? diffVal : ''}Q`;
                if (collectionName) {
                  const found = await mongoose.connection.db.collection(collectionName).findOne({ problemId: qid });
                  if (found) {
                    difficulty = found.difficulty || difficulty;
                    if (!language && found.language) language = found.language;
                  }
                }
              } catch (e) {
                // ignore collection lookup errors
              }
            }
          }

          // Normalize and increment counts
          if (difficulty) {
            if (['Easy', 'easy'].includes(difficulty)) difficultyDist.Easy += 1;
            else if (['Medium', 'medium', 'Intermediate', 'intermediate'].includes(difficulty)) difficultyDist.Medium += 1;
            else if (['Hard', 'hard'].includes(difficulty)) difficultyDist.Hard += 1;
          }
          if (language) {
            const key = (language || '').toLowerCase();
            if (key.includes('py')) languageCounts.Python += 1;
            else if (key.includes('js') || key.includes('javascript')) languageCounts.JavaScript += 1;
            else if (key.includes('java') && !key.includes('javascript')) languageCounts.Java += 1;
            else if (key.includes('cpp') || key.includes('c++')) languageCounts['C++'] += 1;
            else languageCounts.JavaScript += 1; // fallback
          }
        } catch (err) {
          console.warn('Error resolving completedQuestion', qid, err.message);
        }
      }
    }

    return res.json({
      success: true,
      data: {
        casesSolved: user.casesSolved || 0,
        currentStreak: user.currentStreak || 0,
        badgesEarned: Array.isArray(user.achievements) ? user.achievements.length : 0,
        difficultyDistribution: difficultyDist,
        languageCounts: languageCounts,
        totalSolved,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Return a date-keyed activity map for the user (uses Submissions + completed progress)
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.userId;

    console.log(`\n📅 getUserActivity called for userId: ${userId}`);

    // Support either a days window (days) OR explicit startDate/endDate (ISO strings)
    const days = req.query.days ? parseInt(req.query.days, 10) : null;
    const startDateQuery = req.query.startDate;
    const endDateQuery = req.query.endDate;

    let start;
    let end = new Date();

    if (startDateQuery) {
      start = new Date(startDateQuery);
      if (endDateQuery) end = new Date(endDateQuery);
      // normalize times
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (days) {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (days - 1));
    } else {
      // default to last 84 days
      start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - 83);
    }

    console.log(`   Query range: ${start.toISOString()} to ${end.toISOString()}`);
    console.log(`   Today's date string: ${new Date().toISOString().split('T')[0]}`);

    // Gather submissions within range
    const submissions = await Submission.find({ userId, createdAt: { $gte: start, $lte: end } }).select('createdAt');
    console.log(`   📦 Submissions found: ${submissions.length}`);
    if (submissions.length > 0) {
      console.log(`      First submission: ${submissions[0].createdAt.toISOString().split('T')[0]}`);
    }

    // Gather completed progress entries within range (separate collection)
    const completed = await UserProgress.find({ userId, completedAt: { $gte: start, $lte: end } }).select('completedAt');
    console.log(`   📊 UserProgress entries found: ${completed.length}`);

    // Also include embedded completedQuestions from the User document (fallback)
    let embeddedCompleted = [];
    if (req.user && Array.isArray(req.user.completedQuestions) && req.user.completedQuestions.length > 0) {
      console.log(`   ✅ req.user has completedQuestions: ${req.user.completedQuestions.length} items`);
      embeddedCompleted = req.user.completedQuestions
        .map((cq) => cq.completedAt)
        .filter(Boolean)
        .map((d) => ({ completedAt: new Date(d) }));
      console.log(`      After extraction: ${embeddedCompleted.length} valid dates`);
      if (embeddedCompleted.length > 0) {
        console.log(`      First embedded date: ${embeddedCompleted[0].completedAt.toISOString().split('T')[0]}`);
        console.log(`      Last embedded date: ${embeddedCompleted[embeddedCompleted.length - 1].completedAt.toISOString().split('T')[0]}`);
      }
    } else {
      console.log(`   ⚠️ req.user missing or empty, fetching from DB...`);
      // If middleware didn't populate full user with embedded array, try to fetch minimal user document
      const maybeUser = await User.findById(userId).select('completedQuestions').lean();
      if (maybeUser && Array.isArray(maybeUser.completedQuestions) && maybeUser.completedQuestions.length > 0) {
        console.log(`      ✅ Found from DB: ${maybeUser.completedQuestions.length} items`);
        embeddedCompleted = maybeUser.completedQuestions
          .map((cq) => cq.completedAt)
          .filter(Boolean)
          .map((d) => ({ completedAt: new Date(d) }));
        console.log(`      After extraction: ${embeddedCompleted.length} valid dates`);
        if (embeddedCompleted.length > 0) {
          console.log(`      First embedded date: ${embeddedCompleted[0].completedAt.toISOString().split('T')[0]}`);
        }
      } else {
        console.log(`      ❌ No completedQuestions found in DB`);
      }
    }

    const activity = {};

    const addDate = (d) => {
      const dateStr = d.toISOString().split('T')[0];
      activity[dateStr] = (activity[dateStr] || 0) + 1;
    };

    submissions.forEach((s) => addDate(s.createdAt));
    completed.forEach((c) => addDate(c.completedAt));
    // include embedded completed questions timestamps
    embeddedCompleted.forEach((c) => addDate(c.completedAt));

    console.log(`   📋 Final activity map (total unique days): ${Object.keys(activity).length}`);
    console.log(`   Activity: ${JSON.stringify(activity, null, 2)}`);
    console.log(`   ✅ Returning activity with ${Object.keys(activity).length} days\n`);

    return res.json({ success: true, data: { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0], activity } });
  } catch (error) {
    console.error(`   ❌ Error in getUserActivity: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Debug: Return raw UserQuestionProgress documents for the logged-in user
export const getUserProgressRaw = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    if (!userId) return res.status(400).json({ success: false, message: 'Missing user id' });

    const rows = await UserQuestionProgress.find({ userId }).sort({ firstSolvedAt: -1 }).lean();
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching raw progress:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
