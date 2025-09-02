import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// 🖼️ Diccionario de imágenes (igual que en EventCard)
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
      alert("X " + (e.message || "No se pudo unir al evento"));
    } finally {
      setJoining(false);
    }
  }

  async function handleDelete() {
    if (!token) {
      alert("Debes iniciar sesión para eliminar eventos.");
      return;
    }

    if (!confirm("¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const res = await fetch(`${BASE}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      alert("Evento eliminado correctamente.");
      navigate("/");
    } catch (e) {
      alert("Error: " + (e.message || "No se pudo eliminar el evento."));
    }
  }

  if (loading) return <div style={{ padding: 16 }}><p>Cargando…</p></div>;
  if (err) return <div style={{ padding: 16 }}><p className="text-danger">{err}</p></div>;
  if (!event) return <div style={{ padding: 16 }}><p>Evento no encontrado</p></div>;

  
  const sportKey = (event?.sport || "").toLowerCase().trim();
  const imgUrl = sportImages[sportKey];
  const isOwner = currentUser?.id === event.user_id;

  console.log("DEBUG - User ID:", currentUser?.id);
  console.log("DEBUG - Event Creator ID:", event.user_id);
  console.log("DEBUG - Is Owner:", isOwner);

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={btnBack}>← Volver</button>

      <div style={card}>
        {/* CABECERA */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={imgUrl}
              alt={event.sport}
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
            />
            <div>
              <h2 style={{ margin: 0 }}>{event.sport} <span style={price}>{event.is_free ? "Gratis" : `${event.price} €`}</span></h2>
              <h3 style={{ margin: 0, color: "#6b7280" }}>{event.title}</h3>
            </div>
          </div>
        </div>

        {/* Información del evento */}
        <div style={{ marginBottom: 20 }}>
          <p style={muted}>📅 Fecha: {dateLabel}</p>
          <p style={muted}>👥 Capacidad: {event.capacity} jugadores</p>
          <p style={muted}>📍 Ubicación: ({event.address})</p>

           <p style={{ fontSize: 12, color: '#888', marginTop: 10 }}>
            Debug: User {currentUser?.id} vs Event {event.user_id} | Owner: {isOwner ? 'SÍ' : 'NO'}
          </p>

        </div>

        {/*BOTÓN DE ELIMINAR */}
        {isOwner && (
          <button
            onClick={handleDelete}
            style={btnDanger}
            title="Eliminar evento"
          >
             Eliminar Evento
          </button>
        )}

        {/* Formulario para unirse */}
        <form onSubmit={handleJoinSubmit} style={{ marginTop: 20 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Mensaje para el organizador (opcional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ej: llevo mucho tiempo jugando, ¿queda plaza?"
            style={{ 
              width: '100%', 
              padding: 10, 
              border: '1px solid #ccc', 
              borderRadius: 8, 
              marginBottom: 12,
              minHeight: 80 
            }}
          />
          <button 
            style={{ ...btnPrimary, opacity: joining ? 0.7 : 1 }} 
            disabled={joining}
          >
            {joining ? "Uniéndose..." : "Unirse al evento"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* Estilos */
const card = { 
  border: "1px solid #e5e7eb", 
  borderRadius: 16, 
  padding: 24, 
  display: "flex", 
  flexDirection: "column", 
  gap: 16,
  background: "#fff"
};
const price = { 
  fontWeight: 700, 
  color: "#111", 
  fontSize: 18,
  background: "#f1f5f9",
  padding: "4px 12px",
  borderRadius: 20
};
const muted = { 
  margin: "8px 0", 
  color: "#6b7280", 
  fontSize: 16 
};
const btnBack = {
  background: "none",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  fontSize: 16,
  marginBottom: 16,
  padding: 0
};
const btnPrimary = { 
  background: "#2563eb", 
  color: "white", 
  padding: "12px 20px", 
  border: "none", 
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 16,
  width: "100%"
};
const btnDanger = {
  background: "#ef4444",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginBottom: 16
};