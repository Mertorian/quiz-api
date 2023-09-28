const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const quizQuestions = require("./quizQuestions");

const app = express();

app.use(cors());

const localhost = "http://localhost:";
const port = 3000;
const highscores = [];

app.use(bodyParser.json());

app.get("/highscores", (req, res) => {
  res.json(highscores);
});

app.post("/highscores", (req, res) => {
  const { name, score } = req.body;

  if (!name || !score) {
    return res.status(400).json({ error: "Name and Score are required!" });
  }
  const newHighscore = { name, score };

  highscores.push(newHighscore);

  highscores.sort((a, b) => b.score - a.score);

  highscores = highscores.slice(0, 10);

  res.json(highscores);
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Quiz API",
    info: "type in /quiz/ to see questions",
  });
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

app.get("/quiz", (req, res) => {
  const noAnswer = quizQuestions.map(({ correctAnswer, ...rest }) => rest);
  randomArray(noAnswer);
  const selectedQuestions = noAnswer.slice(0, 5);
  res.json(selectedQuestions);
});

function randomArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i - 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

app.listen(port, () => {
  console.log(`server running @ ${localhost}${port}`);
});
