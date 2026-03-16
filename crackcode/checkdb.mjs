import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'server/.env') });
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
const q = await db.collection('questions').findOne({ id: 'py_fundamentals_001' });
if (q) {
  const variant = q.variants?.find(v => v.language === 'python') || q.variants?.[0];
  const tcs = variant?.testCases || q.testCases || [];
  console.log('Title:', q.title || q.id);
  console.log('Test Cases:', JSON.stringify(tcs.slice(0,3), null, 2));
} else {
  // List all question ids
  const all = await db.collection('questions').find({}, {projection:{id:1,title:1}}).limit(20).toArray();
  console.log('All questions:', JSON.stringify(all,null,2));
}
process.exit(0);
