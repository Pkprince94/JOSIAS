// components/PrivateRouteUtilisateur.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouteUtilisateur = ({ children }) => {
  const utilisateurStr = sessionStorage.getItem("utilisateur");

  if (!utilisateurStr) {
    alert("Veuillez vous connecter pour passer une commande.");
    return <Navigate to="/connexion" />;
  }

  const utilisateur = JSON.parse(utilisateurStr);

  if (utilisateur.role !== "utilisateur") {
    alert("Accès refusé. Seuls les utilisateurs peuvent commander.");
    return <Navigate to="/Conn" />;
  }

  return children;
};

export default PrivateRouteUtilisateur;
