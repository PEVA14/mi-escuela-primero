import { useNavigate } from "react-router-dom";
import location from "../assets/location_icon.png"
import Buscador from "../components/Buscador.jsx"
import ListaTarjeta from "../components/ListaTarjeta.jsx"
import Tarjeta from "../components/Tarjeta.jsx"
import {getEscuelas} from "../services/api";

export default function MuestraCatalogo(){
    const navigate = useNavigate();

    return(
        <div id="catalogSample">
            <div className="introduction">
                <img src={location} alt="location.png"></img>
                <h5>Impacto local</h5>
                <h2>Escuelas que Necesitan Tu Apoyo</h2>
                <p>Estas son algunas de las escuelas que actualmente necesitan apoyo. Cada una tiene necesidades específicas y verificadas.</p>
            </div>
            <div className="cardSample">
                {/* <Buscador/> */}
                <ListaTarjeta mostrarBuscador={false} limite={3}/>
                {/* <Tarjeta/> */}
            </div>
        </div>
    )
}