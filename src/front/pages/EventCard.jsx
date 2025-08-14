import React from "react";

export default function EventCard({ event, onJoin }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
      <h3>{event.sport}</h3>
      <p>Fecha: {new Date(event.datetime).toLocaleString()}</p>
      <p>Capacidad: {event.players_count || 0}/{event.capacity}</p>
      <p>Precio: {event.is_free ? "Gratis" : `${event.price}€`}</p>
      <button onClick={() => onJoin(event.id)}>Unirse</button>
    </div>
  );
}