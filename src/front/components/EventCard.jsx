import React from "react";
import { useNavigate } from "react-router-dom";

const sportImages = {
  futbol: "https://static.vecteezy.com/system/resources/previews/027/829/024/non_2x/close-up-of-many-soccer-players-kicking-a-football-on-a-field-competition-scene-created-with-generative-ai-technology-photo.jpg",
  baloncesto: "https://images.unsplash.com/photo-1546519638-68e109498ffc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFsb25jZXN0b3xlbnwwfHwwfHx8MA%3D%3D",
  pádel: "https://rekoveryclinic.com/wp-content/uploads/2023/06/jugadoras-de-padel-practicando-deporte.jpg",
  tenis: "https://media.istockphoto.com/id/1455497361/es/foto/pareja-joung-en-cancha-de-tenis-hombre-guapo-y-mujer-atractiva-están-jugando-al-tenis.jpg?s=612x612&w=0&k=20&c=pyiCggfukCyHPVjHq8Ab85pIHrSPqnnrgWVin4OsFwY=",
  voleibol: "https://media.istockphoto.com/id/485863392/es/foto/voleibol-de-playa-doble-en-la-red.jpg?s=612x612&w=0&k=20&c=kASUs8YfY3cz138qCcjfybQ-PDQ3JM2G1lb5VWKDtlo=",
  running: "https://media.istockphoto.com/id/612398606/es/foto/maratón-de-carrera-de-atletismo.jpg?s=612x612&w=0&k=20&c=xNejNoZ25NnqINi4T5qqv57BFaashjvF16j8m4-BTsY=",
};

const sportGradients = {
  futbol: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
  baloncesto: "linear-gradient(135deg, #4ecdc4, #44a08d)",
  pádel: "linear-gradient(135deg, #a8e6cf, #88d8b0)",
  tenis: "linear-gradient(135deg, #ffd93d, #ff9a3d)",
  voleibol: "linear-gradient(135deg, #6a11cb, #2575fc)",
  running: "linear-gradient(135deg, #667eea, #764ba2)",
};

export default function EventCard({ event, onJoin, onDelete, isOwner }) {
  const navigate = useNavigate();
  
  if (!event) return null;
  const canJoin = typeof onJoin === "function" && !!event?.id;
  const canDelete = typeof onDelete === "function" && !!event?.id && isOwner;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Fecha por definir";
    }
  };

  const sportKey = (event?.sport || "").toLowerCase().trim();
  const imgUrl = event.image_url || sportImages[sportKey] || sportImages.futbol;
  const sportGradient = sportGradients[sportKey] || sportGradients.futbol;

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div style={styles.card}>
      {/* Imagen del evento */}
      <div style={styles.imageContainer}>
        <img 
          src={imgUrl} 
          alt={event.sport} 
          style={styles.image}
        />
        <div style={styles.imageOverlay}></div>
        <div style={styles.sportBadge}>
          <span style={{...styles.sportText, background: sportGradient}}>
            {event.sport}
          </span>
        </div>
        <div style={styles.priceTag}>
          {event.is_free ? '🎯 GRATIS' : `$${event.price}`}
        </div>
      </div>
      
      {/* Contenido de la tarjeta */}
      <div style={styles.content}>
        <h3 style={styles.title}>{event.title || "Evento Deportivo"}</h3>
        
        {/* Información del evento */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>👤</span>
            <span style={styles.infoText}>Organizador</span>
          </div>
          
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>📅</span>
            <span style={styles.infoText}>{formatDate(event.datetime)}</span>
          </div>
          
          {event.address && (
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📍</span>
              <span style={styles.infoText}>{event.address}</span>
            </div>
          )}
          
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>👥</span>
            <span style={styles.infoText}>{event.capacity} personas</span>
          </div>
        </div>

        {/* Descripción */}
        {event.description && (
          <div style={styles.description}>
            <p style={styles.descriptionText}>
              {event.description.length > 120 
                ? event.description.substring(0, 120) + '...' 
                : event.description}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div style={styles.actions}>
          <button 
            style={styles.detailsButton}
            onClick={handleViewDetails}
          >
            Ver Detalles
          </button>
          
          {canJoin && (
            <button 
              style={styles.joinButton}
              onClick={() => onJoin(event.id)}
            >
              Unirse
            </button>
          )}
          
          {canDelete && (
            <button 
              style={styles.deleteButton}
              onClick={() => onDelete(event.id)}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ESTILOS ESPECTACULARES COHERENTES CON LA APP */
const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))',
  },
  sportBadge: {
    position: 'absolute',
    top: '15px',
    left: '15px',
  },
  sportText: {
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'capitalize',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  priceTag: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    color: '#333',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    lineHeight: 1.3,
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  infoIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  infoText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.3,
  },
  description: {
    paddingTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  descriptionText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.5,
    margin: 0,
    fontStyle: 'italic',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  detailsButton: {
    flex: 2,
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  joinButton: {
    flex: 1,
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
  },
  deleteButton: {
    flex: 1,
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
  },
};

// Efectos hover para la tarjeta
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    .event-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .event-card:hover .event-image {
      transform: scale(1.05);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .details-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .join-button:hover {
      transform: translateY(-2px);
      boxShadow: 0 6px 20px rgba(78, 205, 196, 0.4);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .delete-button:hover {
      transform: translateY(-2px);
      boxShadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }
  `, styleSheet.cssRules.length);

} catch (e) {
  console.log('Los estilos ya están definidos');
}