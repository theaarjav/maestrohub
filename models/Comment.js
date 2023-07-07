const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },content: {
        type: String,
        required: true,
      },
  
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Comment = mongoose.model("comment", PostSchema);
module.exports = Comment;
