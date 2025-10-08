import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard"; 

export default function HomePrivada() {
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const token = localStorage.getItem("pick4fun_token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Función para cargar eventos
  const loadEvents = async () => {
    try {
      const res = await fetch(`${BASE}api/events`);
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);
      setEvents(data);
    } catch (e) {
      setErr(e.message || "Error cargando eventos.");
    } finally {
      setLoading(false);
    }
  };

  // cargar eventos
  useEffect(() => {
    loadEvents();
  }, [BASE]);

  // función para unirse a eventos
  async function handleJoin(eventId) {
    if (!token) {
      alert("Primero inicia sesión para unirte.");
      window.location.assign("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE}api/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      alert("¡Te has unido al evento!");
      loadEvents(); 
    } catch (e) {
      alert("✗ " + (e.message || "No se pudo unir al evento."));
    }
  }

  async function handleDelete(eventId) {
    const eventToDelete = events.find(ev => ev.id === eventId);

    if (!token) {
      alert("Debes iniciar sesión para eliminar eventos.");
      return;
    }
    if (!confirm("¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const res = await fetch(`${BASE}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.msg || `HTTP ${res.status}`);
      }

      alert("Evento eliminado correctamente.");
      loadEvents();
    } catch (e) {
      alert("Error: " + (e.message || "No se pudo eliminar el evento."));
    }
  }

  return (
    <div style={styles.container}>
      {/* Fondo animado */}
      <div style={styles.background}></div>
      <div style={styles.particles}></div>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
  <div style={styles.headerLeft}>
    <div style={styles.logo}>
      <div style={styles.logoIcon}>⚡</div>
    </div>
    <div style={styles.headerText}>
      <h1 style={styles.title}>Eventos Disponibles</h1>
      <p style={styles.subtitle}>Encuentra tu próximo partido</p>
    </div>
  </div>
  <a href="/events/new" style={styles.createButton}>
    🎯 Crear Evento
  </a>
</div>

        {/* Contenido Principal */}
        <div style={styles.mainContent}>
          {loading && (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Cargando eventos…</p>
            </div>
          )}
          
          {err && (
            <div style={styles.error}>
              <div style={styles.errorIcon}>⚠️</div>
              <p>Error: {err}</p>
            </div>
          )}

          {!loading && !err && events.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🏆</div>
              <h3 style={styles.emptyTitle}>No hay eventos todavía</h3>
              <p style={styles.emptyText}>Sé el primero en crear un evento deportivo</p>
              <a href="/events/new" style={styles.emptyButton}>
                Crear el primer evento
              </a>
            </div>
          )}

          {!loading && !err && events.length > 0 && (
            <div style={styles.eventsSection}>
              <div style={styles.eventsHeader}>
                <p style={styles.eventsCount}>Se encontraron {events.length} eventos</p>
              </div>
              
              <div style={styles.eventsGrid}>
                {events.map((ev) => (
                  <div key={ev.id} style={styles.eventCardWrapper}>
                    <EventCard 
                      event={ev} 
                      onJoin={handleJoin}
                      onDelete={handleDelete}
                      isOwner={currentUser?.id === ev.user_id}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Elementos flotantes */}
      <div style={styles.floatingElement1}></div>
      <div style={styles.floatingElement2}></div>
      <div style={styles.floatingElement3}></div>
    </div>
  );
}

/* ESTILOS ESPECTACULARES */
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
  header: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start', // Cambiado de 'center' a 'flex-start'
  marginBottom: '50px',
  flexWrap: 'wrap',
  gap: '20px',
},
headerLeft: {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '20px',
},
headerText: {
  textAlign: 'left',
},
logo: {
  marginTop: '5px',
   marginBottom: '15px',
},
  headerContent: {
    textAlign: 'left',
  },

  logoIcon: {
    fontSize: '50px',
    background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 20px rgba(78, 205, 196, 0.5))',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff, #a8e6cf)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 10px 0',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '1.3rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    margin: 0,
  },
  createButton: {
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '15px',
    fontSize: '1.1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 30px rgba(78, 205, 196, 0.4)',
    whiteSpace: 'nowrap',
  },
  mainContent: {
    minHeight: '400px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
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
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '25px',
    background: 'rgba(255, 107, 107, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 107, 107, 0.3)',
    borderRadius: '20px',
    marginBottom: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  errorIcon: {
    fontSize: '30px',
    flexShrink: 0,
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '25px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 15px 0',
    color: '#fff',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 30px 0',
  },
  emptyButton: {
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '15px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 30px rgba(78, 205, 196, 0.4)',
    display: 'inline-block',
  },
  eventsSection: {
    marginTop: '30px',
  },
  eventsHeader: {
    marginBottom: '30px',
  },
  eventsCount: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    fontWeight: '500',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
  },
  eventCardWrapper: {
    transition: 'transform 0.3s ease',
  },
  floatingElement1: {
    position: 'absolute',
    top: '15%',
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
    right: '8%',
    width: '150px',
    height: '150px',
    background: 'linear-gradient(135deg, #4ecdc4, transparent)',
    borderRadius: '50%',
    filter: 'blur(50px)',
    opacity: 0.2,
    animation: 'floatElement 8s ease-in-out infinite reverse',
  },
  floatingElement3: {
    position: 'absolute',
    top: '60%',
    left: '75%',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, #a8e6cf, transparent)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.25,
    animation: 'floatElement 10s ease-in-out infinite',
  },
};

// Efectos hover
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    .create-button:hover, .empty-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(78, 205, 196, 0.6);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .event-card-wrapper:hover {
      transform: translateY(-5px);
    }
  `, styleSheet.cssRules.length);

} catch (e) {
  console.log('Los estilos ya están definidos');
}