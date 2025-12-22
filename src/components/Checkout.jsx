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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      alert('Panier vide.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://princekismotoshop.alwaysdata.net/models/createCheckout.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            montant: getTotalPrice().toFixed(0),
            devise: 'USD',
          }),
        }
      );

      // Toujours lire la réponse
      const data = await response.json();
      console.log('Réponse MaishaPay :', data);

      // Recherche universelle de l’URL de paiement
      const checkoutUrl =
        data.checkoutUrl ||
        data.paymentUrl ||
        data.data?.checkoutUrl ||
        data.data?.paymentUrl;

      if (!checkoutUrl) {
        throw new Error('URL de paiement introuvable');
      }

      // Nettoyage panier
      clearCart();

      // REDIRECTION VERS MAISHAPAY
      window.location.href = checkoutUrl;

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
