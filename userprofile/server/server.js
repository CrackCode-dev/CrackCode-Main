import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";

import profileRoutes from "./routes/profileRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";

const app = express();

/* ===============================
   Database Connection
================================ */
await connectDB();

/* ===============================
   Middleware
================================ */
app.use(express.json());
app.use(cors());

/* ===============================
   Routes
================================ */
app.get("/", (req, res) => res.send("Server is running."));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/profile", profileRoutes);

app.use("/api/statistics", statisticsRoutes);

/* ===============================
   Static Files
================================ */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ===============================
   Server Start
================================ */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
