const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types 

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a post-title"]
  },
  body: {
    type: String,
    required: [true, "Please enter a post-body"]
  },
  photoLink:{
    type: String
  },
  postedBy: {
    type: ObjectId,
    ref: "user"
  },
  likes:[{
    type:ObjectId,
    ref:"User"
  }],
  reacts: [{
    createdBy: {
      type: ObjectId,
      ref: "user"
    },
    reaction: {
      type: String
      // => good, ok, bad
    }
  }]
}, {timestamps: true})

module.exports = mongoose.model('post', postSchema)