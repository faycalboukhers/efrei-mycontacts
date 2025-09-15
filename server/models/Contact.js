import mongoose from "mongoose";

// Schéma Contact
const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Le prénom est obligatoire"]
    },
    lastName: {
        type: String,
        required: [true, "Le nom est obligatoire"]
    },
    phone: {
        type: String,
        required: [true, "Le numéro de téléphone est obligatoire"],
        minlength: [10, "Le numéro doit faire au moins 10 caractères"],
        maxlength: [20, "Le numéro doit faire au maximum 20 caractères"]
    }

    // timestamps: true ajoute createdAt et updatedAt automatiquement.
}, { timestamps: true });

// Export du modèle
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;