import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../style.css';
import { getTotalCount } from '../utils/cart';
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const [count, setCount] = useState(getTotalCount());

  useEffect(() => {
    const onStorage = () => setCount(getTotalCount());
    window.addEventListener('storage', onStorage);
    // also update on mount
    setCount(getTotalCount());
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
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
          <div className="ms-auto d-flex gap-3 align-items-center">
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

            <NavLink
              to="/panier"
              className={({ isActive }) =>
                isActive ? 'nav-link text-white fw-bold d-flex align-items-center gap-2' : 'nav-link text-white d-flex align-items-center gap-2'
              }
            >
              <ShoppingCart size={20} />
              Panier ({count})
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
