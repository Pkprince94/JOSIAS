import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Registre from './components/Registre';
import Publier from './components/Publier';
import Afficher from './components/Afficher';
import AjouterProduit from './components/AjouterProduit';
import ListProduit from './components/ListProduit';
import Modifier from './components/Modifier';
import Commande from './components/Commande';
import PrivateRouteUtilisateur from './components/PrivateRouteUtilisateur';
import Connexion from './components/Connexion';
import HistoriqueAdmin from './components/HistoriqueAdmin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/registre" element={<Registre />} />
        <Route path="/publier" element={<Publier />} />
        <Route path="/afficher" element={<Afficher />} />
        <Route path="/ajouterproduit" element={<AjouterProduit />} />
        <Route path="/listproduit" element={<ListProduit />} />
        <Route path="/modifier/:id" element={<Modifier />} />
        <Route path="/historiqueadmin" element={<HistoriqueAdmin />} />

        {/* Route protégée */}
        <Route
          path="/commande"
          element={
            <PrivateRouteUtilisateur>
              <Commande />
            </PrivateRouteUtilisateur>
          }
        />

        {/* Optionnel : alias avec majuscules (pas recommandé) */}
        {/* <Route path="/Afficher" element={<Afficher />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
