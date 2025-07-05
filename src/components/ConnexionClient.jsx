import React, { useEffect, useState } from 'react';

export default function ListeProduits({ onEdit }) {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduits = async () => {
    try {
      const res = await fetch('http://localhost/Application_web_boutique_de_moto/models/Affichep.php');
      const json = await res.json();
      if (json.success) {
        setProduits(json.data);
      } else {
        alert('Erreur récupération produits');
      }
    } catch {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      const res = await fetch('http://localhost/Application_web_boutique_de_moto/models/Supprimer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        alert('Produit supprimé');
        fetchProduits();
      } else {
        alert('Erreur suppression');
      }
    } catch {
      alert('Erreur réseau');
    }
  };

  if (loading) return <div className="text-center my-4">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h2>Liste des produits</h2>
      {produits.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix (fc)</th>
              <th>Catégorie</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.map(({ id, nom, description, prix, categorie, photo }) => (
              <tr key={id}>
                <td>{nom}</td>
                <td>{description}</td>
                <td>{prix.toFixed(2)}</td>
                <td>{categorie}</td>
                <td>
                  {photo ? (
                    <img
                      src={`http://localhost/Application_web_boutique_de_moto/models${photo}`}
                      alt={nom}
                      style={{ maxWidth: '60px' }}
                    />
                  ) : (
                    'Aucune'
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onEdit(id)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
