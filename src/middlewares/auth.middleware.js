import { prisma } from "../config/db.js";
import { verifyToken } from "../utils/jwt.util.js";

const authMiddleware = async (req, res, next) => {
  let token;

  const reqAuth = req.headers.authorization;
  if (reqAuth && reqAuth.startsWith("Bearer")) {
    token = reqAuth.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      message: "User is unauthorized",
    });
  }

  try {
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded["id"] },
    });

    if (!user) {
      return res.status(401).json({
        message: "User is unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "User is unauthorized",
    });
  }
};
