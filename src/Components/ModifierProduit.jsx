import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ModifierProduit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: 'moto',
  });

  useEffect(() => {
    fetch(`http://localhost/api/get_product.php?id=${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost/api/update_product.php?id=${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    alert(data.message);
    if (res.ok) {
      navigate('/admin/products');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Modifier le Produit</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" value={product.nom} className="form-control mb-2" onChange={handleChange} required />
        <textarea name="description" value={product.description} className="form-control mb-2" onChange={handleChange} required />
        <input type="number" name="prix" value={product.prix} className="form-control mb-2" onChange={handleChange} required />
        <select name="categorie" value={product.categorie} className="form-control mb-2" onChange={handleChange}>
          <option value="moto">Moto</option>
          <option value="piece">Pièce</option>
        </select>
        <button type="submit" className="btn btn-success">Mettre à jour</button>
      </form>
    </div>
  );
}

export default ModifierProduit;
