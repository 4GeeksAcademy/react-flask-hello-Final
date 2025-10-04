import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
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
  const GOOGLE_KEY = import.meta.env.VITE_MAP_GOOGLE;

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

  // Estado para mapa, marcador y geocoding
  const [mapCenter, setMapCenter] = useState({ lat: 40.4168, lng: -3.7038 }); // Madrid
  const [marker, setMarker] = useState(null);
  const [geocoding, setGeocoding] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ⬇Selección de ubicación predefinida: centra mapa, pone marcador y su dirección
  const handlePredefinedSelect = (e) => {
    const value = e.target.value;
    setForm(prev => ({ 
      ...prev, 
      predefined_location: value, 
      location_type: "predefined",
      custom_address: ""
    }));
    
    const loc = predefinedLocations.find(l => l.id === parseInt(value));
    if (loc) {
      setMapCenter({ lat: loc.lat, lng: loc.lng });
      setMarker({ lat: loc.lat, lng: loc.lng });
    }
  };

  // Click en el mapa: marcador + reverse geocoding -> autocompletar dirección
  const handleMapClick = async (e) => {
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    
    setMarker({ lat, lng });
    setMapCenter({ lat, lng });
    setGeocoding(true);
    
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_KEY}&language=es`
      );
      const data = await res.json();
      const address = data?.results?.[0]?.formatted_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      
      setForm(prev => ({
        ...prev,
        location_type: "custom",
        custom_address: address,
        predefined_location: "" 
      }));
    } catch (error) {
      console.error("Error en geocoding:", error);
      alert("No se pudo obtener la dirección automáticamente");
    } finally {
      setGeocoding(false);
    }
  };

  // ⬇Geocoding de la dirección escrita en el input: centra mapa + marcador
  const handleGeocodeAddress = async () => {
    const q = form.custom_address.trim();
    if (!q) {
      alert("Por favor, escribe una dirección primero");
      return;
    }
    
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${GOOGLE_KEY}&language=es`
      );
      const data = await res.json();
      
      if (data.status !== "OK" || !data.results?.length) {
        alert("No se encontró esa dirección. Intenta ser más específico.");
        return;
      }
      
      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      
      setMapCenter({ lat, lng });
      setMarker({ lat, lng });
      setForm(prev => ({ 
        ...prev, 
        custom_address: result.formatted_address, 
        location_type: "custom",
        predefined_location: ""
      }));
    } catch (error) {
      console.error("Error en geocoding:", error);
      alert("No se pudo localizar la dirección en el mapa");
    } finally {
      setGeocoding(false);
    }
  };

  const handleLocationTypeChange = (e) => {
    const newType = e.target.value;
    setForm(prev => ({ 
      ...prev, 
      location_type: newType,
      ...(newType === "predefined" ? { custom_address: "" } : { predefined_location: "" })
    }));
    
    // Si cambiamos a predefinida y hay una selección, actualizamos el mapa
    if (newType === "predefined" && form.predefined_location) {
      const loc = predefinedLocations.find(l => l.id === parseInt(form.predefined_location));
      if (loc) {
        setMapCenter({ lat: loc.lat, lng: loc.lng });
        setMarker({ lat: loc.lat, lng: loc.lng });
      }
    }
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
      if (!finalAddress.trim()) {
        throw new Error("La dirección es requerida");
      }

      const eventData = {
        title: form.title,
        sport: form.sport,
        description: form.description,
        datetime: eventDatetime.toISOString(),
        address: finalAddress,
        capacity: parseInt(form.capacity),
        price: parseFloat(form.price),
        lat: marker?.lat,
        lng: marker?.lng,
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

      alert("¡Evento creado correctamente!");
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
            {/* TÍTULO */}
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

            {/* DEPORTE */}
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

            {/* FECHA y HORA */}
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

            {/* CAPACIDAD y PRECIO */}
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

            {/* UBICACIÓN */}
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
                    onChange={handleLocationTypeChange}
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
                    onChange={handleLocationTypeChange}
                  />
                  <label className="form-check-label">
                    Escribir dirección manualmente / elegir en el mapa
                  </label>
                </div>
              </div>

              {form.location_type === "predefined" && (
                <select
                  name="predefined_location"
                  value={form.predefined_location}
                  onChange={handlePredefinedSelect}
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
                <div className="mb-2">
                  <label className="form-label">Dirección</label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="custom_address"
                      value={form.custom_address}
                      onChange={handleChange}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleGeocodeAddress())} // Enter busca en mapa
                      className="form-control"
                      placeholder="Escribe la dirección completa o haz clic en el mapa"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleGeocodeAddress}
                      disabled={geocoding}
                    >
                      {geocoding ? "Buscando..." : "Buscar en el mapa"}
                    </button>
                  </div>
                  <small className="text-muted">
                    También puedes pinchar en el mapa para autocompletar.
                  </small>
                </div>
              )}
            </div>

            {/* MAPA */}
            {!GOOGLE_KEY ? (
              <div className="alert alert-warning">
                Falta la variable <code>VITE_MAP_GOOGLE</code> en tu .env (Maps no puede cargar).
              </div>
            ) : (
              <APIProvider apiKey={GOOGLE_KEY} version="weekly" libraries={['places']}>
                <div className="border rounded overflow-hidden">
                  <Map
                    style={{ width: '100%', height: '40vh' }}
                    center={mapCenter}
                    defaultZoom={12}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    onClick={handleMapClick}
                  >
                    {marker && <Marker position={marker} />}
                  </Map>
                </div>
                <div className="mt-2 text-muted small">
                  💡 Haz clic en el mapa para seleccionar una ubicación
                  {marker && ` | Marcador en: ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}`}
                </div>
              </APIProvider>
            )}

            {/* DESCRIPCIÓN */}
            <div className="mb-3 mt-3">
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

            {/* BOTÓN */}
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