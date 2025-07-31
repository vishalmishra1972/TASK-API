    const express = require("express");             //3 line same
    const router = express.Router();
    const db = require("../db.service")

// const jwt =  require("jsonwebtoken");

router.post('/add',                     // /add is path, cout is a variable requesting access to table body
    async(req,res)=>{
        let cout = req.body;
        if(!cout.country_name || !cout.country_code){               // this is to make field required
            return res.json({ok: false, msg: "all fields are required"});
        }
        
        const[result] = await db.execute("CALL sp_country_add(?,?,?)",[
            cout.country_name,
            cout.country_code,
            cout.continent
        ]);
        return res.json(result[0][0])           // this is to collect response in array format
    }
)



router.post('/getall', async (req, res) => {
    try {
               // this is to connect db.service.js file
        const [result] = await db.execute("CALL sp_country_getall()");
        return res.json(result[0]); // First result set
    } catch (error) {
        console.error("Error fetching countries:", error);
        return res.status(500).json({ ok: false, msg: "Internal Server Error" });
    }
});


module.exports=router           // exporting file to index.js
    