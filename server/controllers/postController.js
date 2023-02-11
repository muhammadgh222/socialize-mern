import Post from "../models/postModel.js";
import AsyncHandler from "../utilities/AsyncHandler.js";
import AppError from "../utilities/AppError.js";

export const createPost = AsyncHandler(async (req, res, next) => {
  const post = req.body;

  const newPost = await Post.create({
    ...post,
    creator: req.user.id,
  });
  res.status(201).json(newPost);
});

export const getPostsBySearch = AsyncHandler(async (req, res, next) => {
  const { searchQuery, tags } = req.query;

  const title = new RegExp(searchQuery, "i");

  let posts = await Post.find({
    $or: [{ title }, { tags: { $in: tags.split(",") } }],
  });
  if (!posts) {
    posts = await Post.find({});
  }
  res.status(200).json({
    status: "success",
    data: posts,
  });
});

export const getAllPosts = AsyncHandler(async (req, res, next) => {
  const { page } = req.query;

  const limit = 8;
  const startIndex = (Number(page) - 1) * limit;
  const total = await Post.countDocuments({});

  const posts = await Post.find({})
    .sort({ _id: -1 })
    .limit(limit)
    .skip(startIndex);
  if (posts.length === 0) {
    return next(new AppError("There is no posts to show", 404));
  }
  res
    .status(200)
    .json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / limit),
    });
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

  if (!req.user) {
    return next(
      new AppError("You are not authorized to access this route", 304)
    );
  }

  const post = await Post.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.user.id));
  if (index === -1) {
    post.likes.push(req.user.id);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.user.id));
  }

  const updatedPost = await Post.findByIdAndUpdate(id, post, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new AppError("There is no such a post", 404));
  }
  res.status(200).json(updatedPost);
});
