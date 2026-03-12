import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { getEscuelaById } from "../services/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PopUp from "../components/PopUp";
import locationIcon from "../assets/location_icon.png";
import calendarIcon from "../assets/calendar_icon.png";
import schoolIcon from "../assets/school_icon_32px.png";
import "../pages/Detalles.css"

export default function Detalles() {
    const [escuela, setEscuela] = useState(null);
    const { id } = useParams(); 
    const navigate = useNavigate();

    useEffect( ()=> {
        async function load() {
            try{
                const res = await getEscuelaById(id);
                console.log(res.data)
                setEscuela(res.data);
            } catch(e) {
                 console.log(e);
            }
        } load();
        }, [id])

    
    function redirect(){
        navigate('/escuelas')
    }

    const [showPopup, setShowPopup] = useState(false);

    function popup() {
        setShowPopup(true);
    }

    function closePopup() {
        setShowPopup(false);
    }

    function getMeaningfulPart(direccion) {
        if (!direccion) return "";
    
        const invalidParts = ["desconocido", "s/n", "sin número", "sin numero"];
    
        const parts = direccion
            .split(",")
            .map((part) => part.trim())
            .filter((part) => part !== "" && !invalidParts.includes(part.toLowerCase()));
    
        return parts[0] || direccion;
    }

    return (
        <div>
            <NavBar/>
            <div className="schoolHead">
                <button onClick={redirect}>Volver al catalogo</button>
                <h1 className="TitEscuela">{escuela?.nombre}</h1> 
                <h2 className="cantNecesidades">{`${escuela?.categoria?.length ?? 0} necesidades`}</h2>
                <img src={locationIcon} alt="location.png"></img>
                <h2 className="subtEscuela">{`${getMeaningfulPart(escuela?.direccion)}, ${escuela?.municipio}, Jal.`}</h2>
                <img src={schoolIcon} alt="escuela.png"></img>
                <h2 className="subtEscuela">{escuela?.nivelEducativo}</h2>
                <img src={calendarIcon} alt="calendar.png"></img>
                <h2 className="lastUpdate"><small>Actualizado: 11 de marzo de 2026</small></h2>
            </div>
            <div className="summary">
                <h2>Resumen General</h2>
                <h4>{`Recaudado: $130,000`}</h4>
                <h4>{`Meta: $645,000`}</h4>
                <h4>{`Necesidades activas: ${escuela?.categoria?.length ?? 0}`}</h4>
                <h4>{`Ubicación: ${escuela?.municipio}`}</h4>
                <h4>{`Nivel: ${escuela?.nivelEducativo}`}</h4>
            </div>

            <div className="conocenos">
                <h2 className="conoce">Conoce Nuestras Instalaciones</h2>
                {/* Images should go here but idk howwww */}
            </div>

            <div className="necesidades">
                <h2>Necesidades Especificas</h2>
                <div className="Tarjeta Necesidad">
                    {/* Falta poner detalles de cada necesidad aquí */}
                    <h4 className="listing">#1</h4>
                    <h4 className="urgendy">Urgente</h4>
                    <h4 className="categ">Infraestructura</h4>
                    <h3 className="titNecesidad">Baños y sanitarios en mal estado</h3>
                    <p className="details">Los baños de la escuela requieren remodelación urgente, incluyendo nuevos inodoros, lavabos, espejos y sistema de drenaje para garantizar condiciones higiénicas adecuadas.</p>
                    <h4>{`Recaudado: $50,000`}</h4>
                    <h4>{`Meta: $280,000`}</h4>
                    <h4 className="percent">{`18% Completado`}</h4>
                    <h4>{`Faltan: $230,000`}</h4>
                    <button onClick={popup}>Apoyar</button>
                </div>

                <div className="localization">
                <img src={locationIcon} alt="location.png"></img>
                    <h3>Ubicación de la Escuela</h3>
                    {/* El mapa en teoria va aquí */}
                    <h2 className="subtEscuela">{`Dirección: ${getMeaningfulPart(escuela?.direccion)}, ${escuela?.municipio}, Jal.`}</h2>
                </div>

                <div className="consFoot">
                    <h4 className="TitEscuela">{escuela?.nombre}</h4> 
                    <h4 className="cantNecesidades">{`${escuela?.categoria?.length ?? 0} necesidades`}</h4>
                    <button onClick={popup}>Apoyar a esta Escuela</button>
                </div>
            </div>
            {showPopup && (
                <PopUp closePopup={closePopup} escuela={escuela} />
            )}
            <Footer/>
        </div>
    );
}