import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getCart, clearCart, getTotalPrice } from '../utils/cart';

const Checkout = () => {
  const [cart] = useState(getCart());
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const utilisateur = sessionStorage.getItem('utilisateur');
    if (!utilisateur) {
      alert('Veuillez vous connecter pour payer.');
      navigate('/Connexion');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Panier vide.');
      return;
    }

    const utilisateur = JSON.parse(sessionStorage.getItem('utilisateur'));
    setLoading(true);

    try {
      const res = await fetch(
        'https://princekismotoshop.alwaysdata.net/models/createCheckout.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            montant: getTotalPrice().toFixed(0),
            devise: 'USD',
          }),
        }
      );

      const data = await res.json();

      if (!data.success || !data.checkoutUrl) {
        throw new Error(data.message || 'Erreur de paiement');
      }

      clearCart();

      window.location.href = data.checkoutUrl;

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2>Informations de paiement</h2>

        <form onSubmit={handleSubmit}>

          <button
            className="btn btn-success w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Redirection...' : 'Payer'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Checkout;
