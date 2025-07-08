import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSun, FaMoon } from 'react-icons/fa';

function Connexion() {
  const [darkMode, setDarkMode] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
    nom: '',
    role: 'utilisateur',
  });

  // Stocke l'utilisateur connecté (si existant)
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const ut = sessionStorage.getItem("utilisateur");
    if (ut) setUtilisateurConnecte(JSON.parse(ut));
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Empêcher un utilisateur non admin de choisir admin dans le rôle
    if (name === 'role' && value === 'admin' && (!utilisateurConnecte || utilisateurConnecte.role !== 'admin')) {
      alert("Seuls les administrateurs peuvent créer un compte administrateur.");
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construire la payload selon inscription ou connexion
    let endpoint;
    let payload;

    if (isRegister) {
      if (formData.role === 'admin') {
        // Envoi supplémentaire pour confirmer admin créateur (ex: id_admin_connecte)
        if (!utilisateurConnecte || utilisateurConnecte.role !== 'admin') {
          alert("Accès refusé : seul un administrateur peut créer un autre administrateur.");
          return;
        }
        endpoint = 'http://localhost/Application_web_boutique_de_moto/models/enregistrement_admin.php';
        payload = { ...formData, id_admin_connecte: utilisateurConnecte.id };
      } else {
        endpoint = 'http://localhost/Application_web_boutique_de_moto/models/enregistrement_utilisateurs.php';
        payload = formData;
      }
    } else {
      endpoint = 'http://localhost/Application_web_boutique_de_moto/models/login.php';
      payload = {
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
      };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Réponse serveur invalide : " + text);
      }

      alert(data.message);

      if (res.ok && data.success) {
        if (!isRegister) {
          // Connexion réussie => stocker session et rediriger selon rôle
          const utilisateur = {
            id: data.id,
            email: data.email,
            nom: data.nom,
            role: data.role,
          };
          sessionStorage.setItem("utilisateur", JSON.stringify(utilisateur));
          setUtilisateurConnecte(utilisateur);

          if (utilisateur.role === 'admin') {
            navigate('/AjouterProduit');
          } else {
            navigate('/Afficher');
          }
        } else {
          // Inscription réussie => repasser au formulaire de connexion
          setIsRegister(false);
          setFormData({ email: '', mot_de_passe: '', nom: '', role: 'utilisateur' });
        }
      }
    } catch (err) {
      alert("Erreur serveur : " + err.message);
    }
  };

  return (
    <div className={darkMode ? 'bg-dark text-light min-vh-100' : 'bg-light text-dark min-vh-100'}>
      <nav className={`navbar ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} shadow`}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand">🏍️ Moto Boutique</span>
          <div className="d-flex align-items-center gap-2">
            {darkMode ? <FaMoon /> : <FaSun />}
            <div className="form-check form-switch m-0">
              <input className="form-check-input" type="checkbox" onChange={toggleTheme} checked={darkMode} />
            </div>
          </div>
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
        <div className={`card shadow p-4 ${darkMode ? 'bg-secondary text-light' : 'bg-white text-dark'}`} style={{ width: '30rem' }}>
          <h3 className="text-center mb-4">{isRegister ? 'Créer un compte' : 'Se connecter'}</h3>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-3">
                <label className="form-label">Nom complet</label>
                <input type="text" name="nom" className="form-control" onChange={handleChange} required />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input type="password" name="mot_de_passe" className="form-control" onChange={handleChange} required />
            </div>

            {isRegister && (
              <div className="mb-3">
                <label className="form-label">Rôle</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!utilisateurConnecte || utilisateurConnecte.role !== 'admin'}
                >
                  <option value="utilisateur">Utilisateur</option>
                  {utilisateurConnecte?.role === 'admin' && <option value="admin">Admin</option>}
                </select>
              </div>
            )}

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                {isRegister ? 'Créer un compte' : 'Connexion'}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? 'Déjà inscrit ? Se connecter' : "Pas de compte ? S'inscrire"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
