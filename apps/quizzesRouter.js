import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const quizRouter = Router();
const collection = db.collection("quizzes");
const answerCollection = db.collection("answers");

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
    const quizId = new ObjectId(req.params.id);
    const newQuizData = { ...req.body };

    if (newQuizData.like) {
      await collection.updateOne({ _id: quizId }, { $set: newQuizData });
      return res.json({
        message: "Quiz's like has been change successfully",
      });
    } else {
      await collection.updateOne(
        { _id: quizId },
        { $set: newQuizData, modified_at: new Date() }
      );
      return res.json({
        message: "Quiz has been updated successfully",
      });
    }
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

quizRouter.delete("/:id", async (req, res) => {
  try {
    const quizId = new ObjectId(req.params.id);
    await collection.deleteOne({ _id: quizId });
    await answerCollection.deleteMany({ quiz_id: quizId });

    return res.json({
      message: "Quiz has been deleted successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

quizRouter.post("/:id/answer", async (req, res) => {
  try {
    const quizId = new ObjectId(req.params.id);
    const answerData = { quiz_id: quizId, ...req.body, created_at: new Date() };
    if (answerData.answer.length > 300) {
      return res.json({
        message: "Answer can not exceed 300 characters",
      });
    }
    await answerCollection.insertOne(answerData);
    return res.json({
      message: "Answer has been added successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

quizRouter.get("/:id/answer", async (req, res) => {
  try {
    const allAnswers = await answerCollection.find().toArray();
    return res.json({ data: allAnswers });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

quizRouter.put("/answer/:id", async (req, res) => {
  try {
    const newAnswerData = { ...req.body };
    const answerId = new ObjectId(req.params.id);
    await answerCollection.updateOne(
      { _id: answerId },
      { $set: newAnswerData }
    );
    return res.json({
      message: "Answer's like has been change",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});
export default quizRouter;
