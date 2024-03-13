import jwt from "jsonwebtoken";
export const sendUserCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    })
    .json({
      success: true,
      message,
    });
};
