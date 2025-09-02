import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Lista de ubicaciones
const predefinedLocations = [
  { id: 1, name: "Polideportivo Municipal Central", lat: 40.4168, lng: -3.7038, address: "Calle Deporte, 123" },
  { id: 2, name: "Pistas de Tenis Norte", lat: 40.4268, lng: -3.7138, address: "Avenida del Tenis, 45" },
  { id: 3, name: "Campo de Fútbol La Luz", lat: 40.4068, lng: -3.6938, address: "Plaza del Fútbol, 67" },
  { id: 4, name: "Pabellón Deportivo Este", lat: 40.4188, lng: -3.7238, address: "Calle del Baloncesto, 89" },
  { id: 5, name: "Pistas de Pádel Oeste", lat: 40.4088, lng: -3.7338, address: "Camino del Pádel, 12" },
  { id: 6, name: "Piscina Municipal", lat: 40.4128, lng: -3.7138, address: "Paseo de la Natación, 34" }
];

export default function EventNew() {
  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
  
  const [form, setForm] = useState({
    title: "", 
    sport: "",
    description: "", 
    date: "",
    time: "",
    capacity: "",
    price: "0",
    location_type: "predefined",
    predefined_location: "",
    custom_address: ""
});
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("pick4fun_token");
      const eventDatetime = new Date(`${form.date}T${form.time}:00`);

      let finalAddress = "";
      if (form.location_type === "predefined" && form.predefined_location) {
        const selectedLocation = predefinedLocations.find(loc => loc.id === parseInt(form.predefined_location));
        finalAddress = selectedLocation ? selectedLocation.address : "";
      } else {
        finalAddress = form.custom_address;
      }
      
      const eventData = {
        title: form.title,  
        sport: form.sport,
        description: form.description,  
        datetime: eventDatetime.toISOString(),
        address: finalAddress,
        capacity: parseInt(form.capacity),
        price: parseFloat(form.price),
      };

      const res = await fetch(`${BASE}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      alert("Evento creado correctamente!");
      navigate("/");
    } catch (err) {
      alert("Error: " + (err.message || "No se pudo crear el evento"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Crear Nuevo Evento</h2>
          
          <form onSubmit={handleSubmit}>
            {/* TÍTULO - Arriba de todo */}
            <div className="mb-3">
              <label className="form-label">Título del evento</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="form-control"
                placeholder="Ej: Partido de fútbol sabatino"
                required
              />
            </div>

            {/* DEPORTE - Debajo del título */}
            <div className="mb-3">
              <label className="form-label">Deporte</label>
              <select
                name="sport"
                value={form.sport}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Selecciona un deporte</option>
                <option value="futbol">Fútbol</option>
                <option value="baloncesto">Baloncesto</option>
                <option value="tenis">Tenis</option>
                <option value="padel">Pádel</option>
                <option value="voleibol">Voleibol</option>
                <option value="running">Running</option>
              </select>
            </div>

            {/* FECHA y HORA en la misma línea */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* CAPACIDAD y PRECIO en la misma línea */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Número de jugadores</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="form-control"
                  min="2"
                  placeholder="¿Cuántos jugadores necesitas?"
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Precio por persona (€)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="form-control"
                  min="0"
                  step="0.5"
                  placeholder="0 si es gratis"
                  required
                />
                <small className="text-muted">
                  {form.price == 0 ? "Evento gratuito" : `Cada jugador pagará ${form.price}€`}
                </small>
              </div>
            </div>

            {/* UBICACIÓN - Individual */}
            <div className="mb-4">
              <label className="form-label fw-bold">Ubicación</label>
              
              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="location_type"
                    value="predefined"
                    checked={form.location_type === "predefined"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Seleccionar ubicación predefinida
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="location_type"
                    value="custom"
                    checked={form.location_type === "custom"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Escribir dirección manualmente
                  </label>
                </div>
              </div>

              {form.location_type === "predefined" && (
                <select
                  name="predefined_location"
                  value={form.predefined_location}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecciona una ubicación</option>
                  {predefinedLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </option>
                  ))}
                </select>
              )}

              {form.location_type === "custom" && (
                <div>
                  <input
                    type="text"
                    name="custom_address"
                    value={form.custom_address}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Escribe la dirección completa: Calle, número, ciudad"
                    required
                  />
                  <small className="text-muted">
                    Ej: Avenida del Deporte, 123, Madrid
                  </small>
                </div>
              )}
            </div>

            {/* DESCRIPCIÓN - Individual */}
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Describe el evento, nivel requerido, reglas especiales, etc."
              />
            </div>

            {/* BOTÓN - Individual */}
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Evento"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}