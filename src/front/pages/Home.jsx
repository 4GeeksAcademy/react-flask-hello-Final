import React, { useEffect, useState} from "react";
import EventCard from "../components/EventCard";
import Registro from "../pages/Registro"

export default function Home() {
	const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState("");

	useEffect(() =>{
		let mounted = true;
		(async () =>{
			try{
				const res = await fetch (`${BASE}/api/events`);
				const data = await res.json().catch(() => ([]));
				if (!res.ok) {
					throw new Error(data.message || data.msg || `HTTP ${res.status}`);
				}

				if (mounted) setEvents(data);
			} catch (e) {
				if (mounted) setErr(e.message || "Error cargando eventos.");
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {mounted = false;};
	}, [BASE]);

	async function handleJoin(eventId) {
		const token = localStorage.getItem("pick4fun_token");
		if (!token) {
			alert("Primero inicia sesion para unirte.");
			window.location.assign("/login");
			return;
		}
	
	try {
		const res = await fetch(`${BASE}/api/events/${eventId}/join`,{
			method:  "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await res.json().catch(() => ({}));
		if (!res.ok) {
			throw new Error(data.message || data.msg || `HTTP ${res.status}`);
		}
		alert("Te has unido al evento.");

		const refresh = await fetch(`${BASE}/api/events`);
		const list = await refresh.json().catch(() => ([]));
		if (refresh.ok) setEvents(list);
	} catch (e) {
		alert ("X" + (e.message || "No se pudo unir al evento."));
	}
}

return (
	<div style={{ padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Pick4Fun</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => window.location.assign("/registro")}>Registrarse</button>
          <button onClick={() => window.location.assign("/login")}>Iniciar sesión</button>
          <button onClick={() => window.location.assign("/events/new")}>Crear evento</button>
        </div>
      </header>

      {loading && <p>Cargando eventos…</p>}
      {err && <p className="text-danger">Error: {err}</p>}

      {!loading && !err && events.length === 0 && (
        <div style={{ padding: 24, border: "1px dashed #d1d5db", borderRadius: 12 }}>
          <p>No hay eventos todavía.</p>
          <button onClick={() => window.location.assign("/events/new")}>Crea el primero</button>
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

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 16,
};