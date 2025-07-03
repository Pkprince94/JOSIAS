import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Registre from './Components/Registre';
import Publier from './Components/Publier';
import Afficher from './Components/Afficher';
import AjouterProduit from './Components/AjouterProduit';
import ListProduit from './Components/ListProduit';
import Modifier from './Components/Modifier';
import Commande from './Components/Commande';
import PrivateRouteUtilisateur from './Components/PrivateRouteUtilisateur';
import Connexion from './Components/Connexion';
import HistoriqueAdmin from './HistoriqueAdmin';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="connexion" element={<Connexion />} />
        <Route path="/registre" element={<Registre />} />
        <Route path="/publier" element={<Publier />} />
        <Route path="/afficher" element={<Afficher />} />
        <Route path="/ajouterproduit" element={<AjouterProduit />} />
        <Route path="/listproduit" element={<ListProduit />} />
        <Route path="/modifier/:id" element={<Modifier />} />
        <Route path="/commande" element={<Commande />} />  
        <Route path="/historiqueAdmin" element={<HistoriqueAdmin />} /> 
         
          <Route
          path="/commande"
          element={
            <PrivateRouteUtilisateur>
              <Commande />
            </PrivateRouteUtilisateur>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
