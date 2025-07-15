import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Bouton Menu Mobile */}
      <div className="d-md-none p-2 bg-light border-bottom">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰ Menu
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "d-flex" : "d-none"
        } d-md-flex flex-column p-3 ${darkMode ? "bg-dark text-light" : "bg-light"}`}
        style={{ width: "100%", maxWidth: "250px", minHeight: "100vh" }}
      >
        <a href="/" className="d-flex align-items-center mb-3 text-decoration-none">
          <span className="fs-4 fw-bold">Page Admin Prince</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a href="/AdminAccueil" className="nav-link active">
              <i className="bi bi-house-door me-2"></i> Accueil
            </a>
          </li>
          <li>
            <a href="/AjouterProduit" className="nav-link">
              <i className="bi bi-box-seam me-2"></i> Ajouter un produit
            </a>
          </li>
          <li>
            <a href="/ListProduit" className="nav-link">
              <i className="bi bi-pencil-square me-2"></i> Modifier / Supprimer
            </a>
          </li>
          <li>
            <a href="/Modifier" className="nav-link">
              <i className="bi bi-gear me-2"></i> Modifier produit
            </a>
          </li>
          <li>
            <a href="/HistoriqueAdmin" className="nav-link">
              <i className="bi bi-clock-history me-2"></i> Historique commandes
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="nav-link btn btn-link text-start text-danger mt-2"
            >
              <i className="bi bi-box-arrow-right me-2"></i> Se déconnecter
            </button>
          </li>
        </ul>
        <hr />
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="darkModeSwitch"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <label className="form-check-label" htmlFor="darkModeSwitch">
            {darkMode ? "Mode Sombre" : "Mode Clair"}
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h3>Bienvenue Admin Prince Kisunzu Josias</h3>
        <p>Voici le contenu de la table des produits et commandes.</p>
      </div>
    </div>
  );
}
