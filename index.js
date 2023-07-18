const express=require("express");
const app=express();

const cors=require("cors");
const dotEnv=require("dotenv");
const bodyParser=require("body-parser");

const mongoose=require("mongoose");


app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json({limit:"50mb"}));

app.use(bodyParser.urlencoded({limit:"50mb", parameterLimit:100000, extended:true}));

dotEnv.config({path:'./.env'});

const port=process.env.PORT || 5000;

mongoose.connect(process.env.mongoDB_URL, {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>console.log("DB Connected"))
.catch((e)=>{
    console.log("Error occurred", e)
    process.exit(1);
})

app.use("/api/user", require("./router/userRouter"))
app.use("/api/post", require("./router/postRouter"))
app.use("/api/profile", require("./router/profileRouter"))

app.listen(port, ()=>{
    console.log(`Server started at port ${port}`)
})