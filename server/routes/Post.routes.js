const express = require('express');
const router = express.Router();
const upload = require("../libs/storage.js");
const postController = require("../controllers/Post.controller.js");

router.post("/posts/new", upload.single("image"), postController.savePost);
router.post("/posts/:id/edit", postController.editPost);
router.delete('/posts/:id', postController.deletePost);
router.post('/posts/:id/like', postController.incrementLikes);
router.post("/posts/:id/comment", postController.saveComment);
router.get("/posts", postController.getPagePosts);
router.get("/posts/user/:userId", postController.getUserPosts);
router.get("/posts/:id", postController.getPostById);
router.get("/comments/:id", postController.getCommentById);

module.exports = router;