import { useNavigate } from "react-router-dom";
import lupa from "../assets/search-3820_64.png";
import heart from "../assets/heart-492_64.png";
import sendIcon from "../assets/send-4008_64.png";
import check from "../assets/check-mark-3279_64.png";

export default function Explainer(){
    return (
        <section id="explainer">
            <div>
                <div className="introduction">
                    <h2 className="subtitle">¿Cómo Funciona?</h2>
                    <p>Conectamos necesidades reales con aliados comprometidos en 4 pasos simples. El proceso es transparente, eficiente y fácil de seguir.</p>
                </div>
                <div className="infoCard">
                    <p className="stepNotification">1</p>
                    <img src={lupa} alt="lupa.png"></img>
                    <h3>Explora escuelas y necesidades</h3>
                    <p>Navega por nuestro catálogo interactivo y filtra por ubicación, categoría o prioridad para encontrar causas que resuenan contigo.</p>
                </div>
                <div className="infoCard">
                    <p className="stepNotification">2</p>
                    <img src={heart} alt="corazón.png"></img>
                    <h3>Explora escuelas y necesidades</h3>
                    <p>Navega por nuestro catálogo interactivo y filtra por ubicación, categoría o prioridad para encontrar causas que resuenan contigo.</p>
                </div>
                <div className="infoCard">
                    <p className="stepNotification">3</p>
                    <img src={sendIcon} alt="avion de papel.png"></img>
                    <h3>Envía tu interés mediante el formulario</h3>
                    <p>Completa un formulario simple con tus datos de contacto. Nosotros nos encargamos de conectarte con la escuela.</p>
                </div>
                <div className="infoCard">
                    <p className="stepNotification">4</p>
                    <img src={check} alt="paloma.png"></img>
                    <h3>La organización da seguimiento</h3>
                    <p>Nuestro equipo te contactará para coordinar los detalles de tu apoyo y asegurar que llegue directamente a quien lo necesita.</p>
                </div>
                <div className="footNote">
                    <p>Nota importante: Todos tus datos se manejan con total confidencialidad de acuerdo con nuestro Aviso de Privacidad. Tu información solo se usa para coordinar el apoyo con las escuelas.</p>
                </div>
            </div>
        </section>
    )
}