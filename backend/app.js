const express = require('express');
const { Pool } = require('pg');
const cors = require("cors");

const router = require('./routes/linkCrud');


require('dotenv').config(); // loads .env into process.env

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json({ limit: "200kb" }));



app.use('/api', router);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// simple test at startup
(async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected:', res.rows[0].now);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
})();

// Basic routes
app.get('/', (req, res) => {
    res.send('Hello — app is running.');
});

app.get('/db-time', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT NOW() AS now');
        res.json({ now: rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB query failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});