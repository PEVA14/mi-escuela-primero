import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Lobby from "../components/Lobby";
import TrustBuilding from "../components/TrustBuilding";
import Testimonies from "../components/Testimonies";
import "../pages/Home.css"
import Pre_footer from "../components/Pre_footer";
import Explainer from "../components/explainer";
import MuestraCatalogo from "../components/MuestraCatalogo";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ListaTarjeta from "../components/ListaTarjeta";

export default function Home(){
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
        const element = document.querySelector(location.hash);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        }
    }, [location]);
    return(
        <>
        <NavBar/>
        <Lobby/>
        <TrustBuilding/>
        <MuestraCatalogo/>
        <Explainer/>
        <Testimonies/>
        <Pre_footer/>
        <Footer/>
        </>
    );
}