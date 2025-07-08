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

        const utilisateur = JSON.parse(utilisateurStr);
        if (utilisateur.role !== "admin") {
            alert("Accès réservé aux administrateurs.");
            navigate("/connexion");
            return;
        }

        // ✅ Remplacer ici le lien local par le lien d’hébergement
        fetch("https://princekismotoshop.alwaysdata.net/models/AdminRegardderCommande.php", {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setCommandes(data.commandes);
            } else {
                setErreur(data.message || "Erreur inconnue");
            }
            setLoading(false);
        })
        .catch((err) => {
            setErreur("Erreur réseau ou serveur : " + err.message);
            setLoading(false);
        });
    }, [navigate]);

    return (
        <>
            <NavSlide />
            <div className="container mt-4">
                <h4 className="text-center mb-3">Historique complet des commandes (admin)</h4>

                {loading ? (
                    <p className="text-center">Chargement en cours...</p>
                ) : erreur ? (
                    <div className="alert alert-danger text-center">{erreur}</div>
                ) : commandes.length === 0 ? (
                    <p className="text-center">Aucune commande enregistrée.</p>
                ) : (
                    <div className="d-flex justify-content-center">
                        <div style={{ width: '100%', maxWidth: '950px' }}>
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered table-striped align-middle text-center">
                                    <thead className="table-light">
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
                                            <tr key={cmd.id}>
                                                <td>{index + 1}</td>
                                                <td>{cmd.nom_utilisateur}</td>
                                                <td>{cmd.email}</td>
                                                <td>{cmd.nom_produit}</td>
                                                <td>{cmd.quantite}</td>
                                                <td>{cmd.adresse}</td>
                                                <td>{new Date(cmd.date_commande).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default HistoriqueAdmin;
