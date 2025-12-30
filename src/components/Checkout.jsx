import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getCart, clearCart, getTotalPrice } from '../utils/cart';

const Checkout = () => {
  const [cart] = useState(getCart());
  const [loading, setLoading] = useState(false);
  const [adresse, setAdresse] = useState('');
  const [adresseConfirmee, setAdresseConfirmee] = useState(false);
  const navigate = useNavigate();

  // Vérification connexion
  useEffect(() => {
    const utilisateur = sessionStorage.getItem('utilisateur');
    if (!utilisateur) {
      alert('Veuillez vous connecter pour payer.');
      navigate('/Connexion');
    }
  }, [navigate]);

  // Paiement
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      alert('Panier vide.');
      return;
    }

    if (!adresse.trim()) {
      alert('Veuillez entrer une adresse.');
      return;
    }

    setLoading(true);

    try {
      // Récupération montant
      const montant = getTotalPrice().toFixed(0);
      const devise = 'USD';
      const utilisateurStr = sessionStorage.getItem('utilisateur');
      const utilisateur = JSON.parse(utilisateurStr);

      // Envoi de l'adresse et du panier au serveur
      fetch('https://princekismotoshop.alwaysdata.net/models/sauvegarderCommande.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          utilisateur_id: utilisateur.id,
          nom_client: utilisateur.nom,
          adresse: adresse,
          cart: cart
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Nettoyage panier avant redirection
            clearCart();
            window.location.href = `https://princekismotoshop.alwaysdata.net/models/createCheckout.php?montant=${montant}&devise=${devise}`;
          } else {
            alert('Erreur : ' + (data.message || 'Erreur lors de la sauvegarde de l\'adresse'));
            setLoading(false);
          }
        })
        .catch(error => {
          alert('Erreur réseau : ' + error.message);
          setLoading(false);
        });

    } catch (error) {
      console.error('Erreur paiement :', error);
      alert(error.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  // Confirmation adresse
  const handleConfirmAdresse = () => {
    if (!adresse.trim()) {
      alert('Veuillez entrer une adresse.');
      return;
    }
    setAdresseConfirmee(true);
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="mb-4">Paiement</h2>

        {!adresseConfirmee ? (
          <form>
            <div className="mb-3">
              <label className="form-label"><strong>Adresse de livraison</strong></label>
              <textarea
                className="form-control"
                rows="4"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Entrez votre adresse complète..."
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleConfirmAdresse}
            >
              Confirmer l'adresse
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="alert alert-info mb-4">
              <strong>Adresse confirmée :</strong>
              <p className="mb-0 mt-2">{adresse}</p>
              <button
                type="button"
                className="btn btn-sm btn-secondary mt-2"
                onClick={() => setAdresseConfirmee(false)}
              >
                Modifier l'adresse
              </button>
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? 'Redirection vers paiement...' : 'Payer'}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Checkout;
