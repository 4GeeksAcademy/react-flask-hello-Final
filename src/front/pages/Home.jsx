import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";

const sportGallery = [
  { key: "futbol", label: "Fútbol", img: "https://tse3.mm.bing.net/th/id/OIP.iGksRTcvroEoYyJi8iNnDwHaFH?pid=Api&P=0&h=180" },
  { key: "baloncesto", label: "Baloncesto", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop" },
  { key: "padel", label: "Pádel", img: "https://images.unsplash.com/photo-1624704767960-9abca9a73fb5?w=800&auto=format&fit=crop" },
  { key: "voley", label: "Vóley", img: "https://images.unsplash.com/photo-1599050751766-9893d2b1c1a3?w=800&auto=format&fit=crop" },
  { key: "running", label: "Running", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop" },
];



export function Home() {
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const token = localStorage.getItem("pick4fun_token");



  // cargar eventos
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE}/api/events`);
        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);
        if (mounted) setEvents(data);
      } catch (e) {
        if (mounted) setErr(e.message || "Error cargando eventos.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [BASE]);

  // función para unirse a eventos
  async function handleJoin(eventId) {
    if (!token) {
      alert("Primero inicia sesión para unirte.");
      window.location.assign("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE}/api/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      alert("Te has unido al evento.");
      const refresh = await fetch(`${BASE}/api/events`);
      const list = await refresh.json().catch(() => []);
      if (refresh.ok) setEvents(list);
    } catch (e) {
      alert("X " + (e.message || "No se pudo unir al evento."));
    }
  }

  return (
    <div style={{ padding: "16px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Eventos</h1>
        <a href="/events/new" className="btn btn-primary">Crear evento</a>
      </div>

      {loading && <p>Cargando eventos…</p>}
      {err && <p className="text-danger">Error: {err}</p>}

      {!loading && !err && events.length === 0 && (
        <div style={{ padding: 24, border: "1px dashed #d1d5db", borderRadius: 12 }}>
          <p>No hay eventos todavía.</p>
          <a href="/events/new" className="btn btn-light">Crea el primero</a>
        </div>
      )}

      {!loading && !err && events.length > 0 && (
        <div style={grid}>
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} onJoin={handleJoin} />
          ))}
        </div>
      )}
    </div>
  );


}

/* Estilos */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 16,
};