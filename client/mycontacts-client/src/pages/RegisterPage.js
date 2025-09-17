import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Inscription
      await api.post("/auth/register", formData);
      
      // Connexion automatique après inscription
      const loginResponse = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });
      
      login(loginResponse.data.token);
      showSuccess("Compte créé et connecté avec succès");
      
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     "Erreur lors de l'inscription";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe (min. 6 caractères)"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
      
      <Link to="/login" className="page-link">
        Déjà un compte ? Se connecter
      </Link>
    </div>
  );
}