const express = require("express");             //3 line same
const router = express.Router();
const db = require("../db.service")

router.post("/add",
    async(req, res) => {
        const { category_name } = req.body;

            if (!category_name) {
                return res.json({ ok: false, msg: "Category Name is required" });
            }

        try {
            const [result] = await db.execute("CALL sp_user_category_add(?)",[category_name]);
            return res.json({ok: true, msg: "Category Added Successfully"});
            } catch (error) {
            console.error("Error adding category:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
});

router.post("/update",
    async(req, res) => {
        const { id,category_name } = req.body;

            if (!id || !category_name) {
                return res.json({ ok: false, msg: "id, category name are required" });
            }

        try {
            const [result] = await db.execute("CALL sp_user_category_update(?,?)",[id,category_name]);
            return res.json({ok: true, msg: "Category Updated Successfully"});
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
            const [result] = await db.execute("CALL sp_user_category_remove(?)", [id]);
            return res.json({ok: true, msg: "Category Removed Successfully"});
        } catch (error) {
            console.error("Error removing Category:", error);
            return res.status(500).json({ ok: false, msg: "Internal server error" });
        }
    }
);

router.post("/getall", async (req, res) => {
    try {
        const [result] = await db.execute("CALL sp_user_category_getall()");
        return res.json({ ok: true, data: result[0] });

    } catch (error){
        console.error("Error fetching Category:", error);
        return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
});

module.exports = router;