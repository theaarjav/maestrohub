const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
const Profile = require("../models/Profile");
const { use } = require("./userRouter");

/**
 * usage:Get User's Profile
 * url:/api/profile/me
 * fields: No Fields
 * method: GET
 * access: PRIVATE
 */





router.get("/me", authenticate, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id }).populate(
            "user", ["name", "avatar"]
        )
        if (!profile) return res.status(405)
        res.status(200).json({ profile });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ msg: err.message });
    }
})

/**
 * usage: Create a Profile
 * url: /api/profile/new
 * fields: company , website , location , designation , skills , bio , githubUsername, youtube , facebook , twitter , linkedin , instagram
 * method:POST
 * access:PRIVATE
 */

router.post("/new", authenticate, async (req, res) => {
    try {
        let {
            image,
            squat,
            bench,
            deadlift,
            location,
            trainer,
            skills,
            bio,
            youtube,
            facebook,
            twitter,
            linkedin,
            instagram,
        } = req.body;
        let profileObj = {};
        profileObj.user = req.user.id;
        if (squat) profileObj.squat = squat;
        else squat = "";
        if (bench) profileObj.bench = bench;
        else bench = "";
        if (deadlift) profileObj.deadlift = deadlift;
        else deadlift = "";
        if (location) profileObj.location = location;
        else location = "";
        if (trainer) profileObj.trainer = trainer;
        else trainer = "";
        // console.log(skills);
        if (skills) {
            profileObj.skills = skills.toString().split(",").map((skill) => {
                return skill.trim();
            })
        }
        else skills = "";
        if (bio) profileObj.bio = bio;
        else bio = "";
        
        if (youtube) profileObj.youtube = youtube;
        else youtube = "";
        if (facebook) profileObj.facebook = facebook;
        else facebook = "";
        if (twitter) profileObj.twitter = twitter;
        else twitter = "";
        if (linkedin) profileObj.linkedin = linkedin;
        else linkedin = "";
        if (instagram) profileObj.instagram = instagram;
        else instagram = "";
        let profile = new Profile(profileObj);
        profile = await profile.save();
        profile.populate("user");
        if (image == undefined || image == "" || image == null) image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU"
        await User.findById({ _id: req.user.id }, { avatar: image })
        res.status(200).json({
            msg: "Profile Created Successfully"
        })
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ msg: err.message });
    }
});


router.get("/allusers", async(req, res)=>{
    try {
        let allprofiles=await Profile.find().populate("user", ["name", "avatar"]);
        if(!allprofiles){
            return res.status(405).json("No Profiles Registered Yet");
        }
        return res.status(200).json({allprofiles});
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})


router.put("/update", authenticate, async (req, res) => {
    try {
        let {
            image,
            squat,
            bench,
            deadlift,
            location,
            trainer,
            skills,
            bio,
            youtube,
            facebook,
            twitter,
            linkedin,
            instagram,
        } = req.body;
        let profileObj = {};
        profileObj.user = req.user.id;
        if (squat) profileObj.squat = squat;
        else squat = "";
        if (bench) profileObj.bench = bench;
        else bench = "";
        if (deadlift) profileObj.deadlift = deadlift;
        else deadlift = "";
        if (location) profileObj.location = location;
        else location = "";
        if (trainer) profileObj.trainer = trainer;
        else trainer = "";
        if (skills) {
            profileObj.skills = skills.toString().split(",").map((skill) => {
                return skill.trim();
            })
        }
        else skills = "";
        if (bio) profileObj.bio = bio;
        else bio = "";
        if (youtube) profileObj.youtube = youtube;
        else youtube = "";
        if (facebook) profileObj.facebook = facebook;
        else facebook = "";
        if (twitter) profileObj.twitter = twitter;
        else twitter = "";
        if (linkedin) profileObj.linkedin = linkedin;
        else linkedin = "";
        if (instagram) profileObj.instagram = instagram;
        else instagram = "";
        // profileObj.image=image
        let profile=await Profile.findOne({user:req.user.id});
        if(!profile){
            profile = new Profile(profileObj);
            profile = await profile.save();
            profile.populate("user");
            if (image == undefined || image == "" || image == null) image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU"
            await User.findById({ _id: req.user.id }, { avatar: image })
            return res.status(200).json({
                msg: "Profile Created Successfully"
            })
        }
         profile = await Profile.findOneAndUpdate({ user: req.user.id },
            { $set: profileObj }, { new: true });
        if (!profile) return res.send(402).json({ msg: "No User Found" })
          profile=await profile.save(); 
        if (image == "undefined" || image == "" || image == null) image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU"
        await User.findOneAndUpdate({ _id: req.user.id }, { avatar: image })
        profile.populate("user");
        res.status(200).json({
            msg: "Profile Updated Successfully"
        })
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ msg: err.message });
    }
})

router.get("/users/:profileID", async (req, res) => {
    try {
        let userID = req.params.profileID;
        let profile = await Profile.findOne({ user: userID }).populate(
            "user", ["name", "avatar"]
        )
        if (!profile) return res.status(200).json({ msg: "User does not have a profile yet" });
        res.status(200).json({ profile });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ msg: err.message });
    }
})


router.put("/experience", authenticate, async (req, res) => {
    try {

        let { title, represented, squat, bench, deadlift,snatch,cnj,position, location, from, to, description } =
            req.body;
        let newEd = {
            title: title,
            represented: represented,
            squat: squat,
            bench: bench,
            deadlift: deadlift,
            snatch:snatch,
            cnj:cnj,
            location:location,
            position:position,
            from:from,
            to: to ? to : "",
            description: description 
        }
        let profile = await Profile.findOne({ user: req.user.id }).populate(
            "user", ["name", "avatar"]
        )
        if (!profile) return res.status(401).json("Profile Not Found");
        profile.competitions.unshift(newEd);
        await profile.save();
        res.status(200).json({msg:"Competition Added"});
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
})


router.delete("/experience/:expID", authenticate, async (req, res)=>{
    try {
        let delID=req.params.expID;

        let profile=await Profile.findOne({user:req.user.id});
        if(!profile)res.status(401).json("Profile Not Found")
        let index=profile.competitions.map(exp=> exp._id.toString()).indexOf(delID);
        if(index!==-1){
            profile.competitions.splice(index, 1);
            await profile.save();
            return res.status(200).json({msg:"Competition deleted successfully"});
        }
        return res.status(403).json("Experience Not found");
    } catch (err) {
        console.log("Err; ", err);
        res.status(500).json({err: err.message});
    }
})


router.put("/education", authenticate, async (req, res) => {
    try {

        let { school, degree, fieldOfStudy, from, description, to, current } =
            req.body;
        let newEd = {
            school: school,
            degree: degree,
            fieldOfStudy: fieldOfStudy,
            from: from,
            description: description,
            to: to ? to : "",
            current: current ? current : false
        }
        let profile = await Profile.findOne({ user: req.user.id }).populate(
            "user", ["name", "avatar"]
        )
        if (!profile) return res.status(401).json("Profile Not Found");
        profile.education.unshift(newEd);
        await profile.save();
        res.status(200).json("Education updated successfully");
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
})



router.delete("/education/:expID", authenticate, async (req, res)=>{
    try {
        let delID=req.params.expID;

        let profile=await Profile.findOne({user:req.user.id});
        if(!profile)res.status(401).json("Profile Not Found")
        let index=profile.education.map(exp=> exp._id.toString()).indexOf(delID);
        if(index!==-1){
            profile.education.splice(index, 1);
            await profile.save();
            return res.status(200).json({msg:"Education deleted successfully"});
        }
        return res.status(403).json("education Not found");
    } catch (err) {
        console.log("Err; ", err);
        res.status(500).json({err: err.message});
    }
})


router.get("/:profileID", async(req, res)=>{
    try {
        let profID=req.params.profileID;
        let profile=await Profile.findById(profID).populate("user", ["name", "avatar"]);
        if(!profile)res.status(401).json("Profile No longer Exists");
        return res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({err: err.message});
    }
})


router.put("/:profileID", authenticate, async(req, res)=>{
    try {
        console.log(typeof req.user.id, typeof req.params.profileID)
        let userID=req.user.id;
        let followID=req.params.profileID;
        let userprofile= await Profile.findOne({user:userID});
        let followProfile= await Profile.findOne({user:followID});
        if(followProfile.followers.map(user=>user.toString()).includes(userID)){
            let removableIndex=userprofile.following.map(follow=>follow.toString()).indexOf(followID);
            userprofile.following.splice(removableIndex, 1);
            userprofile.save();
            removableIndex=followProfile.followers.map(follower=>follower.toString()).indexOf(userID);
            followProfile.save();
            followProfile.followers.splice(removableIndex, 1);
            return res.status(200).json({msg:"Unfollowed user"});

        }else{
            let uuserID= await User.findById(userID);
            let ffollowID= await User.findById(followID);
            userprofile.following.unshift(ffollowID);
            // console.log(userprofile.following)
            followProfile.followers.unshift(uuserID);
            // console.log(followProfile.followers)
            userprofile.save();
            followProfile.save();
            return res.status(200).json({msg:"Followed user", userprofile})
        }
    } catch (error) {
        
    }
})

module.exports = router