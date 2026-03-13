import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Tarjeta from './components/Tarjeta.jsx'
import ListaTarjeta from "./components/ListaTarjeta.jsx";
import Detalles from "./pages/Detalles.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AgregarEscuela from "./pages/AgregarEscuela.jsx";
import EditEscuela from ".pages/EditEscuela.jsx";

function App() {
  return (
    <>
    <BrowserRouter> 
      <Routes>
       <Route path="/escuelas" element={<Catalogo/>} />
       <Route path="/escuelas/:id" element={<Detalles/>} />
       <Route path="/" element={<Home/>} />
       <Route path="/login" element={<Login/>} />
       <Route path="/escuelas/new" element={<AgregarEscuela/>} />
       <Route path="/editar/:id" element={<EditEscuela />} />
      </Routes>
    </BrowserRouter>
    </>)
  
}

export default App
