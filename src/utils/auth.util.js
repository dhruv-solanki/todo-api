import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const isValidPassword = async (reqPassword, dbPassword) => {
  return await bcrypt.compare(reqPassword, dbPassword);
};

export { hashPassword, isValidPassword };
