import React, { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(product.likes || 0);
  const [dislikes, setDislikes] = useState(product.dislikes || 0);

  const handleCommanderClick = () => {
    const utilisateurStr = sessionStorage.getItem("utilisateur");

    console.log("👤 Session utilisateur avant commande:", utilisateurStr);
    sessionStorage.setItem("produit_a_commander", JSON.stringify(product));

    if (!utilisateurStr) {
      alert("Veuillez vous connecter pour passer une commande.");
      navigate("/connexion");
      return;
    }

    const utilisateur = JSON.parse(utilisateurStr);

    if (utilisateur.role === "utilisateur") {
      navigate("/commande", { state: { produit: product } });
    } else {
      alert("Seuls les utilisateurs peuvent commander.");
    }
  };

  const handleVote = async (type) => {
    const utilisateur = JSON.parse(sessionStorage.getItem("utilisateur"));
    if (!utilisateur) {
      alert("Connectez-vous pour voter");
      return;
    }

    try {
      const url = "https://princekismotoshop.alwaysdata.net/models/LikeDislike.php";
      console.log("📤 Envoi du vote à :", url);
      console.log("📝 Payload :", { produit_id: product.id, type });
      //  la page
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produit_id: product.id, type }),
      });
     
      console.log("📥 Status HTTP:", res.status);
      const data = await res.json();
      console.log("📥 Données reçues:", data);

      if (data.success) {
        setLikes(data.stats.likes);
        setDislikes(data.stats.dislikes);
      } else {
        alert(data.message || "Erreur lors du vote");
      }
    } catch (err) {
      console.error(" Erreur réseau ou serveur:", err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="card shadow-sm mb-4" style={{ width: "18rem" }}>
      <img
        src={
          product.photo?.startsWith("http")
            ? product.photo
            : `https://princekismotoshop.alwaysdata.net/photo/${product.photo}`
        }
        className="card-img-top"
        alt={product.nom}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{product.nom}</h5>
        </div>
        <p className="text-muted mb-1">
          <strong>Catégorie :</strong> {product.categorie}
        </p>
        <p className="card-text" style={{ fontSize: "0.9rem" }}>
          {product.description}
        </p>
        <p className="fw-bold text-primary">{parseFloat(product.prix).toFixed(0)} Fc</p>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <button onClick={() => handleVote("like")} className="btn btn-sm btn-outline-primary">
            <ThumbsUp size={16} /> {likes}
          </button>
          <button onClick={() => handleVote("dislike")} className="btn btn-sm btn-outline-danger">
            <ThumbsDown size={16} /> {dislikes}
          </button>
        </div>

        <button className="btn btn-outline-success btn-sm w-100" onClick={handleCommanderClick}>
          Commander
        </button>
      </div>
    </div>
  );
};

const Afficher = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "https://princekismotoshop.alwaysdata.net/models/Affichep.php";
    console.log("🔄 Chargement des produits depuis :", url);

    fetch(url)
      .then((res) => {
        console.log("📡 Status HTTP Produits :", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("📦 Produits reçus :", data);
        if (data.success) {
          setProducts(data.data);
        } else {
          alert("Erreur lors du chargement des produits.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Erreur lors du chargement des produits :", err);
        alert("Erreur de chargement.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center mb-5">Nos Produits</h1>

        {loading ? (
          <p className="text-center">Chargement en cours...</p>
        ) : products.length === 0 ? (
          <p className="text-center">Aucun produit disponible.</p>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div
                key={product.id}
                className="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Afficher;
