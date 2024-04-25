const express = require("express");
const userroutes = require(`../src/user/routes`);
const app = express();
const port = 3000;

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hello world");
});

// set routes
app.use('/users', userroutes);


app.listen(port, () => console.log(`app listen on ${port}`))