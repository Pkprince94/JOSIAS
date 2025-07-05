import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavSlide from "./NavSlide";

const Modifier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "moto",
    quantite_stock: "",
    photo: null,
    anciennePhoto: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Vérification du rôle admin (une seule fois)
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "admin") {
      // alert("Accès refusé : vous n'êtes pas admin");
      // navigate("/");
    }
  }, [navigate]);

  // ✅ Chargement des données du produit
  useEffect(() => {
    fetch(`http://localhost/Application_web_boutique_de_moto/models/Affichep.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const produit = data.data;
          setFormData({
            nom: produit.nom,
            description: produit.description,
            prix: produit.prix,
            categorie: produit.categorie,
            quantite_stock: produit.quantite_stock,
            photo: null,
            anciennePhoto: produit.photo,
          });
        } else {
          alert("Erreur : produit introuvable");
          navigate("/");
        }
      })
      .catch(err => {
        console.error("Erreur de chargement :", err);
        alert("Erreur lors du chargement des données.");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.nom) newErrors.nom = "Le nom est requis.";
    if (!formData.prix || isNaN(formData.prix) || parseFloat(formData.prix) <= 0)
      newErrors.prix = "Prix invalide.";
    if (formData.quantite_stock === "" || isNaN(formData.quantite_stock) || parseInt(formData.quantite_stock) < 0)
      newErrors.quantite_stock = "Quantité invalide.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const data = new FormData();
    data.append("id", id);
    data.append("nom", formData.nom);
    data.append("description", formData.description);
    data.append("prix", formData.prix);
    data.append("categorie", formData.categorie);
    data.append("quantite_stock", formData.quantite_stock);
    data.append("anciennePhoto", formData.anciennePhoto);
    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    try {
      const res = await fetch("http://localhost/Application_web_boutique_de_moto/models/Modifier.php", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        alert("Produit modifié avec succès !");
        navigate("/ListProduit");
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavSlide />
      <div className="container my-5" style={{ maxWidth: "600px" }}>
        <h2 className="mb-4 text-center">Modifier un produit</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom :</label>
            <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} />
            {errors.nom && <div className="text-danger">{errors.nom}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Description :</label>
            <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Prix (Fc) :</label>
            <input type="number" name="prix" className="form-control" value={formData.prix} onChange={handleChange} />
            {errors.prix && <div className="text-danger">{errors.prix}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Quantité en stock :</label>
            <input type="number" name="quantite_stock" className="form-control" value={formData.quantite_stock} onChange={handleChange} />
            {errors.quantite_stock && <div className="text-danger">{errors.quantite_stock}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Catégorie :</label>
            <select name="categorie" className="form-select" value={formData.categorie} onChange={handleChange}>
              <option value="moto">Moto</option>
              <option value="piece">Pièce</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Changer la photo :</label>
            <input type="file" name="photo" className="form-control" onChange={handleChange} />
            {formData.anciennePhoto && (
              <div className="mt-2">
                <img
                  src={`http://localhost/Application_web_boutique_de_moto/photo/${formData.anciennePhoto}`}
                  alt="Photo actuelle"
                  style={{ width: "100px", height: "auto" }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-warning w-100 mb-2" disabled={loading}>
            {loading ? "Modification..." : "Modifier"}
          </button>

          <button
            type="button"
            className="btn btn-secondary w-100"
            onClick={() => navigate("/admin/produits")}
          >
            Annuler / Retour
          </button>
        </form>
      </div>
    </>
  );
};

export default Modifier;
