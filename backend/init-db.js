// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

// const createTable = async () => {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS links (
//         id SERIAL PRIMARY KEY,
//         code VARCHAR(255) UNIQUE NOT NULL,
//         target_url VARCHAR(2000) NOT NULL,
//         short_url VARCHAR(255) NOT NULL,
//         clicks INTEGER DEFAULT 0,
//         last_clcked_at TIMESTAMP,
//         created_at TIMESTAMP DEFAULT NOW()
//       )
//     `);
//     console.log('Links table created successfully');
//     process.exit(0);
//   } catch (err) {
//     console.error('Error creating table:', err);
//     process.exit(1);
//   }
// };

// createTable();