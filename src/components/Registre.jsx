
import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';

const Registre = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: ''
  });
// lll
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost/api/client.api.php?action=inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    alert(result.message);
    if (result.success) {
      setFormData({ nom: '', email: '', telephone: '', adresse: '' });
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Inscription Client</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nom" className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="telephone" className="form-label">Téléphone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="adresse" className="form-label">Adresse</label>
                  <textarea
                    className="form-control"
                    id="adresse"
                    name="adresse"
                    rows="3"
                    value={formData.adresse}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-25">S'inscrire</button>
                 
                <button type="submit" className="btn btn-secondary w-25">Se connecter</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Registre;

