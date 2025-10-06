import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const sportImages = {
  futbol: "https://static.vecteezy.com/system/resources/previews/027/829/024/non_2x/close-up-of-many-soccer-players-kicking-a-football-on-a-field-competition-scene-created-with-generative-ai-technology-photo.jpg",
  baloncesto: "https://images.unsplash.com/photo-1546519638-68e109498ffc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFsb25jZXN0b3xlbnwwfHwwfHx8MA%3D%3D",
  pádel: "https://rekoveryclinic.com/wp-content/uploads/2023/06/jugadoras-de-padel-practicando-deporte.jpg",
  tenis: "https://media.istockphoto.com/id/1455497361/es/foto/pareja-joven-en-cancha-de-tenis-hombre-guapo-y-mujer-atractiva-est%C3%A1n-jugando-al-tenis.jpg?s=612x612&w=0&k=20&c=pyiCggfukCyHPVjHq8Ab85pIHrSPqnnrgWVin4OsFwY=",
  voleibol: "https://media.istockphoto.com/id/485863392/es/foto/voleibol-de-playa-doble-en-la-red.jpg?s=612x612&w=0&k=20&c=kASUs8YfY3cz138qCcjfybQ-PDQ3JM2G1lb5VWKDtlo=",
  running: "https://media.istockphoto.com/id/612398606/es/foto/marat%C3%B3n-de-carrera-de-atletismo.jpg?s=612x612&w=0&k=20&c=xNejNoZ25NnqINi4T5qqv57BFaashjvF16j8m4-BTsY=",
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
  const token = localStorage.getItem("pick4fun_token");
  const isLogged = !!token;
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [joining, setJoining] = useState(false);
  const [note, setNote] = useState("");

  let dateLabel = "Por definir";
  if (event?.datetime) {
    try {
      const d = new Date(event.datetime);
      if (!isNaN(d.getTime())) {
        dateLabel = d.toLocaleString();
      }
    } catch (e) {
      console.error("Error parsing date:", e);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE}api/events/${id}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);
        if (mounted) setEvent(data);
      } catch (e) {
        if (mounted) setErr(e.message || "No se pudo cargar el evento.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [BASE, id]);

  async function handleJoinSubmit(e) {
    e.preventDefault();
    if (!isLogged) {
      alert("Debes iniciar sesion para unirte");
      navigate("/login");
      return;
    }
    try  {
      setJoining(true);
      const res = await fetch(`${BASE}api/events/${id}/join`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({note}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);
      alert("¡Te has unido al evento!");
      navigate("/");
    } catch (e) {
      alert("✗ " + (e.message || "No se pudo unir al evento"));
    } finally {
      setJoining(false);
    }
  }

  async function handleDelete() {
    const token = localStorage.getItem("pick4fun_token");
    if (!token) {
      alert("Debes iniciar sesión para eliminar eventos.");
      return;
    }
    if (!confirm("¿Estás seguro de que quieres eliminar el evento? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const res = await fetch(`${BASE}/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      alert("Evento eliminado correctamente.");
      navigate("/");
    } catch (e) {
      alert("Error: " + (e.message || "No se pudo eliminar el evento."));
    }
  }

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Cargando evento...</p>
    </div>
  );
  
  if (err) return (
    <div style={styles.errorContainer}>
      <div style={styles.errorIcon}>⚠️</div>
      <p style={styles.errorText}>{err}</p>
    </div>
  );
  
  if (!event) return (
    <div style={styles.errorContainer}>
      <p style={styles.errorText}>Evento no encontrado</p>
    </div>
  );

  const sportKey = (event?.sport || "").toLowerCase().trim();
  const imgUrl = event.image_url || sportImages[sportKey];
  const isOwner = currentUser?.id === event.user_id;

  return (
    <div style={styles.container}>
      {/* Fondo animado */}
      <div style={styles.background}></div>
      <div style={styles.particles}></div>
      
      <div style={styles.content}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <span style={styles.backIcon}>←</span> Volver
        </button>

        <div style={styles.card}>
          {/* Header del Evento */}
          <div style={styles.eventHeader}>
            <div style={styles.avatarSection}>
              <div style={styles.avatarContainer}>
                <img
                  src={imgUrl}
                  alt={event.sport}
                  style={styles.avatar}
                />
                <div style={styles.avatarGlow}></div>
              </div>
              <div style={styles.titleSection}>
                <h1 style={styles.eventTitle}>
                  {event.sport} 
                  <span style={styles.price}>
                    {event.is_free ? "🎯 Gratis" : `${event.price} €`}
                  </span>
                </h1>
                <h2 style={styles.eventSubtitle}>{event.title}</h2>
              </div>
            </div>
          </div>

          {/* Información del Evento */}
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📅</span>
              <div>
                <p style={styles.infoLabel}>Fecha y Hora</p>
                <p style={styles.infoValue}>{dateLabel}</p>
              </div>
            </div>
            
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>👥</span>
              <div>
                <p style={styles.infoLabel}>Capacidad</p>
                <p style={styles.infoValue}>{event.capacity} jugadores</p>
              </div>
            </div>
            
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📍</span>
              <div>
                <p style={styles.infoLabel}>Ubicación</p>
                <p style={styles.infoValue}>{event.address}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {event.description && (
            <div style={styles.descriptionSection}>
              <h3 style={styles.descriptionTitle}>📝 Descripción</h3>
              <p style={styles.descriptionText}>{event.description}</p>
            </div>
          )}

          {/* Botón de Eliminación */}
          {isOwner && (
            <button
              onClick={handleDelete}
              style={styles.deleteButton}
              title="Eliminar evento"
            >
              🗑️ Eliminar Evento
            </button>
          )}

          {/* Formulario para Unirse */}
          <form onSubmit={handleJoinSubmit} style={styles.joinForm}>
            <h3 style={styles.formTitle}>🎯 Únete al Evento</h3>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>💬</span>
                Mensaje para el organizador (opcional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="¡Hola! Llevo mucho tiempo jugando, ¿queda plaza? 🏆"
                style={styles.textarea}
              />
            </div>

            <button 
              style={{ 
                ...styles.joinButton, 
                opacity: joining ? 0.7 : 1,
                transform: joining ? "scale(0.98)" : "scale(1)"
              }} 
              disabled={joining}
            >
              {joining ? (
                <>
                  <div style={styles.spinner}></div>
                  Uniéndose...
                </>
              ) : (
                "✅ Unirse al Evento"
              )}
            </button>
          </form>
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
    maxWidth: '800px',
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
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4ecdc4 100%)',
    color: '#fff',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  errorText: {
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  backButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.1rem',
    marginBottom: '30px',
    padding: '12px 24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  },
  backIcon: {
    fontSize: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '25px',
    padding: '40px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
  },
  eventHeader: {
    marginBottom: '40px',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    flexWrap: 'wrap',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    zIndex: 2,
  },
  avatarGlow: {
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    right: '-8px',
    bottom: '-8px',
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
    borderRadius: '50%',
    filter: 'blur(12px)',
    opacity: 0.6,
    animation: 'glow 2s ease-in-out infinite alternate',
  },
  titleSection: {
    flex: 1,
  },
  eventTitle: {
  fontSize: '2.5rem',
  fontWeight: '800',
  background: 'linear-gradient(135deg, #fff, #a8e6cf)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: '0 0 10px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  flexWrap: 'wrap',
},
 price: {
  padding: '10px 20px',
  fontSize: '1.3 rem',
  fontWeight: '900',
  color: '#191717ff',
  marginLeft: '15px',
},
  eventSubtitle: {
    fontSize: '1.5rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    margin: 0,
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '40px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  infoIcon: {
    fontSize: '28px',
    flexShrink: 0,
  },
  infoLabel: {
    margin: '0 0 5px 0',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    fontWeight: '500',
  },
  infoValue: {
    margin: 0,
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: '40px',
    padding: '25px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  descriptionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: '0 0 15px 0',
    color: '#fff',
  },
  descriptionText: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.6',
    margin: 0,
  },
  deleteButton: {
    background: 'linear-gradient(135deg, #ff6b6b, #c23616)',
    color: 'white',
    padding: '16px 32px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    width: '100%',
    marginBottom: '30px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
  },
  joinForm: {
    marginTop: '30px',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 25px 0',
    color: '#fff',
    textAlign: 'center',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '25px',
  },
  label: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  labelIcon: {
    fontSize: '20px',
  },
  textarea: {
    padding: '18px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  joinButton: {
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    color: 'white',
    padding: '18px 32px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: '700',
    width: '100%',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 30px rgba(78, 205, 196, 0.4)',
  },
  floatingElement1: {
    position: 'absolute',
    top: '15%',
    left: '8%',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, #ff6b6b, transparent)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.3,
    animation: 'floatElement 6s ease-in-out infinite',
  },
  floatingElement2: {
    position: 'absolute',
    bottom: '12%',
    right: '12%',
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
    top: '55%',
    left: '72%',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #a8e6cf, transparent)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.25,
    animation: 'floatElement 10s ease-in-out infinite',
  },
};