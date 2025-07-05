import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarProduit from './NavBarProduit';
import 'bootstrap/dist/css/bootstrap.min.css';

function Publier() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: 'moto',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct({ ...product, [name]: name === 'image' ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in product) {
      formData.append(key, product[key]);
    }

    const res = await fetch('http://Application_web_boutique_de_moto/models/Publier.php', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
    if (res.ok) {
      navigate('/admin/products');
    }
  };

  return (
    <>
      <NavBarProduit />
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow-lg p-4" style={{ width: '30rem' }}>
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Publier un produit</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="nom" className="form-label">Nom du produit</label>
                <input type="text" name="nom" id="nom" className="form-control" placeholder="Nom" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea name="description" id="description" className="form-control" placeholder="Description" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="prix" className="form-label">Prix</label>
                <input type="number" name="prix" id="prix" className="form-control" placeholder="Prix" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="categorie" className="form-label">Catégorie</label>
                <select name="categorie" id="categorie" className="form-select" onChange={handleChange}>
                  <option value="moto">Moto</option>
                  <option value="piece">Pièce</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">Image</label>
                <input type="file" name="image" id="image" className="form-control" onChange={handleChange} required />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Publier</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Publier;
