import { registerUser, loginUser } from "../services/authService.js";

// --- REGISTER ---
export const register = async (req, res, next) => {
  try {
    const savedUser = await registerUser(req.body);
    res.status(201).json({ message: "Utilisateur créé avec succès", user: savedUser._id });
  } catch (err) {
    next(err);
  }
};

// --- LOGIN ---
export const login = async (req, res, next) => {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ message: "Connexion réussie", token });
  } catch (err) {
    next(err);
  }
};
