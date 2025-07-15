import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NavSlide() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  }, [darkMode]);

  const handleLogout = () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmed) {
      sessionStorage.removeItem("utilisateur");
      sessionStorage.removeItem("role");
      navigate("/");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-light border-end ${showSidebar ? "d-block" : "d-none"} d-md-block`}
        style={{ width: "250px", minHeight: "100vh", position: "fixed", top: 0, left: 0, zIndex: 1000 }}
      >
        <div className="p-3">
          <h4 className="text-primary fw-bold mb-4 text-center">Page Admin Prince</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a href="/AdminAccueil" className="nav-link text-dark">
                🏠 Accueil
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="/AjouterProduit" className="nav-link text-dark">
                ➕ Ajouter un produit
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="/ListProduit" className="nav-link text-dark">
                🛠️ Modifier / Supprimer
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="/HistoriqueAdmin" className="nav-link text-dark">
                📜 Historique commandes
              </a>
            </li>
            <li className="nav-item mt-3">
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger w-100"
              >
                🔓 Se déconnecter
              </button>
            </li>
          </ul>

          <hr />
          <div className="form-check form-switch d-flex align-items-center">
            <input
              className="form-check-input me-2"
              type="checkbox"
              id="darkModeSwitch"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <label className="form-check-label" htmlFor="darkModeSwitch">
              {darkMode ? "🌙 Sombre" : "☀️ Clair"}
            </label>
          </div>
        </div>
      </div>

      {/* Topbar Mobile */}
      <div className="d-md-none bg-light w-100 p-2 border-bottom" style={{ position: "fixed", top: 0, zIndex: 1040 }}>
        <button className="btn btn-outline-secondary" onClick={() => setShowSidebar(!showSidebar)}>
          ☰ Menu
        </button>
      </div>

      {/* Main content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: window.innerWidth >= 768 ? "250px" : "0",
          padding: "20px",
          paddingTop: window.innerWidth < 768 ? "60px" : "20px",
        }}
      >
        <h3 className="text-center text-md-start mb-3">Bienvenue Admin Prince Kisunzu Josias</h3>
        <p className="text-center text-md-start">Voici le contenu de la table des produits et commandes.</p>
      </div>
    </div>
  );
}
