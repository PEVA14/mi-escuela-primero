import ListaTarjeta from "../components/ListaTarjeta";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Catalogo() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full bg-slate-50 px-3 py-8 md:px-4 lg:px-6">
        <section className="w-full">
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-100 shadow-sm">
            <div className="px-6 py-10 text-center md:px-10 md:py-14 lg:px-14">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-800">
                Catálogo de Escuelas
              </span>

              <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                Explora las necesidades de las escuelas y encuentra una causa
                con la que realmente conectes
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                Conoce escuelas, revisa sus necesidades prioritarias y descubre
                dónde tu apoyo puede generar un impacto real.
              </p>
            </div>
          </div>

          <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:mt-10 md:p-6 lg:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Escuelas disponibles
              </h2>
              <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-slate-500 md:text-base">
                Filtra, compara y entra a los detalles de cada escuela para
                conocer mejor sus necesidades.
              </p>
            </div>

            <ListaTarjeta />
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
