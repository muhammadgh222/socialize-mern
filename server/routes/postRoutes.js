import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  likePost,
  updatePost,
} from "../controllers/postController.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").patch(updatePost).delete(deletePost);
router.patch("/:id/like", likePost);

export default router;
