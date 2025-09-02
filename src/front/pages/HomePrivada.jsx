import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard"; 

export default function HomePrivada() {
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const token = localStorage.getItem("pick4fun_token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Función para cargar eventos
 const loadEvents = async () => {
    try {
      const res = await fetch(`${BASE}api/events`);
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);
      setEvents(data);
    } catch (e) {
      setErr(e.message || "Error cargando eventos.");
    } finally {
      setLoading(false);
    }
  };

  // cargar eventos
  useEffect(() => {
    loadEvents();
  }, [BASE]);

  // función para unirse a eventos
  async function handleJoin(eventId) {
    if (!token) {
      alert("Primero inicia sesión para unirte.");
      window.location.assign("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE}api/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      alert("Te has unido al evento.");
      loadEvents(); 
    } catch (e) {
      alert("X " + (e.message || "No se pudo unir al evento."));
    }
  }

  async function handleDelete(eventId) {
  const eventToDelete = events.find(ev => ev.id === eventId);

  if (!token) {
    alert("Debes iniciar sesión para eliminar eventos.");
    return;
  }
  if (!confirm("¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.")) {
      return;
    }

  try {
    console.log("Enviando DELETE request...");
    const res = await fetch(`${BASE}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
    
    if (!res.ok) {
      console.error("Error del servidor:", data);
      throw new Error(data.message || data.msg || `HTTP ${res.status}`);
    }

    alert("Evento eliminado correctamente.");
    loadEvents();
  } catch (e) {
    console.error("Error completo:", e);
    alert("Error: " + (e.message || "No se pudo eliminar el evento."));
  }
}

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Eventos Disponibles</h1>
        <a href="/events/new" className="btn btn-primary">Crear evento</a>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando eventos…</p>
        </div>
      )}
      
      {err && (
        <div className="alert alert-danger" role="alert">
          Error: {err}
        </div>
      )}

      {!loading && !err && events.length === 0 && (
        <div className="text-center py-5 border rounded">
          <h4 className="text-muted">No hay eventos todavía</h4>
          <p className="text-muted mb-3">Sé el primero en crear un evento deportivo</p>
          <a href="/events/new" className="btn btn-outline-primary">Crear el primer evento</a>
        </div>
      )}

      {!loading && !err && events.length > 0 && (
        <div>
          <p className="text-muted mb-3">Se encontraron {events.length} eventos</p>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {events.map((ev) => (
              <div key={ev.id} className="col">
                <EventCard 
                  event={ev} 
                  onJoin={handleJoin}
                  onDelete={handleDelete}
                  isOwner={currentUser?.id === ev.user_id}
              />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}