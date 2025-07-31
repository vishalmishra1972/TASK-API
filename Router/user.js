const express = require("express");             //3 line same
const router = express.Router();
const db = require("../db.service")

router.post("/add", 
    async (req,res) => {
        let uoutput = req.body;
        if(!uoutput.first_name || !uoutput.last_name || !uoutput.email || !uoutput.password || !uoutput.phone){
            return res.json({ok: false, msg: "All fields are required"});
        }
        try {
            const [result] = await db.execute("CALL sp_user_add(?,?,?,?,?)", [
            uoutput.first_name,
            uoutput.last_name,
            uoutput.email,
            uoutput.password,
            uoutput.phone,
            ]);

            return res.json({ ok: true, msg: "User registered successfully" });
        } catch (error) {
            console.error("User creation failed:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
        });

router.post("/getall", async (req, res) => {
    try {
        const [result] = await db.execute("CALL sp_user_getall()");
        return res.json(result[0]);
    } catch (error){
        console.error("Error fetching users:", error);
        return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
});

router.post("/update",
    async(req, res) => {
        let uoutput = req.body;
        if(!uoutput.first_name || !uoutput.last_name || !uoutput.email || !uoutput.password || !uoutput.phone){
            return res.json({ok: false, msg: "All fields are required"});
        }
        try {
            const [result] = await db.execute("CALL sp_user_update(?,?,?,?,?,?)",[
                uoutput.id,
                uoutput.first_name, 
                uoutput.last_name, 
                uoutput.email, 
                uoutput.password, 
                uoutput.phone
            ]);
            return res.json({ok: true, msg: "User Updated Successfully"});
        } catch (error) {
            console.error("Error updating user:", error);
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
            const [result] = await db.execute("CALL sp_user_remove(?)", [id]);
            return res.json({ok: true, msg: "User Removed Successfully"});
        } catch (error) {
            console.error("Error removing user:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
    }
)

router.post("/login",
    async(req,res) => {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.json({ok:false, msg: "Email and password are required"});
        }
        try {
            const [result] = await db.execute("CALL sp_user_authenticate(?,?)", [
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