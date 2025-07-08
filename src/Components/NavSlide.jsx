import React, { useState, useEffect } from "react";
import '../style.css';

export default function NavSlide() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  }, [darkMode]);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`d-flex flex-column flex-shrink-0 p-3 ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}
        style={{ width: '250px', height: '100vh', position: 'fixed' }}
      >
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none">
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
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h3>Bienvenue Admin Prince Kisunzu Josias</h3>
        <p>Voici le contenu de la table des produits et commandes.</p>
      </div>
    </div>
  );
}
