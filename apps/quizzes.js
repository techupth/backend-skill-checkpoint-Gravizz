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

quizRouter.get("/", async (req, res) => {
  try {
    const allQuizzes = await collection.find().toArray();
    return res.json({ data: allQuizzes });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

quizRouter.get("/:id", async (req, res) => {
  try {
    const quizId = new ObjectId(req.params.id);
    const quizData = await collection.findOne(quizId);
    return res.json({ data: quizData });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

quizRouter.put("/:id", async (req, res) => {
  try {
    const newQuizData = { ...req.body, modified_at: new Date() };
    const quizId = new ObjectId(req.params.id);

    await collection.updateOne({ _id: quizId }, { $set: newQuizData });
    return res.json({
      message: "Quiz has been updated successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});
export default quizRouter;
