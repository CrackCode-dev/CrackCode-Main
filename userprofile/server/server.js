import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {inngest, functions} from './inngest/index.js';
import {serve} from 'inngest/express';
import profileRoutes from "./routes/profileRoutes.js";
import path from "path";

const app = express();

await connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req,res) => res.send('Server is running.'));
app.use('/api/inngest', serve({ client: inngest, functions }))

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.use("/api/profile", profileRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
