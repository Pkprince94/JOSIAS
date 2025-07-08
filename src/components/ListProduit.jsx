import React, { useEffect, useState } from 'react';
import NavSlide from './NavSlide';
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ListProduit() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Vérification du rôle admin
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "admin") {
      // navigate("/"); // tu peux rediriger si besoin
    }
  }, [navigate]);

  const fetchProduits = async () => {
    try {
      const res = await fetch('https://princekismotoshop.alwaysdata.net/models/Affichep.php');
      const json = await res.json();
      if (json.success) {
        setProduits(json.data);
      } else {
        alert('Erreur récupération produits');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau : ' + err.message);
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
      const res = await fetch('https://princekismotoshop.alwaysdata.net/models/Supprimer.php', {
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
    } catch (err) {
      console.error(err);
      alert('Erreur réseau : ' + err.message);
    }
  };

  if (loading) return <div className="text-center my-4">Chargement...</div>;

  return (
    <>
      <NavSlide />

      <div className="container mt-4">
        <h2 className="mb-4">Liste des produits</h2>
        {produits.length === 0 ? (
          <p>Aucun produit trouvé.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Prix (Fc)</th>
                  <th>Catégorie</th>
                  <th>Quantité</th>
                  <th>Photo</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {produits.map(({ id, nom, description, prix, categorie, photo, quantite_stock }) => (
                  <tr key={id}>
                    <td>{nom}</td>
                    <td>{description}</td>
                    <td>{Number(prix).toFixed(0)}</td>
                    <td>{categorie}</td>
                    <td>{quantite_stock}</td>
                    <td>
                      {photo ? (
                        <img
                          src={`https://princekismotoshop.alwaysdata.net/photo/${photo}`}
                          alt={nom}
                          style={{ width: '60px', height: 'auto' }}
                        />
                      ) : (
                        'Aucune'
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        title="Modifier"
                        onClick={() => navigate(`/modifier/${id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Supprimer"
                        onClick={() => handleDelete(id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
