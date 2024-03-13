import { Admin } from "../models/admin.model.js";
import bycrpt from "bcrypt";
import { sendAdminCookie } from "../utils/adminFeatures.js";
import { Books } from "../models/books.model.js";
import { Student } from "../models/student.model.js";
import { Transaction } from "../models/transcations.model.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, empId } = req.body;
    let user = await Admin.findOne({ empId });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exit",
      });
    }

    const hashedPassword = await bycrpt.hash(password, 10);
    user = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      empId,
    });
    sendAdminCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    res.status(500).json({
      success: "false",
      message: "Error While Registering the Admin Account",
    });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { empId, password } = req.body;
    const user = await Admin.findOne({ empId }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found or Invalid EmpId",
      });
    }

    const isMatch = await bycrpt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid Password",
      });
    }
    sendAdminCookie(user, res, `Welcome ${user.name}`, 200);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "User login failed",
    });
  }
};
export const logoutAdmin = async (req, res) => {
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

export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, publicationDate, genre, quantity } = req.body;

    // Check if the book with the given ISBN already exists
    const existingBook = await Books.findOne({ isbn });
    if (existingBook) {
      return res
        .status(400)
        .json({ error: "Book with this ISBN already exists" });
    }

    // Create a new book object
    const book = new Books({
      title,
      author,
      isbn,
      publicationDate,
      genre,
      quantity,
    });

    // Save the book to the database
    await book.save();

    return res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to issue a book
export const issueBook = async (req, res) => {
  try {
    const { bookId, studentId } = req.body;

    // Check if the book exists and has available quantity
    const book = await Books.findById(bookId);
    if (!book || book.quantity <= 0) {
      return res.status(404).json({ error: "Book not available" });
    }

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create a new transaction
    const transaction = new Transaction({
      book: bookId,
      user: studentId,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Example: Due date is set to 7 days from issue date
      status: "issued",
    });

    // Decrement the book quantity
    book.quantity -= 1;
    await book.save();

    // Save the transaction to the database
    await transaction.save();

    return res
      .status(201)
      .json({ message: "Book issued successfully", transaction });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllDetails = async (req, res) => {
  try {
    // Find all transactions with populated book and user details
    const transactions = await Transaction.find()
      .populate("book")
      .populate("user");

    // Prepare the response data
    const transactionDetails = transactions.map((transaction) => ({
      book: {
        title: transaction.book.title,
        author: transaction.book.author,
        isbn: transaction.book.isbn,
      },
      user: {
        name: transaction.user.name,
        rollNo: transaction.user.rollNo,
        email: transaction.user.email,
      },
      issueDate: transaction.issueDate,
      dueDate: transaction.dueDate,
      returnDate: transaction.returnDate,
      status: transaction.status,
    }));

    return res.status(200).json({ transactionDetails });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
