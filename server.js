const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();

const port = 3000;

const quizQuestions = [
  {
    id: "01c565a7-c600-46f5-9041-3c64915d933e",
    question: "What's the Lords name from Shrek?",
    answers: ["Ralf", "Frederick", "Farquaad", "Fransquad"],
    correctAnswer: 2,
  },
  {
    id: "f363c671-e1fc-4f70-875d-c07fa4bb5784",
    question: "What kind of fruit does Shrek compare himself to?",
    answers: ["apple", "onion", "orange", "pencil"],
    correctAnswer: 1,
  },
  {
    id: "634d51b8-5f27-4ce0-944a-dd6216065231",
    question: "what Animal is donkeys wife?",
    answers: ["donkey", "cat", "dragon", "lizard"],
    correctAnswer: 2,
  },
];

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Quiz API" });
});

app.get("/quiz", (req, res) => {
  const noAnswer = quizQuestions.map(({ correctAnswer, ...rest }) => rest);
  res.json({ quizQuestions: noAnswer });
});

app.get("/quiz/:quizId", (req, res) => {
  const quizId = req.params.quizId;
  const question = quizQuestions.find((q) => q.id === quizId);

  if (!question) {
    res.status(404).json({ error: "404 Question not found" });
  } else {
    res.json({ question });
  }
});

app.delete("/quiz/:quizId", (req, res) => {
  const quizId = req.params.quizId;
  const toDelete = quizQuestions.findIndex((q) => q.id === quizId);

  if (toDelete === -1) {
    res.status(404).json({ error: `question with ID:${quizId} not found` });
  } else {
    const deletedQuestion = quizQuestions.splice(toDelete, 1)[0];
    res.json({
      message: `Question with ID:${quizId} was deleted, see for yourself:`,
      deletedQuestion,
    });
  }
});

app.post("/quiz", (req, res) => {
  console.log(req.body);
  const newId = uuidv4();
  const { question, answers, correctAnswer } = req.body;
  if (!question || !answers || !correctAnswer) {
    res.status(400).json({
      error: "Bad Request. please provide question, answers and correctAnswer.",
    });
  } else {
    const newQuestion = {
      id: newId,
      question,
      answers,
      correctAnswer,
    };
    quizQuestions.push(newQuestion);
    res.json({ message: "create new Question", newQuestion });
  }
});

app.listen(port, () => {
  console.log(`server running @ ${port}`);
});
