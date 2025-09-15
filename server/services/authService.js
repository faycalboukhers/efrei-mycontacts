import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const registerUser = async ({ username, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });
  return await newUser.save();
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("Utilisateur non trouvé", 404);

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new ApiError("Mot de passe incorrect", 400);

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};