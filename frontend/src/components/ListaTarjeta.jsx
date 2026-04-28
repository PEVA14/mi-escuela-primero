import { useEffect, useState } from "react";
import { getEscuelas } from "../services/api";
import Tarjeta from "./Tarjeta";
import Buscador from "./Buscador";

export default function ListaTarjeta({
  mostrarBuscador = true,
  limite = null,
}) {
  const [escuelas, setEscuelas] = useState([]);
  useEffect(() => {
    async function load() {
      try {
        const res = await getEscuelas();
        setEscuelas(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, []);

  const escuelasAMostrar = limite ? escuelas.slice(0, limite) : escuelas;

  return (
    <div className="w-full">
      {mostrarBuscador ? (
        <Buscador escuelas={escuelas} />
      ) : (
        <div className="lista-tarjetas-sample grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {escuelasAMostrar.map((escuela, index) => (
            <Tarjeta
              key={escuela.id ?? escuela.id_escuela ?? escuela.nombre ?? index}
              escuela={escuela}
            />
          ))}
        </div>
      )}
    </div>
  );
}
