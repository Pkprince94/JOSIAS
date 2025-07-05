import React, { useEffect } from 'react';
import AOS from 'aos';
import Navbar from './Navbar';
import Footer from './Footer';
import '../style.css';

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
// la partie qui me fait trop bosser
  return (

    <div className="Navbar">
      <Navbar/>
    <div className="bg-light py-5">
      <div className="container">
        <div className="row align-items-center mb-5">
          <div className="col-md-6" data-aos="fade-right">
            <h1 className="h">Bienvenue sur <span className="ns">PrinceKisMotoShop</span>-L'univers des passionnes de motos!</h1>
            <div className="PJ">Merci de nous rendre visite ! Explorez notre boutique dediee a la puissance et au style</div>
            <p className="lead">La meilleure boutique en ligne de <strong>motos</strong> et <strong>pièces détachées</strong>.</p>
            <a href="/Afficher" className="btn-kismoto-link">Explorer la boutique</a>

          </div>
          <div className="col-md-6 text-center" data-aos="fade-left">
            <img src="./p2.jpg" className="img-fluid rounded shadow" alt="Moto" />
          </div>
        </div>

        <h2 className="text-center mb-4" data-aos="fade-up">Nos catégories</h2>
        <div className="row">
          <div className="col-md-4 mb-4" data-aos="zoom-in">
            <div className="card h-100 shadow border-0">
              <img src="./2.webp" className="card-img-top" alt="Motos" />
              <div className="card-body">
                <h5 className="card-title">Motos</h5>
                <p className="card-text">Motos neuves et d'occasion à prix imbattables.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="200">
            <div className="card h-100 shadow border-0">
              <img src="./piec.webp" className="card-img-top" alt="Pièces" />
              <div className="card-body">
                <h5 className="card-title">Pièces détachées</h5>
                <p className="card-text">Toutes les pièces pour entretenir ou réparer votre moto.</p>
              </div>
            </div>
          </div>
       
          <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="400">
            <div className="card h-100 shadow border-0">
              <img src="./cas.webp" className="card-img-top" alt="Accessoires" />
              <div className="card-body">
                <h5 className="card-title">Accessoires</h5>
                <p className="card-text">Équipements pour motards : casques, gants, protections.</p>
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
         <>
    <Footer/>
     </>
    </div>

   
    
  );
};

export default Home;
