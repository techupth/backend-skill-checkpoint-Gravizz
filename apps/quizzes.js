import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const quizRouter = Router();
const collection = db.collection("quizzes");

quizRouter.post("/", async (req, res) => {
  try {
    const quizData = { ...req.body, created_at: new Date() };
    const newQuizData = await collection.insertOne(quizData);
    return res.json({
      message: "Quiz has been added successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});
