import React, { useEffect, useState } from "react";
import HomePrivada from "./HomePrivada";

const sportGallery = [
  { 
    key: "futbol", 
    label: "Fútbol", 
    img: "https://static.vecteezy.com/system/resources/previews/027/829/024/non_2x/close-up-of-many-soccer-players-kicking-a-football-on-a-field-competition-scene-created-with-generative-ai-technology-photo.jpg",
    gradient: "linear-gradient(135deg, #ff6b6b, #ee5a24)"
  },
  { 
    key: "baloncesto", 
    label: "Baloncesto", 
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFsb25jZXN0b3xlbnwwfHwwfHx8MA%3D%3D",
    gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)"
  },
  { 
    key: "padel", 
    label: "Pádel", 
    img: "https://rekoveryclinic.com/wp-content/uploads/2023/06/jugadoras-de-padel-practicando-deporte.jpg",
    gradient: "linear-gradient(135deg, #a8e6cf, #88d8b0)"
  },
  { 
    key: "tenis", 
    label: "Tenis", 
    img: "https://media.istockphoto.com/id/1455497361/es/foto/pareja-joven-en-cancha-de-tenis-hombre-guapo-y-mujer-atractiva-est%C3%A1n-jugando-al-tenis.jpg?s=612x612&w=0&k=20&c=pyiCggfukCyHPVjHq8Ab85pIHrSPqnnrgWVin4OsFwY=",
    gradient: "linear-gradient(135deg, #ffd93d, #ff9a3d)"
  },
  { 
    key: "voleibol", 
    label: "Voleibol", 
    img: "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_xl_2x/f_auto/primary/rfv4xgcqwveivms2npcr",
    gradient: "linear-gradient(135deg, #6a11cb, #2575fc)"
  },
  { 
    key: "running", 
    label: "Running", 
    img: "https://media.istockphoto.com/id/612398606/es/foto/marat%C3%B3n-de-carrera-de-atletismo.jpg?s=612x612&w=0&k=20&c=xNejNoZ25NnqINi4T5qqv57BFaashjvF16j8m4-BTsY=",
    gradient: "linear-gradient(135deg, #667eea, #764ba2)"
  },
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pick4fun_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <span style={styles.loadingText}>Cargando experiencia...</span>
      </div>
    );
  }

  return isAuthenticated ? <HomePrivada /> : <HomePublica />;
}

function HomePublica() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={styles.container}>
      {/* Fondo animado */}
      <div style={styles.background}></div>
      <div style={styles.particles}></div>
      
      <div style={styles.content}>
        {/* Header Principal */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>⚡</div>
            </div>
            <h1 style={styles.heroTitle}>Pick4Fun</h1>
            <p style={styles.heroSubtitle}>juega cuando quieras</p>
            <p style={styles.heroDescription}>
              Organiza o únete a <strong>partidos pickup</strong> cerca de ti sin chats eternos.
              Encuentra gente de tu nivel, comparte gastos de pista y ¡a disfrutar!
            </p>
          </div>
        </div>

        {/* Contenido Principal */}
        <div style={styles.mainContent}>
          {/* Columna Izquierda - Información */}
          <div style={styles.infoColumn}>
            {/* Pasos */}
            <div style={styles.stepsContainer}>
              <div style={styles.step}>
                <div style={{...styles.stepNumber, background: sportGallery[0].gradient}}>
                  <span>1</span>
                </div>
                <div style={styles.stepContent}>
                  <h4 style={styles.stepTitle}>Crea</h4>
                  <p style={styles.stepText}>Elige deporte, fecha y lugar</p>
                </div>
              </div>
              
              <div style={styles.step}>
                <div style={{...styles.stepNumber, background: sportGallery[1].gradient}}>
                  <span>2</span>
                </div>
                <div style={styles.stepContent}>
                  <h4 style={styles.stepTitle}>Conecta</h4>
                  <p style={styles.stepText}>Encuentra jugadores</p>
                </div>
              </div>
              
              <div style={styles.step}>
                <div style={{...styles.stepNumber, background: sportGallery[2].gradient}}>
                  <span>3</span>
                </div>
                <div style={styles.stepContent}>
                  <h4 style={styles.stepTitle}>Juega</h4>
                  <p style={styles.stepText}>Disfruta y valora</p>
                </div>
              </div>
            </div>

            {/* Características */}
            <div style={styles.featuresGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📍</div>
                <div>
                  <h5 style={styles.featureTitle}>Cancha cerca</h5>
                  <p style={styles.featureText}>Mapa con filtros avanzados</p>
                </div>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⚖️</div>
                <div>
                  <h5 style={styles.featureTitle}>Nivel justo</h5>
                  <p style={styles.featureText}>Equipos equilibrados</p>
                </div>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>💬</div>
                <div>
                  <h5 style={styles.featureTitle}>Chat y avisos</h5>
                  <p style={styles.featureText}>Comunicación fácil</p>
                </div>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>💳</div>
                <div>
                  <h5 style={styles.featureTitle}>Pagos simples</h5>
                  <p style={styles.featureText}>Split de costes</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={styles.statsContainer}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>120+</div>
                <div style={styles.statLabel}>Eventos/semana</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>35+</div>
                <div style={styles.statLabel}>Deportes</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>4.8★</div>
                <div style={styles.statLabel}>Valoración</div>
              </div>
            </div>

            {/* CTA */}
            <div style={styles.ctaContainer}>
              <a href="/register" style={styles.ctaButton}>
                🚀 COMENZAR AVENTURA
              </a>
            </div>
          </div>

          {/* Columna Derecha - Carrusel */}
          <div style={styles.carouselColumn}>
            <div style={styles.carouselContainer}>
              {sportGallery.map((sport, index) => (
                <div 
                  key={sport.key} 
                  style={{
                    ...styles.carouselSlide,
                    opacity: index === activeIndex ? 1 : 0,
                    transform: `translateX(${(index - activeIndex) * 100}%)`,
                    background: sport.gradient
                  }}
                >
                  <img 
                    src={sport.img} 
                    alt={sport.label}
                    style={styles.carouselImage}
                  />
                  <div style={styles.carouselOverlay}>
                    <h3 style={styles.carouselTitle}>{sport.label}</h3>
                    <div style={styles.carouselIndicators}>
                      {sportGallery.map((_, i) => (
                        <button
                          key={i}
                          style={{
                            ...styles.indicator,
                            background: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)'
                          }}
                          onClick={() => setActiveIndex(i)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Elementos flotantes */}
      <div style={styles.floatingElement1}></div>
      <div style={styles.floatingElement2}></div>
      <div style={styles.floatingElement3}></div>
    </div>
  );
}

/* ESTILOS BASADOS EN REGISTRO */
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4ecdc4 100%)',
    position: 'relative',
    overflow: 'hidden',
    color: '#fff',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
    `,
    animation: 'float 8s ease-in-out infinite',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 2px, transparent 0),
      radial-gradient(circle at 90% 40%, rgba(255, 255, 255, 0.1) 2px, transparent 0),
      radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.1) 2px, transparent 0)
    `,
    backgroundSize: '100px 100px',
    animation: 'particleFloat 20s linear infinite',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4ecdc4 100%)',
    color: '#fff',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid #4ecdc4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    fontWeight: '500',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  heroContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  logo: {
    marginBottom: '20px',
  },
  logoIcon: {
    fontSize: '80px',
    background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 20px rgba(78, 205, 196, 0.5))',
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff, #a8e6cf)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 10px 0',
    lineHeight: 1.1,
  },
  heroSubtitle: {
    fontSize: '1.8rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    margin: '0 0 20px 0',
  },
  heroDescription: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6,
    margin: 0,
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'start',
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '25px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '24px',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: '0 0 5px 0',
    color: '#fff',
  },
  stepText: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  featureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  featureIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#fff',
  },
  featureText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '30px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    textAlign: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#4ecdc4',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  ctaContainer: {
    textAlign: 'center',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '20px 40px',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '15px',
    fontSize: '1.2rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 30px rgba(78, 205, 196, 0.4)',
  },
  carouselColumn: {
    position: 'relative',
  },
  carouselContainer: {
    position: 'relative',
    height: '600px',
    borderRadius: '25px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
  },
  carouselSlide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '25px',
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '30px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  },
  carouselTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },
  carouselIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  floatingElement1: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '120px',
    height: '120px',
    background: 'linear-gradient(135deg, #ff6b6b, transparent)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.3,
    animation: 'floatElement 6s ease-in-out infinite',
  },
  floatingElement2: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    width: '180px',
    height: '180px',
    background: 'linear-gradient(135deg, #4ecdc4, transparent)',
    borderRadius: '50%',
    filter: 'blur(50px)',
    opacity: 0.2,
    animation: 'floatElement 8s ease-in-out infinite reverse',
  },
  floatingElement3: {
    position: 'absolute',
    top: '50%',
    left: '70%',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, #a8e6cf, transparent)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.25,
    animation: 'floatElement 10s ease-in-out infinite',
  },
};

// Asegurar que las animaciones estén definidas
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
  `, styleSheet.cssRules.length);
  
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
  
  styleSheet.insertRule(`
    @keyframes particleFloat {
      0% { transform: translateY(0px) translateX(0px); }
      100% { transform: translateY(-100px) translateX(50px); }
    }
  `, styleSheet.cssRules.length);
  
  styleSheet.insertRule(`
    @keyframes floatElement {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-20px) scale(1.1); }
    }
  `, styleSheet.cssRules.length);

  // Efectos hover
  styleSheet.insertRule(`
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(78, 205, 196, 0.6);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .step:hover, .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    }
  `, styleSheet.cssRules.length);

} catch (e) {
  console.log('Las animaciones ya están definidas');
}