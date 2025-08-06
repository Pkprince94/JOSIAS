import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavSlide from './NavSlide';
import 'bootstrap/dist/css/bootstrap.min.css';

const HistoriqueAdmin = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const utilisateurStr = sessionStorage.getItem("utilisateur");

    if (!utilisateurStr) {
      alert("Veuillez vous connecter en tant qu'administrateur.");
      navigate("/connexion");
      return;
    }

    let utilisateur;
    try {
      utilisateur = JSON.parse(utilisateurStr);
    } catch (e) {
      sessionStorage.removeItem("utilisateur");
      alert("Session utilisateur invalide. Veuillez vous reconnecter.");
      navigate("/connexion");
      return;
    }

    if (utilisateur.role !== "admin") {
      alert("Accès réservé aux administrateurs.");
      navigate("/connexion");
      return;
    }

    fetch("https://princekismotoshop.alwaysdata.net/models/AdminRegardderCommande.php", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Erreur " + res.status);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setCommandes(data.commandes || []);
        } else {
          setErreur(data.message || "Erreur inconnue.");
        }
      })
      .catch(err => {
        setErreur("Erreur réseau ou serveur : " + err.message);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      <NavSlide />
      <div className="container-fluid mt-4">
        <h4 className="text-center mb-4">Historique complet des commandes (admin)</h4>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" />
            <p>Chargement en cours...</p>
          </div>
        ) : erreur ? (
          <div className="alert alert-danger text-center">{erreur}</div>
        ) : commandes.length === 0 ? (
          <p className="text-center">Aucune commande enregistrée.</p>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped table-hover text-nowrap">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Produit</th>
                  <th>Qté</th>
                  <th>Adresse</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {commandes.map((cmd, index) => (
                  <tr key={cmd.id || index}>
                    <td>{index + 1}</td>
                    <td>{cmd.nom_utilisateur || "N/A"}</td>
                    <td>{cmd.email || "N/A"}</td>
                    <td>{cmd.nom_produit || "N/A"}</td>
                    <td>{cmd.quantite ?? "N/A"}</td>
                    <td>{cmd.adresse || "N/A"}</td>
                    <td>{cmd.date_commande ? new Date(cmd.date_commande).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoriqueAdmin;
