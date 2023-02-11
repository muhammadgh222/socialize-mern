import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  likePost,
  updatePost,
  getPostsBySearch,
} from "../controllers/postController.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(protect, createPost);
router.route("/:id").patch(protect, updatePost).delete(protect, deletePost);
router.patch("/:id/like", protect, likePost);

router.get("/search", getPostsBySearch);

export default router;
