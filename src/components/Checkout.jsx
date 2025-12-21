import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getCart, clearCart, getTotalPrice } from '../utils/cart';

const Checkout = () => {
  const [cart, setCart] = useState(getCart());
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
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

    if (!telephone || telephone.trim().length < 6) {
      alert('Veuillez fournir un numéro de téléphone valide.');
      return;
    }

    try {
      for (const item of cart) {
        const commande = {
          user_id: utilisateur.id,
          produit_id: item.id,
          nom_client: utilisateur.nom,
          adresse,
          telephone,
          quantite: Number(item.quantite),
        };

        const res = await fetch('https://marchand.maishapay.online/payment/vers1.0/merchant/checkout', {
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
          <div className="row">
            <div className="col-12 col-md-7 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Adresse de livraison</label>
                      <textarea className="form-control" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <input
                       type="hidden" name="gatewayMode" value="1"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                       type="hidden" name="publicApiKey" value="MP-LIVEPK-FUaorbsYg9LQyPuVWq3/2yelYopZz$3bu2weHuBryyqyPsfN04TvgMr/fNbG7422734Go0pl3cEer$aiQjtDvRs$T4$8u60uwoHX.11OBtc5.jFIF$sdeQ$M"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                       type="hidden" name="secretApiKey" value="MP-LIVESK-bVjCT74T18Ef0QK3$l$TXS1RM4.fuX0JoB9FZehy$aZwGLe3qI.$1NSh61z1.5P/WM$a$sqiKLn1Y.yTm3CxXaXnoX1g7rEHQWAg8d2afFu2ZboIRTbs4FTy"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                       type="hidden" name="montant" value={getTotalPrice().toFixed(0)}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                       type="hidden" name="devise" value="USD"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                       type="hidden" name="callbackUrl" value="https://princekismotoshop.alwaysdata.net/callback.php"
                        className="form-control"
                        required
                      />
                    </div>


                    <div className="d-grid d-md-block">
                      <button className="btn btn-success w-100 w-md-auto" type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Payer et valider la commande'}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-5">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Récapitulatif de la commande</h5>
                  <div className="list-group mb-3">
                    {cart.map((it) => (
                      <div key={it.id} className="list-group-item d-flex justify-content-between align-items-center small">
                        <div>
                          <div className="fw-bold">{it.nom}</div>
                          <div className="text-muted">Quantité: {it.quantite}</div>
                        </div>
                        <div className="text-end">{(Number(it.prix) * Number(it.quantite)).toFixed(0)} $</div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Total</strong>
                    <strong>{getTotalPrice().toFixed(0)} $</strong>

                  </div>
                  
                  <div className="text-muted small">Les frais de livraison seront calculés séparément si applicable.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
