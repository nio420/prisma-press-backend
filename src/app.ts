import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./auth/auth.route";
import { commentRouter } from "./modules/comment/comment.route";
import { postRouter } from "./modules/post/post.route";
import { notFoundRoute } from "./middleware/notFoundRoute";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { subscriptionRouter } from "./modules/subscription/subscription.route";
import { premiumRouter } from "./modules/premium/premium.route";


const app: Application = express();

app.use(cors({
  origin: config.app_url,
  credentials: true,
}))

app.use("/api/subscription/webhook", express.raw({ type: "application/json"}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req:Request, res:Response) => {
  res.send("Hello World!");
});

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)
app.use("/api/subscription", subscriptionRouter)
app.use("/api/premium", premiumRouter)

app.use(notFoundRoute)
app.use(globalErrorHandler)

export default app;