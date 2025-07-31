const express = require("express");
const router = express.Router();
const db = require("../db.service");

// Add District
router.post('/add', async (req, res) => {
  const dist = req.body;

  if (!dist.country_id || !dist.state_id || !dist.district_name || !dist.division) {
    return res.json({ ok: false, msg: "All fields are required" });
  }

  try {
    const [result] = await db.execute("CALL sp_district_add(?,?,?,?)", [
      dist.country_id,
      dist.state_id,
      dist.district_name,
      dist.division
    ]);
    return res.json(result[0][0]);
  } catch (error) {
    console.error("Error Adding District:", error);
    return res.status(500).json({ ok: false, msg: "Internal Server Error" });
  }
});

// Get All Districts
router.post('/getall', async (req, res) => {
  try {
    const [result] = await db.execute("CALL sp_district_getall()");
    return res.json(result[0]);
  } catch (error) {
    console.error("Error Fetching Districts:", error);
    return res.status(500).json({ ok: false, msg: "Internal Server Error" });
  }
});

// Get Districts by State ID
router.post('/getbystate', async (req, res) => {
  const { state_id } = req.body;

  if (!state_id) {
    return res.json({ ok: false, msg: "State ID is required" });
  }

  try {
    const [result] = await db.execute("CALL sp_state_by_district(?)", [state_id]);
    return res.json(result[0]);
  } catch (error) {
    console.error("Error Fetching Districts by State:", error);
    return res.status(500).json({ ok: false, msg: "Internal Server Error" });
  }
});

module.exports = router;
