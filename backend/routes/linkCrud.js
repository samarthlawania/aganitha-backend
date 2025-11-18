const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const {customAlphabet} = require("nanoid");
const {randomLength} = require("../utils/randomLength");

const codeRegex = /^[A-Za-z0-9]{6,8}$/;


require('dotenv').config(); // loads .env into process.env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Create a new link
router.post("/links", async (req, res) => {
  const { url } = req.body;
  let { code } = req.body;
  console.log(req.body);
    try {
        if(!code){
            const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", randomLength());
            code = nanoid();
        }
        else{
            const existing = await pool.query("SELECT * FROM links WHERE code = $1", [code]);
            if(existing.rows.length > 0){
                return res.status(409).json({ error: "Code already exists" });
            }
             if (code.length < 6 || code.length > 8) {
               return res
                 .status(400)
                 .json({ error: "Code is can be from length 6 to 8" });
             }
            if(!codeRegex.test(code)){  
                return res.status(400).json({ error: "Invalid code format" });
            }
           
        }
        if(!url){
            return res.status(400).json({ error: "URL is required" });
        }
        if(!url.startsWith("http://") && !url.startsWith("https://")){
            return res.status(400).json({ error: "Invalid URL format" });
        }
        if(url.length > 2000){
            return res.status(400).json({ error: "URL is too long" });
        }
        const short_url = `${process.env.BASE_URL}/${code}`;

    const result = await pool.query(
      "INSERT INTO links (short_url, code, target_url) VALUES ($1, $2, $3) RETURNING *",
      [short_url, code, url]
    );
    res.status(201).json({message: "Link created", link: result.rows[0]});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all links
router.get("/links", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM links");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get a single link by ID
router.get("/links/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM links WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
// Update a link by ID
router.put("/links/:id", async (req, res) => {
  const { id } = req.params;
    const { url, description } = req.body;
    try {
    const result = await pool.query(
      "UPDATE links SET url = $1, description = $2 WHERE id = $3 RETURNING *",
      [url, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a link by ID  

router.delete("/links/:id", async (req, res) => {
  const { id } = req.params;
    try {
    const result = await pool.query("DELETE FROM links WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json({ message: "Link deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;