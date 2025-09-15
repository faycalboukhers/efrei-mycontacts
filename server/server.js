import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// -- connexion MongoDb Atlas
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Cool on est Connecté à la BDD!"))
    .catch((err) => console.error("RIP pour la connexion BDD..", err));


// -- route
app.get("/",(req,res)=>{
    res.send("Reçu 5 sur 5")
});

// -- lancer le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));

// Commande
// node server.js : lancer le serveur