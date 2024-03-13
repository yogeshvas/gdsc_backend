import express, { Router } from "express";
import {
  addBook,
  getAllDetails,
  issueBook,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/admin.js";
import { isAdminAuthenticated } from "../middlewares/isAdminAuthenticated.js";

const router = express.Router();

router.post("/new", registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", isAdminAuthenticated, logoutAdmin);
router.post("/addbook", isAdminAuthenticated, addBook);
router.post("/issueBook", isAdminAuthenticated, issueBook);
router.get("getAllDetails", isAdminAuthenticated, getAllDetails);
export default router;
