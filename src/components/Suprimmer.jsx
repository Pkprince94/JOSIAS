import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // pour rediriger

function ProductList() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduits() {
      try {
        const response = await fetch("https://princekismotoshop.alwaysdata.net/models/Affichep.php", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Rediriger vers la page de connexion
            alert("Accès refusé. Veuillez vous connecter.");
            navigate("/connexion");
            return;
          }
          console.error("Erreur HTTP :", response.status);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setProduits(data);
        } else if (data.success === false && data.message?.includes("non autorisé")) {
          // Cas où le backend répond JSON, mais avec accès refusé
          alert("Accès refusé. Veuillez vous connecter.");
          navigate("/connexion");
        } else {
          console.error("Format de données inattendu :", data);
        }
      } catch (err) {
        console.error("Erreur de récupération des produits :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduits();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Confirmer la suppression du produit ?");
    if (!confirmation) return;

    try {
      const response = await fetch("https://princekismotoshop.alwaysdata.net/models/suppression.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      alert(result.message);

      if (result.success) {
        setProduits(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Erreur de suppression :", err);
    }
  };

  return (
    <div>
      <h2>Liste des Produits</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : produits.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        produits.map(prod => (
          <div key={prod.id}>
            <h3>{prod.nom}</h3>
            <p>{prod.description}</p>
            {prod.photo && (
              <img
                src={`https://princekismotoshop.alwaysdata.net/photo/${prod.photo}`}
                width="100"
                alt={prod.nom}
              />
            )}
            <p>Prix: {prod.prix} €</p>
            <button onClick={() => handleDelete(prod.id)}>Supprimer</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductList;
