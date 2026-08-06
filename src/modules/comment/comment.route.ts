
import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/author/:authorId", commentController.getCommentByAuthorId) //
router.get("/:commentId", commentController.getCommentByPostId) //
router.post("/", auth(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.createComment)
router.patch("/:commentId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.updateComment)
router.delete("/:commentId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.deleteComment)
router.patch("/:commentId/moderate", auth(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.moderateComment)

export const commentRouter = router;