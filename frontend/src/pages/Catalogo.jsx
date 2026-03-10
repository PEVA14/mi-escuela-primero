import Tarjeta from "../components/Tarjeta";
import ListaTarjeta from "../components/ListaTarjeta";
import Buscador from "../components/Buscador";

export default function Catalogo() {
    return (
        <>
            <h1> Catalogo de Escuelas </h1>
            <h2> Explora las necesidades de las escuelas y encuentre la causa que mas resuene contigo </h2>
            <Buscador/>
            <ListaTarjeta/>
        </>
    )
}