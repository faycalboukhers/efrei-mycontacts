import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contacts.js";
import { setupSwagger } from "./swagger.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import cors from "cors";




dotenv.config();
const app = express();
app.use(express.json());

// Autoriser les requêtes depuis ton frontend React
app.use(cors({ origin: "http://localhost:3000" })); 

// -- connexion MongoDb Atlas
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Cool on est Connecté à la BDD!"))
    .catch((err) => console.error("RIP pour la connexion BDD..", err));


// -- route
app.get("/",(req,res)=>{ res.send("Reçu 5 sur 5")});
app.use("/auth", authRoutes);
app.use("/contacts", contactRoutes);

// après toutes les routes
app.use(errorHandler);

// Swagger
setupSwagger(app);

// -- lancer le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));

// Commande
// node server.js : lancer le serveur

// Test avec curl
// curl -X POST http://localhost:5000/auth/register \
// -H "Content-Type: application/json" \
// -d '{"username":"JohnDoe","email":"john@example.com","password":"123456"}'

// curl -X POST http://localhost:5000/auth/login \
// -H "Content-Type: application/json" \
// -d '{"email":"john@example.com","password":"123456"}'

// curl -X GET http://localhost:5000/contacts \
// -H "Authorization: Bearer <JWT_TOKEN>"