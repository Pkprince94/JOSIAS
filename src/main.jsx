import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'aos/dist/aos.css';

// ✅ Import de ton CSS global
import './style.css'; // assure-toi que ce fichier est bien dans /src/

// ✅ Import de Bootstrap Icons si tu utilises les classes "bi bi-..."
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
