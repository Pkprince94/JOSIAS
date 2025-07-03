import React, { useEffect, useState } from 'react';

function ProductList() {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    fetch("http://localhost/Application_web_boutique_de_moto/models/Supprimer.php")
      .then(res => res.json())
      .then(setProduits)
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Liste des Produits</h2>
      {produits.map(prod => (
        <div key={prod.id}>
          <h3>{prod.nom}</h3>
          <p>{prod.description}</p>
          <img src={`http://localhost/Application_web_boutique_de_moto/image${prod.photo}`} width="100" alt={prod.nom} />
          <p>Prix: {prod.prix} €</p>
          <button onClick={() => handleDelete(prod.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );

  function handleDelete(id) {
    fetch(`http://localhost/backend/produit.api.php?id=${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(result => {
        alert(result.message);
        setProduits(prev => prev.filter(p => p.id !== id));
      });
  }
}
export default ProductList;
