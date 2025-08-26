import React from "react";

const sportImages = {
  futbol:
    "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=400&auto=format&fit=crop",
  baloncesto:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&auto=format&fit=crop",
  pádel:
    "https://images.unsplash.com/photo-1624704767960-9abca9a73fb5?w=400&auto=format&fit=crop",
  padel:
    "https://images.unsplash.com/photo-1624704767960-9abca9a73fb5?w=400&auto=format&fit=crop",
  voley:
    "https://images.unsplash.com/photo-1599050751766-9893d2b1c1a3?w=400&auto=format&fit=crop",
  voleibol:
    "https://images.unsplash.com/photo-1599050751766-9893d2b1c1a3?w=400&auto=format&fit=crop",
  running:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1530925481040-4961e0155b16?w=400&auto=format&fit=crop";

export default function EventCard({ event, onJoin }) {
  const date = new Date(event.datetime);
  const demo = !!event._demo;

  let dateLabel = "Por definir";
  if (event?.datetime) {
    const d = new Date(event.datetime);
    if (!isNaN(d.getTime())) dateLabel = d.toLocaleString();
  }

  const canJoin = typeof onJoin === "function" && !!event?.id;

  const sportKey = (event?.sport || "").toLowerCase().trim();
  const imgUrl = sportImages[sportKey] || fallbackImage;

  return (
    <div style={card}>
      {/* CABECERA: imagen redonda + título + precio */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={imgUrl}
            alt={event.sport}
            style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
          />
          <h3 style={{ margin: 0, fontSize: 20}}>{event.sport}</h3>
        </div>
        <span style={price}>{event.is_free ? "Gratis" : `${event.price} €`}</span>
      </div>

      {/* usar tu dateLabel */}
      <p style={muted}>Fecha {dateLabel}</p>
      <p style={muted}>Capacidad {event.capacity}</p>
      <p style={muted}>Ubicación ({event.lat}, {event.lng})</p>

      <div style={{ display: "flex", gap: 8 }}>
        <a href={`/events/${event.id}`} style={btnGhost}>Ver</a>
        <button
          onClick={() => canJoin && onJoin(event.id, demo)}
          style={{ ...btnPrimary, opacity: canJoin ? 1 : 0.6, cursor: canJoin ? "pointer" : "not-allowed" }}
          disabled={!canJoin}
        >
          Unirse
        </button>
      </div>
    </div>
  );
}

/* estilos originales + sin cambios innecesarios */
const card = { border: "1px solid #e5e7eb", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 12, fontSize: 16 };
const price = { fontWeight: 700, color: "#111", fontSize: 16 };
const badge = { fontSize: 12, background: "#f3f4f6", border: "1px solid #e5e7eb", padding: "2px 6px", borderRadius: 999 };
const muted = { margin: 0, color: "#6b7280", fontSize: 14 };
const btnPrimary = { background: "#2563eb", color: "white", padding: "10px 16px", border: "none", borderRadius: 10 };
const btnGhost = { textDecoration: "none", color: "#2563eb", padding: "10px 16px", borderRadius: 10, border: "1px solid #bfdbfe" };