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
            const [result] = await db.execute("CALL sp_work_done(?)", [id]);

            return res.json({
            ok: true,
            msg: "Work marked as done successfully."
            });
        } catch (error) {
            console.error("Error marking work as done:", error);
            return res.status(500).json({
            ok: false,
            msg: "Internal Server Error. Please try again later."
            });
        }
});

router.post('/completed',
     async (req, res) => {
        const { id } = req.body;

        // Validate input
        if (!id || typeof id !== 'number') {
            return res.status(400).json({ ok: false, msg: "A valid numeric 'id' is required." });
        }

        try {
            const [result] = await db.execute("CALL sp_work_complete(?)", [id]);

            return res.json({
            ok: true,
            msg: "Work marked as completed successfully."
            });
        } catch (error) {
            console.error("Error marking work as complete:", error);
            return res.status(500).json({
            ok: false,
            msg: "Internal Server Error. Please try again later."
            });
        }
});


router.post("/add", 
    async (req,res) => {
        let poutput = req.body;
        if(!poutput.work_name || !poutput.work_des){
            return res.json({ok: false, msg: "All fields are required"});
        }
        const [result] = await db.execute("CALL sp_work_add(?,?,?,?)",[
            poutput.user_id,
            poutput.work_name, 
            poutput.work_des, 
            poutput.created_at
        ]);
        return res.json({ ok: true, msg: "Work added successfully" });
    }
)


router.post("/update",
    async(req, res) => {
        const { id, work_name, work_des, created_at } = req.body;

            if (!id || !work_name || !work_des|| !created_at) {
                return res.json({ ok: false, msg: "id, work_name, and work_des, created_at are required" });
            }

        try {
            const [result] = await db.execute("CALL sp_work_update(?,?,?,?)",[id, work_name, work_des, created_at]);
            return res.json({ok: true, msg: "Work Updated Successfully"});
        } catch (error) {
            console.error("Error updating Work:", error);
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
            const [result] = await db.execute("CALL sp_work_remove(?)", [id]);
            return res.json({ok: true, msg: "Work Removed Successfully"});
        } catch (error) {
            console.error("Error removing Work:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
    }
);

router.post("/getall", async (req, res) => {
    try {
        const [result] = await db.execute("CALL sp_work_getall()");
        return res.json(result[0]);
    } catch (error){
        console.error("Error fetching work:", error);
        return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
});

router.post("/getworkbyuserid", async (req, res) => {
    try {
        const { user_id} = req.body
        const [result] = await db.execute("CALL sp_get_work_by_user_id(?)", [user_id]);
        return res.json(result[0]);
    } catch (error) {
        console.error("Error Feching Work by User ID:", error);
        return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
});



router.post('/getallbyuserid', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.json({ ok: false, msg: 'User ID is required' });
  }

  try {
    const [result] = await db.query('CALL sp_get_all_work_by_user_id(?)', [user_id]);
    res.json(result[0]); // Return the first result set
  } catch (err) {
    console.error('Error fetching work by user:', err);
    res.status(500).json({ ok: false, msg: 'Database error' });
  }
});

module.exports = router;