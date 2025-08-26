import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";

const sportGallery = [
  { key: "futbol", label: "Fútbol", img: "https://tse3.mm.bing.net/th/id/OIP.iGksRTcvroEoYyJi8iNnDwHaFH?pid=Api&P=0&h=180" },
  { key: "baloncesto", label: "Baloncesto", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop" },
  { key: "padel", label: "Pádel", img: "https://images.unsplash.com/photo-1624704767960-9abca9a73fb5?w=800&auto=format&fit=crop" },
  { key: "voley", label: "Vóley", img: "https://images.unsplash.com/photo-1599050751766-9893d2b1c1a3?w=800&auto=format&fit=crop" },
  { key: "running", label: "Running", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop" },
];

const [idx, setIdx] = useState(0);
const total = sportGallery.length;

function next() {
  setIdx((i) => (i + 1) % total);
}
function prev() {
  setIdx((i) => (i - 1 + total) % total);
}

export function Home() {
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const token = localStorage.getItem("pick4fun_token");
  const isLogged = !!token;

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

  if (isLogged) {
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

  return (
      <div style={twoCols}>
        {/* Columna izquierda: información */}
        <section style={infoBox}>
          <h1 style={{ marginTop: 0 }}>Pick4Fun</h1>
          <p>
            Pick4Fun te ayuda a <strong>organizar y unirte</strong> a partidos pickup sin complicarte.
          Crea eventos en segundos, <strong>equilibra equipos</strong>, comparte costes y coordínate con tu grupo.
        </p>
          <ul>
            <li>Encuentra jugadores cerca y por nivel.</li>
            <li>Reserva pista y divide pagos por jugador.</li>
            <li>Recordatorios y avisos de última hora.</li>
            <li>Perfil con historial y medallas.</li>
          <li>Soporta varios deportes: fútbol, baloncesto, pádel, vóley y running.</li>
        </ul>
        <p>
          ¿Nuevo en Pick4Fun? <strong>Regístrate</strong> y crea tu primer evento en minutos.  
          Si ya tienes cuenta, simplemente <strong>inicia sesión</strong> para ver y unirte a actividades.
        </p>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <a href="/register" className="btn btn-primary">Registrarse</a>
            <a href="/login" className="btn btn-light">Iniciar sesión</a>
          </div>

          <p style={{ marginTop: 16, color: "#6b7280" }}>
            ¿Ya tienes cuenta? Inicia sesión y crea tu primer evento en minutos.
          </p>
        </section>

        {/* Derecha: galería vertical */}
      <div
  style={carouselCard}
  onWheel={handleWheel}
  onKeyDown={handleKeyDown}
  tabIndex={0}
  >
        <h3 style={{ margin: "0 0 12px 0" }}>Explora deportes</h3>
        <div style={galleryScroll}>
          {sportGallery.map(s => (
            <div key={s.key} style={vSlide}>
              <img src={s.img} alt={s.label} style={vImg} />
              <div style={vLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Estilos */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 16,
};

const twoCols = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  maxWidth: 1100,
  margin: "24px auto",
  padding: 16,
};

const infoBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 24,
  background: "white",
};

/* Tarjeta contenedora de la galería */
const galleryCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "white",
  display: "flex",
  flexDirection: "column",
  minHeight: 420,
  maxHeight: 560, 
};

/* Scroll interno vertical: rueda del ratón solo mueve aquí */
const galleryScroll = {
  overflowY: "auto",
  overscrollBehavior: "contain",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  paddingRight: 6,
};

/* Cada foto como “tarjeta” */
const vSlide = {
  position: "relative",
  width: "100%",
  height: 180,
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const vImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const vLabel = {
  position: "absolute",
  bottom: 8,
  left: 8,
  background: "rgba(0,0,0,0.6)",
  color: "white",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: 14,
};