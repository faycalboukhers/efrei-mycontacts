import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- REGISTER ---
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès", user: savedUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier utilisateur
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        // Vérifier mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Mot de passe incorrect" });

        // Générer token JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Connexion réussie", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};