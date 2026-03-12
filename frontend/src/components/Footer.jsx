import { Link } from 'react-router-dom';
import privacyPDF from "../assets/AvisodePrivacidadMEP.pdf";
import logo from "../assets/logoMEP.png"
import mailIcon from  "../assets/mail_icon.png"
import phoneIcon from "../assets/phone_icon.png"
import locationIcon from "../assets/location_icon.png"
import websiteIcon from "../assets/website_icon.png"

export default function Footer(){
    return(
        <footer className="bg-slate-900 text-white">
            <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-8 px-6 py-10 md:px-10 lg:px-14">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <section id="contacto">
                        <div>
                            <img className="h-14 w-auto object-contain" src={logo} alt="Mi Escuela Primero Logo.png" />
                            <h2 className="mt-4 text-xl font-bold text-white">Contacto</h2>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm text-slate-300 md:text-base">
                            <a className="flex items-center gap-3 hover:text-white" href="mailto:contacto@mpj.org.mx">
                                <img className="h-5 w-5 object-contain" src={mailIcon} alt="" />
                                <span>contacto@mpj.org.mx</span>
                            </a>
                            <a className="flex items-center gap-3 hover:text-white" href="tel:+523321068253">
                                <img className="h-5 w-5 object-contain" src={phoneIcon} alt="" />
                                <span>+52 (33) 2106-8253</span>
                            </a>
                            <address className="not-italic">
                                <span className="flex items-start gap-3">
                                    <img className="mt-0.5 h-5 w-5 object-contain" src={locationIcon} alt="" />
                                    <span>Av. Pablo Neruda 2560, Providencia, 44630 Guadalajara, Jal.</span>
                                </span>
                            </address>
                            <a className="flex items-center gap-3 hover:text-white" href="https://www.mexicanosprimerojalisco.org" target="_blank" rel="noreferrer">
                                <img className="h-5 w-5 object-contain" src={websiteIcon} alt="" />
                                <span>www.mexicanosprimerojalisco.org</span>
                            </a>
                        </div>
                    </section>

                    <section id="navegacion">
                        <h2 className="text-xl font-bold text-white">Navegación</h2>
                        <div className="mt-5 grid gap-3 text-sm md:text-base">
                            <Link className="text-slate-300 hover:text-white" to="/">Inicio</Link>
                            <Link className="text-slate-300 hover:text-white" to="/escuelas">Explorar Escuelas</Link>
                            <a className="text-slate-300 hover:text-white" href={privacyPDF} target="_blank" rel="noopener noreferrer">Aviso de privacidad</a>
                            <Link className="text-slate-300 hover:text-white" to="/admin">Administrador</Link>
                        </div>
                    </section>
                </div>

                <div className="border-t border-slate-700 pt-5 text-center text-sm text-slate-400 md:text-left">
                    © 2026 Mexicanos Primero Jalisco A.C. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}