import { useState } from "react";
import { Link } from 'react-router-dom';
import PopUp from "./PopUp";

export default function PopUpFAQ() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <h1>Preguntas frecuentes</h1>

      <div className="question">
            <p>¿A qué se destinan los donativos?</p>
            <p>Los donativos recibidos son destinados directamente a las escuelas que forman 
                parte del proyecto Mi Escuela Primero, escuelas de educación básica de
                sostenimiento público en contextos vulnerables. A través de una priorización de
                necesidades, destinamos cada apoyo a la escuela que más lo necesita.
            </p>
      </div>

      <div className="question">
        <p>¿Cómo puedo realizar mi donativo?</p>
        <p>
          El primer paso para realizar tu donativo es llenar el formulario de contacto{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowPopup(true);
            }}
          >
            aquí
          </a>
          . A partir de ahí, el personal de Mi Escuela Primero se pondrá en contacto contigo para realizar
           las gestiones necesarias y dar seguimiento a tu donación.
        </p>
      </div>

      <div className="question">
        <p>¿Puedo donar en especie y qué artículos necesitan actualmente?</p>
        <p>
          Sí, se puede donar en especie. Conoce nuestro apartado{" "}
          <Link to="/escuelas"> aquí </Link>
          . A partir de ahí, el personal de Mi Escuela Primero se pondrá en contacto contigo para realizar
           las gestiones necesarias y dar seguimiento a tu donación.
        </p>
      </div>

      <div className="question">
            <p>¿Qué impacto tiene mi donativo?</p>
            <p>Cada aportación contribuye directamente a mejorar las condiciones y
                oportunidades de los niños, niñas y adolescentes de escuelas públicas en
                contextos vulnerables. Al momento de hacer la donación, te compartiremos los
                avances y resultados al correo que registras para que puedas conocer el impacto
                generado.
            </p>
      </div>

      <div className="question">
            <p>¿Existe un monto mínimo para donar?</p>
            <p>No, cualquier cantidad económica o de materiales suma y es bienvenida. Lo más
                importante es la intención de apoyar y formar parte del cambio.
            </p>
      </div>

      <div className="question">
            <p>¿Puedo donar algo que no está dentro de las necesidades prioritarias de la escuela?</p>
            <p>Sí, cualquier donación que pueda ser de utilidad para las escuelas, sus
                estudiantes, docentes, personal escolar o padres de familia es bienvenida. De esta
                manera seguimos fortaleciendo las comunidades educativas.
            </p>
      </div>

      {showPopup && (
        <FormularioDonativo onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}