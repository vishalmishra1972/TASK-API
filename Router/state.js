const express = require('express');
const router = express.Router();
const db = require('../db.service');

// Add State
router.post('/add', async (req, res) => {
  const state = req.body;

  if (!state.country_id || !state.name || !state.capital || !state.code) {
    return res.json({ ok: false, msg: "Country ID, Name, Capital, and Code are required" });
  }

  try {
    const [result] = await db.execute("CALL sp_state_add(?,?,?,?,?)", [
      state.country_id,
      state.name,
      state.capital,
      state.code,
      state.region || null
    ]);
    return res.json(result[0][0]);
  } catch (error) {
    console.error("Error Adding State:", error);
    return res.status(500).json({ ok: false, msg: "Internal Server Error" });
  }
});

// Get All States
router.post('/getall', async (req, res) => {
  try {
    const [result] = await db.execute("CALL sp_state_getall()");
    return res.json(result[0]);
  } catch (error) {
    console.error("Error Fetching States:", error);
    return res.status(500).json({ ok: false, msg: "Internal Server Error" });
  }
});

// Get States by Country ID
router.post('/getbycountry', async (req, res) => {
  const { country_id } = req.body;

  if (!country_id) {
    return res.json({ ok: false, msg: 'country_id is required' });
  }

  try {
    const [result] = await db.execute('CALL sp_country_by_state(?)', [country_id]);
    return res.json(result[0]);
  } catch (error) {
    console.error('Error fetching states by country:', error);
    return res.status(500).json({ ok: false, msg: 'Internal Server Error' });
  }
});

module.exports = router;
