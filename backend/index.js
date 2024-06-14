const { exec } = require('child_process');
const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./database");
const cors = require("cors");
const Together = require('together-ai');
require('dotenv').config();

const PORT = process.env.PORT || 3080;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

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

app.post("/api/user", async function (req, res) {
  const { name, email } = req.body;

  try {
    const checkSql = 'SELECT COUNT(*) AS count FROM user_info WHERE name = $1 AND email = $2';
    const checkResult = await pool.query(checkSql, [name, email]);

    const { count } = checkResult.rows[0];
    if (count > 0) {
      console.log('User information already exists in the database');
      res.status(200).json({ message: 'User information already exists in the database' });
      return;
    }

    const insertSql = 'INSERT INTO user_info (name, email) VALUES ($1, $2)';
    await pool.query(insertSql, [name, email]);
    console.log('User information saved successfully');
    res.status(200).json({ message: 'User information saved successfully' });
  } catch (err) {
    console.error('Error inserting user information:', err);
    res.status(500).json({ error: 'Failed to save user information' });
  }
});

app.post("/api/activity", async function (req, res) {
  const { question, answer, user, activityType } = req.body;

  try {
    const sql = 'INSERT INTO activity_history (user, activity_type, input_text, output_text) VALUES ($1, $2, $3, $4)';
    await pool.query(sql, [user, activityType, question, answer]);
    console.log('Activity history saved successfully');
    res.status(200).json({ message: 'Activity history saved successfully' });
  } catch (err) {
    console.error('Error inserting activity history:', err);
    res.status(500).json({ error: 'Failed to save activity history' });
  }
});

app.get("/api/activity/:name", async function (req, res) {
  const { name } = req.params;

  try {
    const sql = 'SELECT * FROM activity_history WHERE user = $1';
    const results = await pool.query(sql, [name]);
    res.status(200).json(results.rows);
  } catch (err) {
    console.error('Error fetching activity history:', err);
    res.status(500).json({ error: 'Failed to fetch activity history' });
  }
});

app.delete("/api/activity/:name", async function (req, res) {
  const { name } = req.params;

  try {
    const sql = 'DELETE FROM activity_history WHERE user = $1';
    await pool.query(sql, [name]);
    console.log('Activity history deleted successfully');
    res.status(200).json({ message: 'Activity history deleted successfully' });
  } catch (err) {
    console.error('Error deleting activity history:', err);
    res.status(500).json({ error: 'Failed to delete activity history' });
  }
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

module.exports = app;
