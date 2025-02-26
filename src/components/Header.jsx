import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS
import '../Style/Header.css'; // Asegúrate de que la ruta sea correcta
import logo from '../images/logo.png';

const Header = () => {
  return (
    <header className="custom-header-bg text-white py-2">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <div className="logo-container">
            <img src={logo} alt="Logo" className="header-logo me-3" />
          </div>

          {/* Enlaces de navegación */}
          <nav>
            <ul className="list-unstyled d-flex mb-0">
              <li className="nav-item">
                <a href="/" className="nav-link text-white">
                  Inicio
                </a>
              </li>
              <li className="nav-item ms-3">
                <a href="/proyectos" className="nav-link text-white">
                  Reportes
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;