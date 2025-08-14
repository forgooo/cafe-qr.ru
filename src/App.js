import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './comp/header.js';
import Body from './comp/body.js';
import Footer from './comp/footer.js';
import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './lib/animate/animate.min.css';
import './lib/owlcarousel/assets/owl.carousel.min.css';
import './lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css';
import WOW from 'wow.js';

const App = () => {
  const [spinnerVisible, setSpinnerVisible] = useState(true);

  // Инициализация WOW.js
  useEffect(() => {
    new WOW().init();
  }, []);

  // Управление спиннером
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpinnerVisible(false);
    }, 100); // Таймер для скрытия спиннера
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Спиннер */}
      {spinnerVisible && (
        <div id="spinner" className="spinner show">
          Loading...
        </div>
      )}

      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default App;