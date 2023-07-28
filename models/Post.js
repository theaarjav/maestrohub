const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
        ,

        title: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: false },
        avatar: { type: String, required: true },
        name: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        comments: [
            {
                    parent:{type: String},
                    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
                    text: { type: String, required: true },
                    avatar: { type: String, required: true },
                    name: { type: String, required: true },
                    date: { type: Date, default: Date.now() }
                
                },
                { timestamps: true },
        ]
    },
{ timestamps: true }

)

const Post = mongoose.model("post", PostSchema);
module.exports = Post