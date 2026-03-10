import { useEffect, useState } from "react";
import { getEscuelas } from "../services/api";
import Tarjeta from "./Tarjeta";

export default function ListaTarjeta(){
    const [escuelas , setEscuelas] = useState([])
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

    return (
        <div>
            {escuelas.map((escuela) => {
                return (
                    <Tarjeta 
                        key={escuela.id_escuela} 
                        escuela={escuela} 
                    />
                );
            })}
        </div>
    );
}