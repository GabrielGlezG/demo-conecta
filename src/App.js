import React from "react";
import Header from "./components/Header"; // Asegúrate de que la ruta sea correcta
import Projects from "./components/Projects";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap
import './Style/Global.css'; // Importa tu archivo CSS personalizado
import Footer from "./components/Footer";


function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header /> {/* Aquí agregas el componente Header */}
      <main className="flex-grow-1 p-4">
        <Projects />
      </main>
      <Footer /> {/* Aquí agregas el componente Footer */}
    </div>
  );
}

export default App;