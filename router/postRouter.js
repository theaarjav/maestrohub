const express=require("express");
const router=express.Router();
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
const Post=require("../models/Post");

router.post("/new", authenticate,  async(req, res)=>{
    try {
        let {
            title, image, description 
        }=req.body;
        let user=await User.findById(req.user.id);
        let name=user.name;
        let avatar=user.avatar;
        let newPost={
            title:title,
            description:description,
            image:(image==undefined || image==null || image=="")?" ": image,
            user:user,
            name:name,
            avatar:avatar
        }
        // console.log(newPost)
        let post=new Post(newPost);
        await post.save();
        return res.status(200).json({msg:"Post created Successfully"});
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})


router.get("/", authenticate, async(req, res)=>{
    try {
        
        let allPosts=await Post.find().populate("user",["_id","name", "avatar"]);
        if(!allPosts)return res.status(405).json("No posts yet");
        res.status(200).json({allPosts})
    } catch (err) {
        res.status(500).json({error:err.message});
    }
})




router.get("/:postID",authenticate, async(req, res)=>{
    try {
        let id=req.params.postID;
        let post=await Post.findById(id).populate("user",["_id",'name', "avatar"]);
        if(!post)return res.status(403).json({msg:"Post does not exists"});
        return res.status(200).json({post});
    } catch (error) {
        res.status(500).json({error:err.message});
    }
})


router.delete("/:postID", authenticate, async(req, res)=>{
    try {
        let id=req.params.postID;
        let post=await Post.findById(id).populate("user", ["_id", "avatar"]);
        // console.log
        if(!post)return res.status(403).json({msg: "Post does not exist"});
        await Post.findByIdAndRemove(id);
        res.status(200).json({msg:"Post deleted successfully"});
    } catch (error) {
        res.status(500).json({error})
    }
})


router.put("/likes/:postID", authenticate, async(req, res)=>{
    
    try {
        let postID=req.params.postID;
        let user=req.user.id;
        
        let post=await Post.findById(postID).populate("user", ['name',"_id", "avatar"]);
        if(post.likes.map(like=>like.toString()).includes(user)){
            let removableIndex=post.likes.map(like=>like.toString()).indexOf(user);
            if(removableIndex!==-1){
                post.likes.splice(removableIndex, 1);
                await post.save();
                return res.status(200).json({msg:"Like removed successfully"});
            }
            else{
                return res.status(500).json({error:"Something went wrong"});
            }
        }else{
            // user= await User.findById(user);
            post.likes.unshift(user);
            await post.save();
        }
        res.status(200).json({msg:"Post liked"});
    } catch (error) {
        res.status(500).json({error})
    }
})


router.put("/comments/:postID", authenticate, async(req, res)=>{
    
    try {

        let postID=req.params.postID;
        let user=req.user.id;
        user=await User.findById(req.user.id);
        let post=await Post.findById(postID);
        let text=req.body.text;
        let name=user.name;
        let avatar=user.avatar;
        console.log( user)
        let newComment={
            user:user,
            text:text,
            name:name,
            avatar:avatar
        }
        post.comments.unshift(newComment);
        await post.save();
        post=await Post.findById(postID).populate("user",["name","avatar"]);
        res.status(200).json({post, msg:"New Comment Posted"});
    } catch (error) {
        res.status(500).json({error})
    }
})


router.delete("/comments/:postID/:commentID", authenticate, async(req, res)=>{
    
    try {
        // console.log("Entered")
        let postID=req.params.postID;
        let commentID=req.params.commentID;
        // let user=req.user.id;
        // console.log(postID, commentID)
        let post=await Post.findById(postID);
        if(!post)return res.status(403).json({msg:"Post does not exist"});
        let comment= post.comments.find(comm=>comm.id===commentID);
        // console.log(comment)
        if(!comment) return res.status(403).json({msg:"Comment does not exist"});
        if(req.user.id!==comment.user.toString())return res.status(402).json({msg:"User unauthorized"});
        let removeableIndex=post.comments.findIndex(comm=>comm.id===commentID);
        post.comments.splice(removeableIndex, 1);
        
        await post.save();
        post=await Post.findById(postID).populate("user",["name","avatar"]);
        res.status(200).json({msg:"Comment deleted successfully",post});
    } catch (error) {
        res.status(500).json({error})
    }
})



module.exports= router