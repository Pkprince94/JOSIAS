import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Commande = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [utilisateur, setUtilisateur] = useState(null);
  const [produit, setProduit] = useState(null);
  const [adresse, setAdresse] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const utilisateurStr = sessionStorage.getItem("utilisateur");

    if (!utilisateurStr) {
      alert("Veuillez vous connecter !");
      navigate("/connexion");
      return;
    }

    const user = JSON.parse(utilisateurStr);

    if (user.role !== "utilisateur") {
      alert("Seuls les utilisateurs peuvent accéder à cette page.");
      navigate("/afficher");
      return;
    }

    setUtilisateur(user);

    if (location.state && location.state.produit) {
      setProduit(location.state.produit);
    } else {
      const produitStocke = sessionStorage.getItem("produit_a_commander");
      if (produitStocke) {
        setProduit(JSON.parse(produitStocke));
        sessionStorage.removeItem("produit_a_commander");
      } else {
        alert("Aucun produit sélectionné !");
        navigate("/afficher");
      }
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!produit || quantite > produit.quantite_stock) {
      alert(`Quantité invalide. Stock disponible : ${produit?.quantite_stock ?? 0}`);
      return;
    }

    const commande = {
      user_id: utilisateur.id,
      produit_id: produit.id,
      nom_client: utilisateur.nom,
      adresse,
      quantite: Number(quantite),
    };

    console.log("📦 Données envoyées au backend :", commande);
    setLoading(true);

    try {
      const res = await fetch("https://princekismotoshop.alwaysdata.net/models/commande.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commande),
      });

      const texte = await res.text();
      console.log("🧾 Réponse brute :", texte);

      try {
        const data = JSON.parse(texte);
        console.log("✅ JSON reçu :", data);

        if (data.success) {
          alert("Commande envoyée avec succès ! Un e-mail vous a été envoyé.");
          navigate("/afficher");
        } else {
          alert("Erreur : " + data.message);
        }
      } catch (jsonError) {
        console.error("❌ Erreur JSON :", jsonError);
        alert("Erreur : Réponse invalide du serveur. Vérifiez le backend.");
      }
    } catch (err) {
      console.error("🌐 Erreur réseau attrapée :", err);
      alert("Erreur réseau : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Formulaire de commande</h2>

      {utilisateur && produit && (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "500px" }}>
          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input type="text" className="form-control" value={utilisateur.nom} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">Produit</label>
            <input type="text" className="form-control" value={produit.nom} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">Adresse de livraison</label>
            <textarea
              className="form-control"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Quantité (stock disponible : {produit.quantite_stock})
            </label>
            <input
              type="number"
              className="form-control"
              value={quantite}
              min="1"
              max={produit.quantite_stock}
              onChange={(e) => setQuantite(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Envoi en cours..." : "Valider la commande"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/afficher")}>
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Commande;
