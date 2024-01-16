import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const quizRouter = Router();
const collection = db.collection("quizzes");

quizRouter.post("/", async (req, res) => {
  try {
    const quizData = { ...req.body, created_at: new Date() };
    await collection.insertOne(quizData);
    return res.json({
      message: "Quiz has been added successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

quizRouter.get("/", async (req, res) => {
  try {
    const title = req.query.keywords;
    const category = req.query.category;
    const query = {};
    if (title) {
      query.title = new RegExp(title, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }
    const allQuizzes = await collection.find(query).limit(10).toArray();
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
    if (newQuizData.like) {
      return res.json({
        message: "Quiz's like has been updated successfully",
      });
    }
    return res.json({
      message: "Quiz has been updated successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

quizRouter.delete("/:id", async (req, res) => {
  try {
    const quizId = new ObjectId(req.params.id);
    await collection.deleteOne({ _id: quizId });

    return res.json({
      message: "Quiz has been deleted successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});
export default quizRouter;
