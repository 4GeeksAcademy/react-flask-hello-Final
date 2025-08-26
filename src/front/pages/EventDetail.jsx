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
  const [joining, setJoining] = useState(false);
  const [note, setNote] = useState("");

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
          "content-type": "application/json",
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

    if (loading) return <div style={{ padding: 16 }}><p>Cargando…</p></div>;
    if (err) return <div style={{ padding: 16 }}><p className="text-danger">{err}</p></div>;

    return (
      <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => navigate(-1)} className="btn btn-light">← Volver</button>
        <h2 style={{ marginTop: 12 }}>{event.sport}</h2>
        <p>Fecha {new Date(event.datetime).toLocaleString()}</p>
        <p> Localización ({event.lat}, {event.lng})</p>
        <p> Capacidad: {event.capacity}</p>
        <p> Precio {event.is_free ? "Gratis" : `${event.price} €`}</p>

        {/* Formulario para unirse */}
        <form onSubmit={handleJoinSubmit} style={{ marginTop: 20 }}>
          <label>Mensaje para el organizador (opcional)</label>
          <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ej: Tengo experiencia, ¿queda plaza?"
            style={{ marginBottom: 12 }}
          />
          <button className="btn btn-primary" disabled={joining}>
            {joining ? "Uniéndose..." : "Unirse al evento"}
          </button>
        </form>
      </div>
    );
  }