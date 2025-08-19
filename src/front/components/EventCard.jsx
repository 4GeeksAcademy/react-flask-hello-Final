import React from "react";

export default function EventCard({ event, onJoin }) {
  const date = new Date(event.datetime);
  const demo = !!event._demo;

  let dateLabel = "Por definir";
  if (event?.datetime) {
    const d = new Date(event.datetime);
    if (!isNaN(d.getTime())) dateLabel = d.toLocaleString();
  }

  const canJoin = typeof onJoin === "function" && !!event?.id;

  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
        <h3 style={{ margin:0 }}>{event.sport}</h3>
        <span style={price}>{event.is_free ? "Gratis" : `${event.price} €`}</span>
      </div>
      <p style={muted}>fecha {date.toLocaleString()}</p>
      <p style={muted}>Capacidad {event.capacity}</p>
      <p style={muted}>Ubicacion ({event.lat}, {event.lng})</p>

      <div style={{ display:"flex", gap:8 }}>
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

const card = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 8 };
const price = { fontWeight: 700, color: "#111" };
const badge = { fontSize: 12, background: "#f3f4f6", border: "1px solid #e5e7eb", padding: "2px 6px", borderRadius: 999 };
const muted = { margin: 0, color: "#6b7280" };
const btnPrimary = { background: "#2563eb", color: "white", padding: "8px 12px", border: "none", borderRadius: 10 };
const btnGhost = { textDecoration: "none", color: "#2563eb", padding: "8px 12px", borderRadius: 10, border: "1px solid #bfdbfe" };