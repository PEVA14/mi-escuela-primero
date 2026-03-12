import { useNavigate } from 'react-router-dom';
import logo from "../assets/logoMEP.png";
import "../components/NavBar.css"

export default function NavBar(){
    const navigate = useNavigate();

    return(
        <nav className="navbar">
            <img className="navbar__logo" src={logo} alt="Mi Escuela Primero Logo.png" />
            <div className="navbar__links">
                <button className="navbar__button" onClick={() => navigate('/')}>Inicio</button>
                <button className="navbar__button" onClick={() => navigate('/escuelas')}>Explorar Escuelas</button>
                <button className="navbar__button" onClick={() => navigate('/#explainer')}>Como funciona</button>
                {/* <button className="navbar__button" onClick={() => navigate('')}>Contacto</button> */}
            </div>
        </nav>
    )
}