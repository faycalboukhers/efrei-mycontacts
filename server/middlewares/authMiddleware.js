import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Accès refusé" });

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ error: "Token manquant" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // on peut récupérer id et username
        next();
    } catch (err) {
        res.status(403).json({ error: "Token invalide" });
    }
};