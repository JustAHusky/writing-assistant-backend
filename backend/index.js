const { exec } = require('child_process');
const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database");
const cors = require("cors");
const app = express();
const Together = require('together-ai');
require('dotenv').config();

const PORT = process.env.PORT || 3080;

app.use(cors());
app.use(bodyParser.json());
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

app.post("/api/generate-answer", async function (req, res) {
  const { question } = req.body;

  try {
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: `Check the input text for plagiarism, analyze the input text and compare it with other documents on the internet, then provide a percentage of how much of the text matches other documents, as well as links to those documents, make the links be clickable also: ${question}` }],
      model: "meta-llama/Llama-3-8b-chat-hf",
    });

    const generatedAnswer = response.choices[0].message.content;
    res.status(200).json({ answer: generatedAnswer });
  } catch (error) {
    console.error('Error generating answer:', error);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

app.post("/api/user", function (req, res) {
  const { name, email } = req.body;

  const checkSql = 'SELECT COUNT(*) AS count FROM USER_INFO WHERE name = ? AND email = ?';
  connection.query(checkSql, [name, email], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking user information:', checkErr);
      res.status(500).json({ error: 'Failed to check user information' });
      return;
    }

    const { count } = checkResult[0];
    if (count > 0) {
      console.log('User information already exists in the database');
      res.status(200).json({ message: 'User information already exists in the database' });
      return;
    }

    const insertSql = 'INSERT INTO USER_INFO (name, email) VALUES (?, ?)';
    connection.query(insertSql, [name, email], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error inserting user information:', insertErr);
        res.status(500).json({ error: 'Failed to save user information' });
        return;
      }
      console.log('User information saved successfully');
      res.status(200).json({ message: 'User information saved successfully' });
    });
  });
});

app.post("/api/activity", function (req, res) {
  const { question, answer, user, activityType } = req.body;

  const sql = 'INSERT INTO ACTIVITY_HISTORY (user, activity_type, input_text, output_text) VALUES (?, ?, ?, ?)';
  connection.query(sql, [user, activityType, question, answer], (err, result) => {
    if (err) {
      console.error('Error inserting activity history:', err);
      res.status(500).json({ error: 'Failed to save activity history' });
      return;
    }
    console.log('Activity history saved successfully');
    res.status(200).json({ message: 'Activity history saved successfully' });
  });
});

app.get("/api/activity/:name", function (req, res) {
  const { name } = req.params;

  const sql = 'SELECT * FROM ACTIVITY_HISTORY WHERE user = ?';
  connection.query(sql, [name], (err, results) => {
    if (err) {
      console.error('Error fetching activity history:', err);
      res.status(500).json({ error: 'Failed to fetch activity history' });
      return;
    }
    res.status(200).json(results);
  });
});

app.delete("/api/activity/:name", function (req, res) {
  const { name } = req.params;

  const sql = 'DELETE FROM ACTIVITY_HISTORY WHERE user = ?';
  connection.query(sql, [name], (err, result) => {
    if (err) {
      console.error('Error deleting activity history:', err);
      res.status(500).json({ error: 'Failed to delete activity history' });
      return;
    }
    console.log('Activity history deleted successfully');
    res.status(200).json({ message: 'Activity history deleted successfully' });
  });
});

const killPort = (port) => {
  return new Promise((resolve, reject) => {
    exec(`npx kill-port ${port}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};

const startServer = () => {
  app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
  });
};

killPort(3080)
  .then(startServer)
  .catch((err) => {
    console.error('Failed to kill process on port 3080', err);
  });