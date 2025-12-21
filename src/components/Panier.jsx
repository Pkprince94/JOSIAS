import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateQuantity, getTotalPrice } from '../utils/cart';
import Navbar from './Navbar';
import './Panier.css';

const Panier = () => {
  const [cart, setCart] = useState(getCart());
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleQtyChange = (id, q) => {
    const qty = parseInt(q, 10);
    if (!isNaN(qty) && qty >= 1) {
      updateQuantity(id, qty);
      setCart(getCart());
    }
  };

  const handleCheckout = () => {
    const utilisateurStr = sessionStorage.getItem('utilisateur');
    if (!utilisateurStr) {
      alert('Veuillez vous connecter pour passer au paiement.');
      navigate('/connexion');
      return;
    }
    navigate('/checkout');
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4">Votre Panier</h2>

        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <div>
            <div className="table-responsive">
              <table className="table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Sous-total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="align-middle">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            item.photo?.startsWith('http')
                              ? item.photo
                              : `https://princekismotoshop.alwaysdata.net/photo/${item.photo}`
                          }
                          alt={item.nom}
                          className="cart-img img-fluid"
                          style={{ objectFit: 'cover' }}
                        />
                        <div>{item.nom}</div>
                      </div>
                    </td>
                    <td className="align-middle">{Number(item.prix).toFixed(0)} $</td>
                    <td className="align-middle">
                      <input
                        type="number"
                        min="1"
                        max={item.quantite_stock || 9999}
                        value={item.quantite}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        className="form-control qty-input"
                      />
                    </td>
                    <td className="align-middle">{(Number(item.prix) * Number(item.quantite)).toFixed(0)} $</td>
                    <td className="align-middle">
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
              <h5>Total: {getTotalPrice().toFixed(0)} $</h5>
              <form action="https://marchand.maishapay.online/payment/vers1.0/merchant/checkout" method="POST">
              <input type="hidden" name="gatewayMode" value="1">  
              <input type="hidden" name="publicApiKey" value="MP-LIVEPK-FUaorbsYg9LQyPuVWq3/2yelYopZz$3bu2weHuBryyqyPsfN04TvgMr/fNbG7422734Go0pl3cEer$aiQjtDvRs$T4$8u60uwoHX.11OBtc5.jFIF$sdeQ$M">
              <input type="hidden" name="secretApiKey" value="MP-LIVESK-bVjCT74T18Ef0QK3$l$TXS1RM4.fuX0JoB9FZehy$aZwGLe3qI.$1NSh61z1.5P/WM$a$sqiKLn1Y.yTm3CxXaXnoX1g7rEHQWAg8d2afFu2ZboIRTbs4FTy">
              <input type="hidden" name="montant" value={getTotalPrice().toFixed(0)}>
              <input type="hidden" name="devise" value="USD">
              <input type="hidden" name="callbackUrl" value="">
              <input type="submit" value="Payer">
            </form>
            
              <button className="btn btn-success" onClick={handleCheckout}>
                Passer au paiement
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Panier;
