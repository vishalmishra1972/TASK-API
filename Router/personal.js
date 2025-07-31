const express = require("express");             //3 line same
const router = express.Router();
const db = require("../db.service")

router.post('/done',
     async (req, res) => {
        const { id } = req.body;

        // Validate input
        if (!id || typeof id !== 'number') {
            return res.status(400).json({ ok: false, msg: "A valid numeric 'id' is required." });
        }

        try {
            const [result] = await db.execute("CALL sp_personal_done(?)", [id]);

            return res.json({
            ok: true,
            msg: "Personal work marked as done successfully."
            });
        } catch (error) {
            console.error("Error marking Personal work as done:", error);
            return res.status(500).json({
            ok: false,
            msg: "Internal Server Error. Please try again later."
            });
        }
});

router.post("/add", async (req, res) => {
  let p = req.body;
  if (!p.user_id || !p.personal_work || !p.personal_des || !p.current_time) {
    return res.json({ ok: false, msg: "All fields are required" });
  }

  try {
    const [result] = await db.execute("CALL sp_personal_add(?,?,?,?,?)", [
      p.user_id,
      p.personal_work,
      p.personal_des,
      p.created_at,
      p.current_time
    ]);
    return res.json({ ok: true, msg: "Personal task added successfully" });
  } catch (err) {
    console.error("Error adding personal task:", err);
    return res.status(500).json({ ok: false, msg: "Internal Server Error" });
  }
});



router.post("/update",
    async(req, res) => {
        const { id, personal_work, personal_des, created_at } = req.body;

            if (!id || !personal_work || !personal_des || !created_at) {
                return res.json({ ok: false, msg: "id, personal_work, and personal_des, created_at are required" });
            }
        try {
            const [result] = await db.execute("CALL sp_personal_update(?,?,?,?)",[id, personal_work, personal_des, created_at]);
            return res.json({ok: true, msg: "Personal Work Updated Successfully"});
        } catch (error) {
            console.error("Error updating Personal Work:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
});

router.post("/remove",
    async(req,res) => {
        const {id} = req.body;
        if(!id){
            return res.json({ok: false, msg: "ID is required"});
        }

        try {
            const [result] = await db.execute("CALL sp_personal_remove(?)", [id]);
            return res.json({ok: true, msg: "Personal Work Removed Successfully"});
        } catch (error) {
            console.error("Error removing Personal Work:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
    }
);

router.post("/getall", async (req, res) => {
    try {
        const [result] = await db.execute("CALL sp_personal_getall()");
        return res.json(result[0]);
    } catch (error){
        console.error("Error fetching personal work:", error);
        return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
});

router.post("/getpersonalbyuserid", async (req, res) => {
    try {
        const { user_id} = req.body
        const [result] = await db.execute("CALL sp_get_personal_by_user_id(?)", [user_id]);
        return res.json(result[0]);
    } catch (error) {
        console.error("Error Feching Work by User ID:", error);
        return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
});


router.post('/getallpersonalbyuserid', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.json({ ok: false, msg: 'User ID is required' });
  }

  try {
    const [result] = await db.query('CALL sp_get_all_personal_by_user_id(?)', [user_id]);
    res.json(result[0]); // Return the first result set
  } catch (err) {
    console.error('Error fetching work by user:', err);
    res.status(500).json({ ok: false, msg: 'Database error' });
  }
});

module.exports = router;