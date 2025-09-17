import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
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
      const response = await api.post("/auth/login", formData);
      login(response.data.token);
      showSuccess("Connexion réussie");
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     "Erreur lors de la connexion";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
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
            placeholder="Mot de passe"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      
      <Link to="/register" className="page-link">
        Pas encore de compte ? S'inscrire
      </Link>
    </div>
  );
}