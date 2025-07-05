import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBarProduit() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container">
        <NavLink className="navbar-brand" to="/admin">Espace Admin</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar" aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                to="/publier"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
              Publier Produit
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/afficher"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
               Afficher Produits
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBarProduit;
