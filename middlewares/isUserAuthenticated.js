import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";

export const isUserAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(404).json({
      success: false,
      message: "Not Logged In",
    });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await Student.findById(decoded._id);
  next();
};
