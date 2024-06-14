const { Client } = require('pg');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => {
    console.log('Connected to database');
    const queryText = `
      CREATE TABLE IF NOT EXISTS activity_history (
        "user" VARCHAR(45),
        activity_type VARCHAR(45),
        input_text TEXT,
        output_text TEXT
      );

      CREATE TABLE IF NOT EXISTS user_info (
        id SERIAL PRIMARY KEY,
        name VARCHAR(45),
        email VARCHAR(45)
      );
    `;

    return client.query(queryText);
  })
  .then(() => {
    console.log('Tables created successfully');
  })
  .catch(err => {
    console.error('Error creating tables:', err);
  })
  .finally(() => {
    client.end();
  });
