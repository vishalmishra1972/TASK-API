const express = require("express");             //3 line same
const router = express.Router();
const db = require("../db.service")

router.post("/add",
    async(req, res) => {
        const { category_id,subcategory_name } = req.body;

            if (!subcategory_name || !category_id) {
                return res.json({ ok: false, msg: "Subcategory Name and category id are required" });
            }

        try {
            const [result] = await db.execute("CALL sp_user_subcategory_add(?,?)",[category_id,subcategory_name]);
            return res.json({ok: true, msg: "Subcategory Added Successfully"});
            } catch (error) {
            console.error("Error adding category:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
});

router.post("/update",
    async(req, res) => {
        const { id,category_id, subcategory_name } = req.body;

            if (!id || !category_id || !subcategory_name) {
                return res.json({ ok: false, msg: "id, category name and id are required" });
            }

        try {
            const [result] = await db.execute("CALL sp_user_subcategory_update(?,?,?)",[id,category_id,subcategory_name]);
            return res.json({ok: true, msg: "SubCategory Updated Successfully"});
        } catch (error) {
            console.error("Error updating Category:", error);
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
            const [result] = await db.execute("CALL sp_user_subcategory_remove(?)", [id]);
            return res.json({ok: true, msg: "SubCategory Removed Successfully"});
        } catch (error) {
            console.error("Error removing SubCategory:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
    }
);

router.post("/getall", async (req, res) => {
    try {
        const [result] = await db.execute("CALL sp_user_subcategory_getall()");
        return res.json({ ok: true, data: result[0] });

    } catch (error){
        console.error("Error fetching Category:", error);
        return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
});

module.exports = router;