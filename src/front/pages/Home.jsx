import React, { useEffect, useState } from "react";
import HomePrivada from "./HomePrivada";


const sportGallery = [
  { key: "futbol", label: "Fútbol", img: "https://static.vecteezy.com/system/resources/previews/027/829/024/non_2x/close-up-of-many-soccer-players-kicking-a-football-on-a-field-competition-scene-created-with-generative-ai-technology-photo.jpg" },
  { key: "baloncesto", label: "Baloncesto", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFsb25jZXN0b3xlbnwwfHwwfHx8MA%3D%3D" },
  { key: "padel", label: "Pádel", img: "https://rekoveryclinic.com/wp-content/uploads/2023/06/jugadoras-de-padel-practicando-deporte.jpg" },
  { key: "tenis", label: "Tenis", img: "https://media.istockphoto.com/id/1455497361/es/foto/pareja-joven-en-cancha-de-tenis-hombre-guapo-y-mujer-atractiva-est%C3%A1n-jugando-al-tenis.jpg?s=612x612&w=0&k=20&c=pyiCggfukCyHPVjHq8Ab85pIHrSPqnnrgWVin4OsFwY=" },
  { key: "voleibol", label: "Voleibol", img: "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_xl_2x/f_auto/primary/rfv4xgcqwveivms2npcr" },
  { key: "running", label: "Running", img: "https://media.istockphoto.com/id/612398606/es/foto/marat%C3%B3n-de-carrera-de-atletismo.jpg?s=612x612&w=0&k=20&c=xNejNoZ25NnqINi4T5qqv57BFaashjvF16j8m4-BTsY=" },
];


export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem("pick4fun_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <HomePrivada /> : <HomePublica />;
}

function HomePublica() {
  const [activeIndex, setActiveIndex] = useState(0);

 return (
    <div className="container-fluid p-0 vh-100 d-flex">
      {/* Columna de información */}
      <div className="col-md-6 d-flex align-items-center bg-light overflow-auto py-4">
        <div className="p-4 p-lg-5 w-100" style={{maxHeight: '100vh'}}>
          {/* Título y subtítulo */}
          <h1 className="display-6 fw-bold mb-3">Pick4Fun: juega cuando quieras</h1>
          <p className="text-secondary mb-4">
            Organiza o únete a <strong>partidos pickup</strong> cerca de ti sin chats eternos.
            Encuentra gente de tu nivel, comparte gastos de pista y ¡a disfrutar!
          </p>

          {/*  pasos*/}
          <div className="row mb-4">
            <div className="col-4 text-center">
              <div className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px'}}>
                <span className="fw-bold">1</span>
              </div>
              <h6 className="fw-bold">Crea</h6>
              <p className="small text-secondary mb-0">Elige deporte, fecha y lugar</p>
            </div>
            <div className="col-4 text-center">
              <div className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px'}}>
                <span className="fw-bold">2</span>
              </div>
              <h6 className="fw-bold">Conecta</h6>
              <p className="small text-secondary mb-0">Encuentra jugadores</p>
            </div>
            <div className="col-4 text-center">
              <div className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px'}}>
                <span className="fw-bold">3</span>
              </div>
              <h6 className="fw-bold">Juega</h6>
              <p className="small text-secondary mb-0">Disfruta y valora</p>
            </div>
          </div>

          {/* Características */}
          <div className="row g-2 mb-4 mx-auto" style={{maxWidth: '60%'}}>
            <div className="col-6">
              <div className="p-2">
                <h6 className="fw-bold mb-1">📍 Cancha cerca</h6>
                <p className="small text-secondary mb-0">Mapa con filtros avanzados</p>
              </div>
            </div>
            <div className="col-6">
              <div className="p-2">
                <h6 className="fw-bold mb-1">⚖️ Nivel justo</h6>
                <p className="small text-secondary mb-0">Equipos equilibrados</p>
              </div>
            </div>
            <div className="col-6">
              <div className="p-2">
                <h6 className="fw-bold mb-1">💬 Chat y avisos</h6>
                <p className="small text-secondary mb-0">Comunicación fácil</p>
              </div>
            </div>
            <div className="col-6">
              <div className="p-2">
                <h6 className="fw-bold mb-1">💳 Pagos simples</h6>
                <p className="small text-secondary mb-0">Split de costes</p>
              </div>
            </div>
          </div>

          {/* Stats compactas */}
          <div className="d-flex justify-content-around text-center mb-4">
            <div>
              <div className="h5 fw-bold mb-0">120+</div>
              <div className="small text-secondary">Eventos/semana</div>
            </div>
            <div>
              <div className="h5 fw-bold mb-0">35+</div>
              <div className="small text-secondary">Deportes</div>
            </div>
            <div>
              <div className="h5 fw-bold mb-0">4.8★</div>
              <div className="small text-secondary">Valoración</div>
            </div>
          </div>

          {/* FAQ compacta */}
          <div className="accordion accordion-flush mb-4" id="faqAccordion">
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button className="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  ¿Cuánto cuesta?
                </button>
              </h3>
              <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body small">Crear y unirse es gratis. Solo pagas tu parte de la pista.</div>
              </div>
            </div>
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button className="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  ¿Es seguro?
                </button>
              </h3>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body small">Perfiles verificados y sistema de valoraciones.</div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="d-grid gap-2">
            <a href="/register" className="btn btn-primary btn-lg">REGISTRATE</a>
          </div>
        </div>
      </div>

      {/* Columna del carrusel */}
      <div className="col-md-6 p-0 d-none d-md-block">
        <div id="sportCarousel" className="carousel slide h-100" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {sportGallery.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#sportCarousel"
                data-bs-slide-to={index}
                className={index === activeIndex ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="carousel-inner h-100">
            {sportGallery.map((sport, index) => (
              <div key={sport.key} className={`carousel-item h-100 ${index === activeIndex ? "active" : ""}`}>
                <img 
                  src={sport.img} 
                  className="d-block w-100 h-100" 
                  alt={sport.label}
                  style={{objectFit: 'cover'}}
                />
                <div className="carousel-caption d-none d-block bg-dark bg-opacity-50 rounded p-2">
                  <h5 className="mb-0">{sport.label}</h5>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-control-prev" type="button" data-bs-target="#sportCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#sportCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  );
}