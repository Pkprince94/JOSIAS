export const CART_KEY = 'panier';

export function getCart() {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erreur lecture panier', e);
    return [];
  }
}

export function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === product.id);
  if (existing) {
    existing.quantite = Math.min((existing.quantite || 0) + qty, product.quantite_stock || 9999);
  } else {
    cart.push({
      id: product.id,
      nom: product.nom,
      prix: product.prix,
      photo: product.photo,
      quantite: Math.min(qty, product.quantite_stock || 9999),
      quantite_stock: product.quantite_stock || 9999,
    });
  }
  saveCart(cart);
  // trigger storage event for same-window listeners
  try {
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart().filter((p) => p.id !== productId);
  saveCart(cart);
  try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  return cart;
}

export function updateQuantity(productId, quantite) {
  const cart = getCart();
  const item = cart.find((p) => p.id === productId);
  if (item) {
    item.quantite = Math.max(1, Math.min(quantite, item.quantite_stock || 9999));
    saveCart(cart);
    try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  }
  return cart;
}

export function clearCart() {
  saveCart([]);
  try { window.dispatchEvent(new Event('storage')); } catch (e) {}
}

export function getTotalCount() {
  const cart = getCart();
  return cart.reduce((s, it) => s + (Number(it.quantite) || 0), 0);
}

export function getTotalPrice() {
  const cart = getCart();
  return cart.reduce((s, it) => s + (Number(it.prix) || 0) * (Number(it.quantite) || 0), 0);
}
