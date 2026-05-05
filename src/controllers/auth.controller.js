import { prisma } from "../config/db.js";
import { hashPassword, isValidPassword } from "../utils/auth.util.js";
import { generateToken } from "../utils/jwt.util.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check if user already exist
  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExist) {
    return res.status(400).json({
      error: "User already exists with the email",
    });
  }

  const newPassword = await hashPassword(password);

  // create new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: newPassword,
    },
  });

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const valid = await isValidPassword(password, user.password);

  if (!valid) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  // generate JWT token
  const token = generateToken(user.id, res);

  return res.status(200).json({
    token: token,
  });
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "User logged out successfully",
  });
};

export { register, login, logout };
