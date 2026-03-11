import { Link } from 'react-router-dom';

import logo from "../assets/logoMEP.png"
import mailIcon from  "../assets/mail_icon.png"
import phoneIcon from "../assets/phone_icon.png"
import locationIcon from "../assets/location_icon.png"
import websiteIcon from "../assets/website_icon.png"

export default function Footer(){
    return(
        <footer>
            <section id="contacto">
                <img src = {logo} alt="Mi Escuela Primero Logo.png"/>

                <h2>Contacto</h2>
                <a href="mailto:contacto@mpj.org.mx"> 
                    <img src = {mailIcon} alt=""/> contacto@mpj.org.mx
                </a>
                <a href="tel:+523321068253"> 
                    <img src = {phoneIcon} alt=""/> +52 (33) 2106-8253
                </a>
                <address>
                    <span> 
                        <img src={locationIcon} alt=""/> Av. Pablo Neruda 2560, Providencia, 44630 Guadalajara, Jal.
                    </span>
                </address>
                <a href="https://www.mexicanosprimerojalisco.org"> 
                    <img src={websiteIcon} alt=""/> www.mexicanosprimerojalisco.org
                </a>
            </section>

            <section id="navegacion">
                <h2>Navegacion</h2>
                <Link to="/">Inicio </Link>
                <Link to="/escuelas"> Explorar Escuelas </Link>
                <span> Aviso de privacidad </span> {/*Lo deje como p porque no se como hacer eso del pdf todavia */}
                <Link to="/admin"> Administrador </Link>
            </section>

            <small>© 2026 Mexicanos Primero Jalisco A.C. Todos los derechos reservados.</small>

        </footer>
    )
}