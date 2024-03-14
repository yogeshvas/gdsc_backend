import { Student } from "../models/student.model.js";

import { sendUserCookie } from "../utils/studentFeatures.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, phoneNo, rollNo } = req.body;
    let user = await Student.findOne({
      $or: [{ rollNo: rollNo }, { email: email }, { phoneNo: phoneNo }],
    });

    if (user) {
      let field;
      if (user.rollNo === rollNo) field = "roll number";
      else if (user.email === email) field = "email";
      else if (user.phoneNo === phoneNo) field = "phone number";

      return res.status(409).json({
        // 409 Conflict might be more appropriate than 404 Not Found
        success: false,
        message: `User already exists with that ${field}.`,
      });
    }
    user = await Student.create({
      name,
      email,
      phoneNo,
      rollNo,
    });
    sendUserCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    console.log("Error While Creating User");
    next(error);
  }
};
//Register testing done
export const login = async (req, res, next) => {
  try {
    const { rollNo, password } = req.body;
    const user = await Student.findOne({ rollNo });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Doesn't Exist",
      });
    }

    if (password !== user.phoneNo) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password",
      });
    }

    sendUserCookie(user, res, `Welcome Back ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};
//Login testing done

export const logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Logged Out Succesfully",
    });
};
