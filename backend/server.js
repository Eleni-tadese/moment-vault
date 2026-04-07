import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/db.js";
import testRoutes from "./routes/test.js";
import memoriesRouter from "./routes/memories.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", testRoutes);
app.use("/api/memories", memoriesRouter);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Database error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
