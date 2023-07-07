const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate=require("../middleware/authenticate")
// const authenticate = require("../middlewares/authenticate");

/*
 *    usage : to Register a User
 *    url : /api/users/register
 *    fields : name , email , password
 *    method : POST
 *    access : PUBLIC
 */
router.post(
  "/register",
  async (req, res) => {
    try {
      let { name, email, password } = req.body;
      // check if the user exits
      // console.log(name,email, password);
      let user = await User.findOne({ email: email });

      if (user) {
        return res.status(201).json({ msg: "User already Exists" });
      }

      /* This code is generating a salt using `bcrypt.genSalt()` method with a cost factor of 10, and
        then using that salt to hash the password using `bcrypt.hash()` method. Salting and hashing
        the password is a common technique used to securely store passwords in a database. The salt
        is a random string that is added to the password before hashing, which makes it more
        difficult for attackers to crack the password using techniques like rainbow tables. The
        resulting hash is then stored in the database instead of the plain text password. */

      let salt = await bcrypt.genSalt(10); // salt is actually encrypted password
      password = await bcrypt.hash(password, salt); //password=salt

      let avatar =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU";

      user = new User({ name, email, password, avatar });
      await user.save();
      res.status(200).json({ msg: "Registration is Successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: error.message });
    }
  }
);


/**
 * usage: To log into your account
 * url: /api/user/login
 * fields: email, password
 * method: POST
 * access: PUBLIC
 */
router.post("/login", async(req, res)=>{
    try {
        let {email, password}=req.body;
        let user= await User.findOne({email: email});
        if(!user)return res.status(201).json({msg: "User Doesn't exist"});
        let match=await bcrypt.compare(password, user.password);
        if(!match)return res.status(201).json({msg: " Invalid Credentials "});
        let payload={
            user:
            {
            id:user.id,
            name:user.name
        }
        }
        jwt.sign(payload, process.env.JWSToken, (err, token)=>{
            if(err)throw err;
            res.status(200).json({msg:"Login is success", token:token});
        });
    } catch (err) {
        console.log("Error: ", err)
        res.status(500).json({error:err})
    }
})

router.get("/you", authenticate, async(req, res)=>{
    try {
        let user=await User.findById(req.user.id).select("-password");
        console.log(user)
        return res.status(200).json({user});
    } catch (err) {
        console.log(err);
        res.status(500).json({err: err});
    }
})

module.exports=router