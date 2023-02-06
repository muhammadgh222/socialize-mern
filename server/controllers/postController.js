import Post from "../models/postModel.js";
import AsyncHandler from "../utilities/AsyncHandler.js";
import AppError from "../utilities/AppError.js";

export const createPost = AsyncHandler(async (req, res, next) => {
  const { title, message, selectedFile, creator, tags } = req.body;

  const post = await Post.create({
    title,
    message,
    selectedFile,
    creator,
    tags,
  });
  res.status(201).json(post);
});

export const getAllPosts = AsyncHandler(async (req, res, next) => {
  const posts = await Post.find({});
  if (posts.length === 0) {
    return next(new AppError("There is no posts to show", 404));
  }
  res.status(200).json(posts);
});

export const updatePost = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  const post = await Post.findByIdAndUpdate(
    id,
    { creator, title, message, tags, selectedFile, _id: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!post) {
    return next(new AppError("There is no such a post", 404));
  }
  res.status(200).json(post);
});

export const deletePost = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    return next(new AppError("There is no such a post", 404));
  }
  res.status(200).json(null);
});

export const likePost = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!post) {
    return next(new AppError("There is no such a post", 404));
  }
  res.status(200).json(updatedPost);
});
