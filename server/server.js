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

// Configuration CORS complète
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://prismatic-dieffenbachia-a78b54.netlify.app'] 
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Debug pour vérifier la configuration
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CORS Origin configured for:', corsOptions.origin);

// Gérer les requêtes OPTIONS (preflight)
app.options('*', cors(corsOptions));

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Serveur sur port ${PORT}`));