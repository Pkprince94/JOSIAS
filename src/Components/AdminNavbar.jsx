import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand" to="/admin">Espace Admin et L'Utilisateur</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar" aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto">


             <li className="nav-item">
              <NavLink
                to="/Registre"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                Utilisateur
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Connexion"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                Admin
              </NavLink>
            </li>
           
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
