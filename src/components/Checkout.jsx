import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getCart, clearCart } from '../utils/cart';

const Checkout = () => {
  const [cart, setCart] = useState(getCart());
  const [adresse, setAdresse] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const utilisateurStr = sessionStorage.getItem('utilisateur');
    if (!utilisateurStr) {
      alert('Veuillez vous connecter pour payer.');
      navigate('/connexion');
      return;
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const utilisateurStr = sessionStorage.getItem('utilisateur');
    if (!utilisateurStr) {
      alert('Veuillez vous connecter.');
      navigate('/connexion');
      return;
    }
    const utilisateur = JSON.parse(utilisateurStr);

    if (cart.length === 0) {
      alert('Panier vide.');
      navigate('/afficher');
      return;
    }

    setLoading(true);

    try {
      for (const item of cart) {
        const commande = {
          user_id: utilisateur.id,
          produit_id: item.id,
          nom_client: utilisateur.nom,
          adresse,
          quantite: Number(item.quantite),
        };

        const res = await fetch('https://princekismotoshop.alwaysdata.net/models/commande.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commande),
        });

        const texte = await res.text();
        try {
          const data = JSON.parse(texte);
          if (!data.success) {
            throw new Error(data.message || 'Erreur lors de la commande');
          }
        } catch (err) {
          console.error('Erreur réponse commande pour', item, err);
          throw err;
        }
      }

      clearCart();
      alert('Commande(s) envoyée(s) avec succès !');
      navigate('/histoire');
    } catch (err) {
      console.error('Erreur lors du paiement :', err);
      alert('Erreur lors du paiement : ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4">Informations de paiement</h2>

        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <div className="mx-auto" style={{ maxWidth: 600 }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Adresse de livraison</label>
                <textarea className="form-control" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Récapitulatif</label>
                <ul className="list-group mb-3">
                  {cart.map((it) => (
                    <li key={it.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{it.nom} x {it.quantite}</span>
                      <strong>{(Number(it.prix) * Number(it.quantite)).toFixed(0)} $</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="btn btn-success" disabled={loading}>{loading ? 'Envoi...' : 'Payer et valider la commande'}</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
