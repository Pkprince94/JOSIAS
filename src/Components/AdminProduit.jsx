import React, { useEffect, useState } from 'react';

const AdminProduits = () => {
  const [produits, setProduits] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    description: '',
    categorie: 'moto',
    image: null,
  });

  const API_BASE = "https://princekismotoshop.alwaysdata.net/api";

  useEffect(() => {
    fetch(`${API_BASE}/produits.api.php?action=afficher`)
      .then(res => res.json())
      .then(data => setProduits(data))
      .catch(err => console.error("Erreur de chargement :", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('nom', formData.nom);
    form.append('prix', formData.prix);
    form.append('description', formData.description);
    form.append('categorie', formData.categorie);
    if (formData.image) form.append('image', formData.image);

    try {
      const res = await fetch(`${API_BASE}/produits.api.php?action=ajouter`, {
        method: 'POST',
        body: form,
      });
      const result = await res.json();
      alert(result.message);

      if (result.success) {
        // Recharger la liste
        const updated = await fetch(`${API_BASE}/produits.api.php?action=afficher`);
        const data = await updated.json();
        setProduits(data);

        setFormData({
          nom: '',
          prix: '',
          description: '',
          categorie: 'moto',
          image: null,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur réseau ou serveur");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Gestion des Produits</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="border p-4 rounded shadow-sm mb-5 bg-light">
        <h4 className="mb-3">Ajouter un produit</h4>

        <div className="mb-3">
          <label className="form-label">Nom du produit</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Prix (€)</label>
          <input
            type="number"
            className="form-control"
            name="prix"
            value={formData.prix}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Catégorie</label>
          <select
            className="form-select"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
          >
            <option value="moto">Moto</option>
            <option value="piece">Pièce</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleChange}
            accept=".png,.jpg,.jpeg,.avif"
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Publier</button>
      </form>

      <h4 className="mb-3">Produits existants</h4>
      <div className="row">
        {produits.map(prod => (
          <div className="col-md-4 mb-4" key={prod.id}>
            <div className="card shadow-sm h-100">
              <img
                src={`https://princekismotoshop.alwaysdata.net/photos/${prod.photo}`}
                className="card-img-top"
                alt={prod.nom}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{prod.nom}</h5>
                <p className="card-text">{prod.description}</p>
                <p className="fw-bold">Prix : {prod.prix} €</p>
                <p className="text-muted">Catégorie : {prod.categorie}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProduits;
