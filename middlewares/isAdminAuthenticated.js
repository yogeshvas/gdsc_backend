import jwt from "jsonwebtoken";

import { Admin } from "../models/admin.model.js";

export const isAdminAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(404).json({
      success: false,
      message: "Not Logged In",
    });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await Admin.findById(decoded._id);
  next();
};
