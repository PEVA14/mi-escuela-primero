import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Tarjeta from './components/Tarjeta.jsx'
import ListaTarjeta from "./components/ListaTarjeta.jsx";
import Detalles from "./pages/Detalles.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <>
    <BrowserRouter> 
      <Routes>
       <Route path="/escuelas" element={<Catalogo/>} />
       <Route path="/escuelas/:id" element={<Detalles/>} />
       <Route path="/" element={<Home/>} />
       <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
    </>)
  
}

export default App
