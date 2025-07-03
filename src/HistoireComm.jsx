import React, { useEffect, useState } from 'react';

const Historique = () => {
    const [commandes, setCommandes] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Application_web_boutique_de_moto/models/getHistoriqueCommandes.php", {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => setCommandes(data));
    }, []);

    return (
        <div>
            <h2>🕓 Historique de vos commandes</h2>
            {commandes.length === 0 ? (
                <p>Vous n'avez encore passé aucune commande.</p>
            ) : (
                <ul>
                    {commandes.map(cmd => (
                        <li key={cmd.id}>
                            Produit : <strong>{cmd.nom_produit}</strong><br />
                            Quantité : {cmd.quantite}<br />
                            Commandé le : {new Date(cmd.date_commande).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Historique;
