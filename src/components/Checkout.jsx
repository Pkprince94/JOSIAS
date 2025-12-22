import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getCart, clearCart, getTotalPrice } from '../utils/cart';

const Checkout = () => {
  const [cart] = useState(getCart());
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    try {
      // Récupération montant
      const montant = getTotalPrice().toFixed(0);
      const devise = 'USD';

      // Nettoyage panier avant redirection
      clearCart();

      // 🔥 REDIRECTION DIRECTE VERS createCheckout.php
      // Le serveur affichera directement la page de paiement
      window.location.href = `https://princekismotoshop.alwaysdata.net/models/createCheckout.php?montant=${montant}&devise=${devise}`;

    } catch (error) {
      console.error('Erreur paiement :', error);
      alert(error.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="mb-4">Paiement</h2>

        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? 'Redirection vers paiement...' : 'Payer'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Checkout;
