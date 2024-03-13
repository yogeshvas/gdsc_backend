import express, { Router } from "express";
import { register, login, logout } from "../controllers/student.js";
import { isUserAuthenticated } from "../middlewares/isUserAuthenticated.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout", isUserAuthenticated, logout);
router.post("/register", register);

export default router;
