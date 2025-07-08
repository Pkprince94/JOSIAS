import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavSlide from "./NavSlide";

const AjouterProduit = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        if (role !== "admin") {
            // navigate("/");
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        nom: "",
        description: "",
        prix: "",
        categorie: "moto",
        photo: null,
        quantite_stock: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
        if (!formData.nom) newErrors.nom = "Le nom du produit est obligatoire.";
        if (!formData.prix) {
            newErrors.prix = "Le prix est obligatoire.";
        } else if (isNaN(parseFloat(formData.prix)) || parseFloat(formData.prix) <= 0) {
            newErrors.prix = "Le prix doit être un nombre positif.";
        }
        if (formData.quantite_stock === "" || isNaN(formData.quantite_stock) || parseInt(formData.quantite_stock) < 0) {
            newErrors.quantite_stock = "La quantité doit être un nombre entier positif.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const data = new FormData();
        data.append("nom", formData.nom);
        data.append("description", formData.description);
        data.append("prix", formData.prix);
        data.append("categorie", formData.categorie);
        data.append("quantite_stock", formData.quantite_stock);
        if (formData.photo) {
            data.append("photo", formData.photo);
        }

        try {
            const res = await fetch("https://princekismotoshop.alwaysdata.net/models/Ajoute.php", {
                method: "POST",
                body: data,
            });
            const result = await res.json();
            if (result.success) {
                alert("Produit ajouté avec succès !");
                setFormData({
                    nom: "",
                    description: "",
                    prix: "",
                    categorie: "moto",
                    photo: null,
                    quantite_stock: "",
                });
                setErrors({});
            } else {
                alert("Erreur : " + result.message);
            }
        } catch (err) {
            console.error("Erreur réseau :", err);
            alert("Erreur réseau ou serveur. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavSlide />
            <div className="container my-5" style={{ maxWidth: "500px" }}>
                <h2 className="mb-4 text-center">Ajouter un produit</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nom" className="form-label">Nom :</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            className="form-control"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                        />
                        {errors.nom && <div className="text-danger">{errors.nom}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description :</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="prix" className="form-label">Prix (Fc) :</label>
                        <input
                            type="number"
                            step="0.01"
                            id="prix"
                            name="prix"
                            className="form-control"
                            value={formData.prix}
                            onChange={handleChange}
                            required
                        />
                        {errors.prix && <div className="text-danger">{errors.prix}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="quantite_stock" className="form-label">Quantité en stock :</label>
                        <input
                            type="number"
                            id="quantite_stock"
                            name="quantite_stock"
                            className="form-control"
                            value={formData.quantite_stock}
                            onChange={handleChange}
                            required
                        />
                        {errors.quantite_stock && <div className="text-danger">{errors.quantite_stock}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="categorie" className="form-label">Catégorie :</label>
                        <select
                            id="categorie"
                            name="categorie"
                            className="form-select"
                            value={formData.categorie}
                            onChange={handleChange}
                            required
                        >
                            <option value="moto">Moto</option>
                            <option value="piece">Pièce</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="photo" className="form-label">Photo :</label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            className="form-control"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Ajout en cours..." : "Ajouter"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default AjouterProduit;
