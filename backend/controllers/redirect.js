const { Pool } = require("pg");


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
// Redirect route
const redirectRouter = async (req, res) => {
    try {
        const { code } = req.params;
        console.log(req.params);
        const result = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }
        const link = result.rows[0];
        // Update click stats
        await pool.query(
            'UPDATE links SET clicks = clicks + 1, last_clcked_at = NOW() WHERE code = $1',
            [code]
        );
        res.redirect(302,link.target_url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { redirectRouter };
