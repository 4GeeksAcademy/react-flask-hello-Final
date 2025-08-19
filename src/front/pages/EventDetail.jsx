import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
  const token = localStorage.getItem("pick4fun_token");
  const isLogged = !!token;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE}/api/events/${id}`);
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

  async function handleJoin() {
    if (!isLogged) {
      alert("Inicia sesión para unirte.");
      navigate("/login");
      return;
    }




    alert("La función 'Unirse' está desactivada en el backend por ahora.");
  }






  if (loading) return <div style={{ padding: 16 }}><p>Cargando…</p></div>;
  if (err) return <div style={{ padding: 16 }}><p className="text-danger">{err}</p></div>;

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} className="btn btn-light">← Volver</button>
      <h2 style={{ marginTop: 12 }}>{event.sport}</h2>
      <p>Fecha {new Date(event.datetime).toLocaleString()}</p>
      <p> Localizacion ({event.lat}, {event.lng})</p>
      <p> Capacidad: {event.capacity}</p>
      <p> Precio {event.is_free ? "Gratis" : `${event.price} €`}</p>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleJoin} className="btn btn-primary">Unirse</button>
      </div>
    </div>
  );
}