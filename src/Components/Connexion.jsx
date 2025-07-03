import React, { useState } from 'react';
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

  const [utilisateurConnecte, setUtilisateurConnecte] = useState(() => {
    const ut = sessionStorage.getItem("utilisateur");
    return ut ? JSON.parse(ut) : null;
  });

  const navigate = useNavigate();
  const toggleTheme = () => setDarkMode(!darkMode);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'role' && value === 'admin' && utilisateurConnecte?.role !== 'admin') {
      alert("Seuls les administrateurs peuvent créer un compte administrateur.");
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegister
      ? (formData.role === 'admin'
          ? 'http://localhost/Application_web_boutique_de_moto/models/enregistrement_admin.php'
          : 'http://localhost/Application_web_boutique_de_moto/models/enregistrement_utilisateurs.php')
      : 'http://localhost/Application_web_boutique_de_moto/models/login.php';

    let payload = {
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
    };

    if (isRegister) {
      payload.nom = formData.nom;

      if (formData.role === 'admin') {
        if (utilisateurConnecte?.role !== 'admin') {
          alert("Accès refusé : seul un administrateur peut créer un autre administrateur.");
          return;
        }
        payload.id_admin_connecte = utilisateurConnecte.id;
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("Réponse brute du serveur :", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error("Réponse serveur non valide :\n" + text);
      }

      alert(data.message);

      if (res.ok && data.success) {
        if (!isRegister) {
          const utilisateur = {
            id: data.id,
            email: data.email,
            nom: data.nom,
            role: data.role,
          };
          sessionStorage.setItem("utilisateur", JSON.stringify(utilisateur));
          setUtilisateurConnecte(utilisateur);

          const produitCommande = sessionStorage.getItem("produit_a_commander");
          if (produitCommande && data.role === "utilisateur") {
            const produit = JSON.parse(produitCommande);
            sessionStorage.removeItem("produit_a_commander");
            navigate("/commande", { state: { produit } });
          } else if (data.role === "admin") {
            navigate("/ajouterproduit");
          } else {
            navigate("/afficher");
          }
        } else {
          setIsRegister(false); // Redirige vers la connexion après inscription
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
          <span className="navbar-brand">Boutique moto</span>
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
                <input
                  type="text"
                  name="nom"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                name="mot_de_passe"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            {isRegister && (
              <div className="mb-3">
                <label className="form-label">Rôle</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={utilisateurConnecte?.role !== 'admin'}
                >
                  <option value="utilisateur">Utilisateur</option>
                  {utilisateurConnecte?.role === "admin" && (
                    <option value="admin">Admin</option>
                  )}
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
