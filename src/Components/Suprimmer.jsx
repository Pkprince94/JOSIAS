import React, { useEffect, useState } from 'react';

function ProductList() {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    // ✅ Appel à ton backend hébergé dans /models/Supprimer.php
    fetch("https://princekismotoshop.alwaysdata.net/models/Supprimer.php")
      .then(res => res.json())
      .then(setProduits)
      .catch(err => console.error("Erreur de récupération des produits :", err));
  }, []);

  function handleDelete(id) {
    // ✅ Appel à ton script de suppression, supposé dans /models/produit.api.php
    fetch(`https://princekismotoshop.alwaysdata.net/models/produit.api.php?id=${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(result => {
        alert(result.message);
        setProduits(prev => prev.filter(p => p.id !== id));
      })
      .catch(err => console.error("Erreur de suppression :", err));
  }

  return (
    <div>
      <h2>Liste des Produits</h2>
      {produits.map(prod => (
        <div key={prod.id}>
          <h3>{prod.nom}</h3>
          <p>{prod.description}</p>
          {/* ✅ Affichage des images depuis /photo/ */}
          <img
            src={`https://princekismotoshop.alwaysdata.net/photo/${prod.photo}`}
            width="100"
            alt={prod.nom}
          />
          <p>Prix: {prod.prix} €</p>
          <button onClick={() => handleDelete(prod.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
