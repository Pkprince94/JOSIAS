import React from 'react';
import { NavLink } from 'react-router-dom';
import '../style.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        {/* <NavLink className="navbar-brand" to="/">MonSite</NavLink> */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="ms-auto d-flex gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-link text-white fw-bold' : 'nav-link text-white'
              }
            >
              Accueil
            </NavLink>

            <NavLink
              to="/connexion"
              className={({ isActive }) =>
                isActive ? 'nav-link text-white fw-bold' : 'nav-link text-white'
              }
            >
              Se connecter
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
