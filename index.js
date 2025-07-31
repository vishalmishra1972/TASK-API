const dotenv = require('dotenv')
dotenv.config();

const express = require('express')
const app = express();

const cors = require('cors')
app.use(cors());

app.use(express.json());

const userRouter = require('./Router/user.js')
app.use('/user', userRouter);

const adminRouter = require('./Router/admin.js')
app.use('/admin', adminRouter);

const personalRouter = require('./Router/personal.js')
app.use('/personal', personalRouter);

const workRouter = require('./Router/work.js')
app.use('/work', workRouter);

const usercategoryRouter = require('./Router/usercategory.js')
app.use('/usercategory', usercategoryRouter);

const usersubcategoryRouter = require('./Router/usersubcategory.js')
app.use('/usersubcategory', usersubcategoryRouter);

const staterouter = require('./Router/state.js')
app.use("/state", staterouter);

const countryrouter = require('./Router/country.js')
app.use("/country", countryrouter);

const districtrouter = require("./Router/district.js")
app.use("/district", districtrouter);

app.listen(4000)

app.get('/', (req, res) => {
  res.send('Backend API is working 🎉');
});