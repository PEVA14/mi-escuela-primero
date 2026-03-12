import "../components/Footer.css"
import { Link } from 'react-router-dom';
import privacyPDF from "../assets/AvisodePrivacidadMEP.pdf";
import logo from "../assets/logoMEP.png"
import mailIcon from  "../assets/mail_icon.png"
import phoneIcon from "../assets/phone_icon.png"
import locationIcon from "../assets/location_icon.png"
import websiteIcon from "../assets/website_icon.png"

export default function Footer(){
    return(
        <footer className="site-footer">
            <section id="contacto" className="footer-section footer-contacto">
                <img className="footer-logo" src={logo} alt="Mi Escuela Primero Logo.png" />

                <h2 className="footer-title">Contacto</h2>
                <a className="footer-link" href="mailto:contacto@mpj.org.mx">
                    <img className="footer-icon" src={mailIcon} alt="" /> contacto@mpj.org.mx
                </a>
                <a className="footer-link" href="tel:+523321068253">
                    <img className="footer-icon" src={phoneIcon} alt="" /> +52 (33) 2106-8253
                </a>
                <address className="footer-address">
                    <span className="footer-link footer-link--address">
                        <img className="footer-icon" src={locationIcon} alt="" /> Av. Pablo Neruda 2560, Providencia, 44630 Guadalajara, Jal.
                    </span>
                </address>
                <a className="footer-link" href="https://www.mexicanosprimerojalisco.org" target="_blank" rel="noreferrer">
                    <img className="footer-icon" src={websiteIcon} alt="" /> www.mexicanosprimerojalisco.org
                </a>
            </section>

            <section id="navegacion" className="footer-section footer-navegacion footer-nav">
                <h2 className="footer-title">Navegación</h2>
                <Link className="footer-nav-link" to="/">Inicio</Link>
                <Link className="footer-nav-link" to="/escuelas">Explorar Escuelas</Link>
                <a href={privacyPDF} target="_blank" rel="noopener noreferrer">Aviso de privacidad</a>
                <Link className="footer-nav-link" to="/admin">Administrador</Link>
            </section>

            <small className="footer-copy">© 2026 Mexicanos Primero Jalisco A.C. Todos los derechos reservados.</small>

        </footer>
    )
}