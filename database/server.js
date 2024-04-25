const express = require("express");
const userroutes = require(`../src/user/routes`);
const vendorroutes = require(`../src/vendor/routes`);
const roleroutes = require(`../src/role/routes`);
const pengadaanroutes = require(`../src/pengadaan/routes`);
const app = express();
const port = 3000;

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hello world");
});

// set routes
app.use('/user', userroutes);
app.use('/vendor', vendorroutes);
app.use('/role', roleroutes);
app.use('/pengadaan', pengadaanroutes);


app.listen(port, () => console.log(`app listen on ${port}`))