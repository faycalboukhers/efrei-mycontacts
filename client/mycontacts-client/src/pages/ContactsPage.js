import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export default function ContactsPage() {
  const { token, logout } = useContext(AuthContext);
  const { showSuccess, showError } = useNotification();
  
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Charger les contacts
  const fetchContacts = async () => {
    try {
      const response = await api.get("/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data);
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     "Erreur lors du chargement";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchContacts();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Modification
        await api.patch(`/contacts/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSuccess("Contact modifié avec succès");
      } else {
        // Création
        await api.post("/contacts", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSuccess("Contact ajouté avec succès");
      }
      
      // Reset du formulaire
      setFormData({ firstName: "", lastName: "", phone: "" });
      setEditingId(null);
      
      // Recharger la liste
      fetchContacts();
      
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     "Erreur lors de l'opération";
      showError(message);
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone
    });
    setEditingId(contact._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      return;
    }
    
    try {
      await api.delete(`/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Contact supprimé avec succès");
      fetchContacts();
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     "Erreur lors de la suppression";
      showError(message);
    }
  };

  const cancelEdit = () => {
    setFormData({ firstName: "", lastName: "", phone: "" });
    setEditingId(null);
  };

  return (
    <div className="glass-card contacts-card">
      <div className="contacts-header">
        <h1>Mes Contacts</h1>
        <button onClick={logout} className="btn-logout">
          Déconnexion
        </button>
      </div>

      {loading ? (
        <div className="loading">Chargement des contacts...</div>
      ) : (
        <>
          {/* Liste des contacts */}
          <div className="contacts-list">
            {contacts.length === 0 ? (
              <div className="empty-state">
                Aucun contact pour le moment. Ajoutez-en un !
              </div>
            ) : (
              contacts.map((contact) => (
                <div key={contact._id} className="contact-item">
                  <div className="contact-info">
                    <div className="contact-name">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="contact-phone">{contact.phone}</div>
                  </div>
                  <div className="contact-actions">
                    <button
                      className="btn-small btn-edit"
                      onClick={() => handleEdit(contact)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(contact._id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Formulaire d'ajout/modification */}
          <div className="add-contact-form">
            <h3 style={{ color: 'white', marginBottom: '20px' }}>
              {editingId ? 'Modifier le contact' : 'Ajouter un contact'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  className="form-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  className="form-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Numéro de téléphone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Modifier' : 'Ajouter'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="btn btn-secondary"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}