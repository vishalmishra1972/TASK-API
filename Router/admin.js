const express = require("express");             //3 line same
const router = express.Router();
const db = require("../db.service")

router.post("/add", 
    async (req,res) => {
        let aoutput = req.body;
        if(!aoutput.first_name || !aoutput.last_name || !aoutput.email || !aoutput.password || !aoutput.phone){
            return res.json({ok: false, msg: "All fields are required"});
        }
        const [result] = await db.execute("CALL sp_admin_add(?,?,?,?,?)",[
            aoutput.first_name, 
            aoutput.last_name, 
            aoutput.email, 
            aoutput.password, 
            aoutput.phone,
        ]);
        return res.json(result[0][0])
    }
)


router.post("/update",
    async(req, res) => {
        let aoutput = req.body;
        if(!aoutput.first_name || !aoutput.last_name || !aoutput.email || !aoutput.password || !aoutput.phone){
            return res.json({ok: false, msg: "All fields are required"});
        }
        try {
            const [result] = await db.execute("CALL sp_admin_update(?,?,?,?,?,?)",[
                aoutput.id,
                aoutput.first_name, 
                aoutput.last_name, 
                aoutput.email, 
                aoutput.password, 
                aoutput.phone
            ]);
            return res.json({ok: true, msg: "Admin Updated Successfully"});
        } catch (error) {
            console.error("Error updating Admin:", error);
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
            const [result] = await db.execute("CALL sp_admin_remove(?)", [id]);
            return res.json({ok: true, msg: "Admin Removed Successfully"});
        } catch (error) {
            console.error("Error removing Admin:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
    }
);

router.post("/getall", async (req, res) => {
    try {
        const [result] = await db.execute("CALL sp_admin_getall()");
        return res.json(result[0]);
    } catch (error){
        console.error("Error fetching admin:", error);
        return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
});


router.post("/login",
    async(req,res) => {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.json({ok:false, msg: "Email and password are required"});
        }
        try {
            const [result] = await db.execute("CALL sp_admin_authenticate(?,?)", [
                email,
                password
            ]
            );
            return res.json(result[0][0]);

        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
        
    }
);

module.exports = router;