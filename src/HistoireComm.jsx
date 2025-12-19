import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Historique = () => {
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://princekismotoshop.alwaysdata.net/models/getHistoriqueCommandes.php", {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            setCommandes(Array.isArray(data) ? data : []);
            setLoading(false);
        })
        .catch(err => {
            console.error('Erreur historique :', err);
            setLoading(false);
        });
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4">🕓 Historique de vos commandes</h2>
            {loading ? (
                <p>Chargement...</p>
            ) : commandes.length === 0 ? (
                <p>Vous n'avez encore passé aucune commande.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Produit</th>
                                <th>Quantité</th>
                                <th>Téléphone</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map(cmd => (
                                <tr key={cmd.id}>
                                    <td className="small">{cmd.nom_produit}</td>
                                    <td>{cmd.quantite}</td>
                                    <td className="small">{cmd.telephone || '—'}</td>
                                    <td className="small">{new Date(cmd.date_commande).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Historique;
