import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = "your_secret_key"; // store in env

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compareSync(password, hash);

export const generateToken = (userId: number) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET) as { id: number };
