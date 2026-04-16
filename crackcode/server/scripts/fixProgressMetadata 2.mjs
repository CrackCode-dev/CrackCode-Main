import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

import UserQuestionProgress from '../src/modules/progress/UserQuestionProgress.model.js';
import Question from '../src/modules/learn/Question.model.js';

const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI || 'mongodb://localhost:27017/crackcode';

async function main() {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: node fixProgressMetadata.mjs <userId>');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const userObjId = mongoose.Types.ObjectId(userId);

  console.log('Connected to MongoDB:', MONGO_URI);
  console.log('Scanning UserQuestionProgress for user:', userId);

  const docs = await UserQuestionProgress.find({
    userId: userObjId,
    $or: [
      { difficulty: { $in: [null, ''] } },
      { language: { $in: [null, ''] } },
    ],
  });

  console.log(`Found ${docs.length} progress docs missing difficulty or language`);

  let updated = 0;
  for (const doc of docs) {
    let question = null;
    try {
      const qId = doc.questionId;
      if (qId && typeof qId === 'string' && /^[0-9a-fA-F]{24}$/.test(qId)) {
        question = await Question.findById(qId).lean();
      } else {
        question = await Question.findOne({ problemId: qId }).lean();
      }
    } catch (err) {
      // ignore
    }

    if (!question) {
      console.log('  • Question not found for progress:', doc._id.toString(), 'questionId:', doc.questionId);
      continue;
    }

    const set = {};
    if (!doc.difficulty && question.difficulty) set.difficulty = question.difficulty;
    if (!doc.language && (question.language || question.languageName)) set.language = question.language || question.languageName;

    if (Object.keys(set).length === 0) {
      console.log('  • No update available for progress:', doc._id.toString());
      continue;
    }

    await UserQuestionProgress.updateOne({ _id: doc._id }, { $set: set });
    console.log('  • Updated progress', doc._id.toString(), 'set:', set);
    updated += 1;
  }

  console.log(`Completed. Documents updated: ${updated}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
