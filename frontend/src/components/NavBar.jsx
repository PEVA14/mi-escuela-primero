import { useNavigate } from 'react-router-dom';
import logo from "../assets/logoMEP.png";

export default function NavBar(){
    const navigate = useNavigate();

    return(
        <div>
            <img src = {logo} alt="Mi Escuela Primero Logo.png"/>
            <button onClick={()=>navigate('/')}>Inicio</button>
            <button onClick={()=>navigate('/escuelas')}>Explorar Escuelas</button>
            {/* <button onClick={()=>navigate('')}>Como funciona</button>
            <button onClick={()=>navigate('')}>Contacto</button> */}
        </div>
    )
}