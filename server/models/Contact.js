import mongoose from "mongoose";

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
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;