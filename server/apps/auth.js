import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
// Exercise #1: Register User

authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const collection = db.collection("usersData"); // Fix: Change UsersData to user
  await collection.insertOne(user); // Fix: Change UsersData to user

  return res.json({
    message: "User has been created successfully",
  });
});
//   CHAT GPT GUIDE with function check duplicated username
// try {
//     const collection = db.collection("userData");
//     const { username, password, firstName, lastName } = req.body;

//     // Check if the user already exists with the provided username
//     const existingUser = await collection.findOne({ username });

//     if (existingUser) {
//       return res.status(409).json({
//         message: "Username already exists",
//       });
//     }

//     // Hash the password using bcrypt
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user object with the hashed password
//     const newUser = {
//       username,
//       password: hashedPassword,
//       firstName,
//       lastName,
//     };

//     // Insert the new user into the database
//     await collection.insertOne(newUser);

//     return res.json({
//       message: "User has been created successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// });

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  const user = await db.collection("usersData").findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.status(401).json({
      message: "password not valid",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "900000",
    }
  );

  return res.json({
    message: "login successfully",
    token,
  });
});

export default authRouter;
