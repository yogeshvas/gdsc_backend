import express from "express";
import { config } from "dotenv";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";

const app = express();

config({
  path: "./.env",
});

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/admin", adminRouter);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Running at PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB Connection failed!!", err);
  });
