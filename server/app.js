const express = require('express');
const dotenv = require('dotenv');
const  cors = require('cors');
const path = require('path');

dotenv.config();

const Router = require("./routers/userdataroutes")
const Router1 = require("./routers/employeeroutes")

const app = express();

app.use(express.json());
app.use(cors());



app.use('/api',Router)
app.use('/api',Router1)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
