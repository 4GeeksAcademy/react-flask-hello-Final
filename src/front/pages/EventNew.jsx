import React, { useState } from "react";

export default function EventNew() {
    const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
    const token = localStorage.getItem("pick4fun_token");
    const user = localStorage.getItem("user");

    const [form, setForm] = useState({
    sport: "futbol",
    datetime: "",
    lat: "",
    lng: "",
    capacity: 10,
    price: 0,
  });

  const [saving, setSaving] = useState(false);
   function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      alert("Debes iniciar sesión para crear eventos.");
      window.location.assign("/login");
      return;
}

    let iso = form.datetime;
    try {
      iso = new Date(form.datetime).toISOString();
    } catch {
      alert("Fecha/hora inválida");
      return;
    }

    try {
      setSaving(true);
      if (user) {
        let parseUser = JSON.parse(user);

        const res = await fetch(`${BASE}api/events/${parseUser.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sport: form.sport,
            datetime: iso,
            lat: Number(form.lat),
            lng: Number(form.lng),
            capacity: Number(form.capacity),
            price: Number(form.price),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);
      }
      
      

      alert("Evento creado");
      window.location.assign("/"); // vuelve a Home para verlo listado
    } catch (err) {
      alert("X " + (err.message || "No se pudo crear el evento"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 640, margin: "0 auto" }}>
      <h2>Crear evento</h2>
      <form onSubmit={handleSubmit}>
        <div style={row}>
          <label>Deporte</label>
          <select name="sport" className="form-control" value={form.sport} onChange={handleChange}>
            <option value="futbol">Fútbol</option>
            <option value="baloncesto">Baloncesto</option>
            <option value="padel">Pádel</option>
            <option value="voley">Voleibol</option>
            <option value="running">Running</option>
          </select>
        </div>

        <div style={row}>
          <label>Fecha y hora</label>
          <input
            type="datetime-local"
            name="datetime"
            className="form-control"
            value={form.datetime}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={row}>
            <label>Latitud</label>
            <input name="lat" className="form-control" value={form.lat} onChange={handleChange} placeholder="40.4168" />
          </div>
          <div style={row}>
            <label>Longitud</label>
            <input name="lng" className="form-control" value={form.lng} onChange={handleChange} placeholder="-3.7038" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={row}>
            <label>Capacidad</label>
            <input type="number" min={1} name="capacity" className="form-control" value={form.capacity} onChange={handleChange} />
          </div>
          <div style={row}>
            <label>Precio (€)</label>
            <input type="number" min={0} name="price" className="form-control" value={form.price} onChange={handleChange} />
          </div>
        </div>

        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Creando..." : "Crear evento"}
        </button>
      </form>
    </div>
  );
}

const row = { marginBottom: 12, display: "flex", flexDirection: "column", gap: 6 };