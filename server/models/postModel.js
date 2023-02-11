import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: String,
    post: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
