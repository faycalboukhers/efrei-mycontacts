import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Le nom d'utilisateur est obligatoire"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "L'email est obligatoire"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est obligatoire"],
        minlength: 6
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;