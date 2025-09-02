import React from "react";
import { useNavigate } from "react-router-dom";


const sportImages = {
  futbol:
    "https://static.vecteezy.com/system/resources/previews/027/829/024/non_2x/close-up-of-many-soccer-players-kicking-a-football-on-a-field-competition-scene-created-with-generative-ai-technology-photo.jpg",
  baloncesto:
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFsb25jZXN0b3xlbnwwfHwwfHx8MA%3D%3D",
  pádel:
    "https://rekoveryclinic.com/wp-content/uploads/2023/06/jugadoras-de-padel-practicando-deporte.jpg",
  Tenis:
    "https://media.istockphoto.com/id/1455497361/es/foto/pareja-joven-en-cancha-de-tenis-hombre-guapo-y-mujer-atractiva-est%C3%A1n-jugando-al-tenis.jpg?s=612x612&w=0&k=20&c=pyiCggfukCyHPVjHq8Ab85pIHrSPqnnrgWVin4OsFwY=",
  voleibol:
    "https://media.istockphoto.com/id/485863392/es/foto/voleibol-de-playa-doble-en-la-red.jpg?s=612x612&w=0&k=20&c=kASUs8YfY3cz138qCcjfybQ-PDQ3JM2G1lb5VWKDtlo=",
  running:
    "https://media.istockphoto.com/id/612398606/es/foto/marat%C3%B3n-de-carrera-de-atletismo.jpg?s=612x612&w=0&k=20&c=xNejNoZ25NnqINi4T5qqv57BFaashjvF16j8m4-BTsY=",
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
  const imgUrl = sportImages;
  

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 16, 
      padding: 22, 
      display: "flex", 
      flexDirection: "column", 
      gap: 12, 
      fontSize: 16,
      background: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      {imgUrl && (
        <img 
          src={imgUrl} 
          alt={event.sport} 
          style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px'}}
        />
      )}
      
      
      <h5 style={{margin: '8px 0', fontSize: '18px'}}>{event.title || "Evento Deportivo"}</h5>
      
      
      <p style={{margin: '4px 0', color: '#6b7280', fontSize: '14px', textTransform: 'capitalize'}}>
        🏆 {event.sport}
      </p>
      
      
      {event.description && (
        <p style={{margin: '8px 0', color: '#6b7280', fontSize: '14px', fontStyle: 'italic'}}>
          {event.description.length > 100 
            ? event.description.substring(0, 100) + '...' 
            : event.description}
        </p>
      )}
      
      <p style={{margin: 0, color: "#6b7280", fontSize: 14}}>📅 {formatDate(event.datetime)}</p>
      
      {event.address && (
        <p style={{margin: 0, color: "#6b7280", fontSize: 14}}>📍 {event.address}</p>
      )}
      
      <p style={{margin: 0, color: "#6b7280", fontSize: 14}}>👥 Capacidad: {event.capacity} personas</p>
      
      <div style={{ 
        fontWeight: 700, 
        color: "#111", 
        fontSize: 16,
        background: "#f1f5f9",
        padding: "4px 8px",
        borderRadius: 12,
        textAlign: 'center'
      }}>
        {event.is_free ? 'GRATIS' : `$${event.price} por persona`}
      </div>
      
      <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
        <button style={{ 
          background: "#2563eb", 
          color: "white", 
          padding: "10px 16px", 
          border: "none", 
          borderRadius: 10,
          cursor: "pointer",
          flex: 1
        }} onClick={handleViewDetails}>
          Ver Detalles
        </button>
        
        {canJoin && (
          <button style={{ 
            background: "#2563eb", 
            color: "white", 
            padding: "10px 16px", 
            border: "none", 
            borderRadius: 10,
            cursor: "pointer",
            flex: 1
          }} onClick={() => onJoin(event.id)}>
            Unirse
          </button>
        )}
        
        {canDelete && (
          <button style={{
            background: "#ef4444",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            flex: 1
          }} onClick={() => onDelete(event.id)}>
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}