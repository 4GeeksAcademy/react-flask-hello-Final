import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Lista de ubicaciones
const predefinedLocations = [
  { 
    id: 1, 
    name: "Polideportivo La Chopera", 
    lat: 40.41124555, 
    lng: -3.6861635, 
    address: "Paseo de Fernan Nuñez, 3, Retiro, 28009, Madrid" 
  },
  { 
    id: 2, 
    name: "Centro Deportivo Municipal La Elipa", 
    lat: 40.4144, 
    lng: -3.6560, 
    address: "C. del Alcalde Garrido Juaristi, 17, Moratalaz, 28030 Madrid" 
  },
  { 
    id: 3, 
    name: "Polideportivo Moratalaz", 
    lat: 40.3983, 
    lng: -3.6314, 
    address: "C. de Valdebernardo, 2, Moratalaz, 28030 Madrid" 
  },
  { 
    id: 4, 
    name: "Centro Deportivo Municipal Casa de Campo", 
    lat: 40.4158, 
    lng: -3.7334, 
    address: "P.º de la Prta del Ángel, 7, Moncloa - Aravaca, 28011 Madrid" 
  },
  { 
    id: 5, 
    name: "Polideportivo Conde Orgaz", 
    lat: 40.4506, 
    lng: -3.6367, 
    address: "Av. Carondelet, 37, Hortaleza, 28043 Madrid" 
  },
  { 
    id: 6, 
    name: "Centro Deportivo Municipal Gallur", 
    lat:40.3985, 
    lng: -3.7379, 
    address: "C. de Gallur, 2, Latina, 28047 Madrid" 
  },
  { 
    id: 7, 
    name: "Polideportivo San Blas", 
    lat: 40.4290, 
    lng: -3.6153, 
    address: "Av. de Hellín, 47, San Blas-Canillejas, 28037 Madrid" 
  },
  { 
    id: 8, 
    name: "Centro Deportivo Municipal La Vaguada", 
    lat: 40.4793, 
    lng: -3.7093, 
    address: "Av. de Monforte de Lemos, 38, Fuencarral-El Pardo, 28029 Madrid" 
  },
  { 
    id: 9, 
    name: "Polideportivo Entrevías", 
    lat: 40.3770, 
    lng: -3.6739, 
    address: "Rda. del Sur, 4, Puente de Vallecas, 28053 Madrid" 
  },
  { 
    id: 10, 
    name: "Centro Deportivo Municipal Aluche", 
    lat: 40.3831, 
    lng: -3.7755, 
    address: "Av. de Las Águilas, 14, Latina, 28044 Madrid" 
  }
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
  const [mapCenter, setMapCenter] = useState({ lat: 40.4168, lng: -3.7038 });
  const [marker, setMarker] = useState(null);
  const [geocoding, setGeocoding] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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
    <div style={styles.container}>
      {/* Fondo animado */}
      <div style={styles.background}></div>
      <div style={styles.particles}></div>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🎯</div>
          </div>
          <h1 style={styles.title}>Crear Nuevo Evento</h1>
          <p style={styles.subtitle}>Organiza tu próximo partido</p>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* TÍTULO */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📝</span>
                Título del evento
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                style={styles.input}
                placeholder="Ej: Partido de fútbol sabatino"
                required
              />
            </div>

            {/* DEPORTE */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>⚽</span>
                Deporte
              </label>
              <select
                name="sport"
                value={form.sport}
                onChange={handleChange}
                style={styles.select}
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
            <div style={styles.row}>
              <div style={styles.col}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>📅</span>
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.col}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>⏰</span>
                    Hora
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>
            </div>

            {/* CAPACIDAD y PRECIO */}
            <div style={styles.row}>
              <div style={styles.col}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>👥</span>
                    Número de jugadores
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    style={styles.input}
                    min="2"
                    placeholder="¿Cuántos jugadores necesitas?"
                    required
                  />
                </div>
              </div>

              <div style={styles.col}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>💰</span>
                    Precio por persona (€)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    style={styles.input}
                    min="0"
                    step="0.5"
                    placeholder="0 si es gratis"
                    required
                  />
                  <div style={styles.priceNote}>
                    {form.price == 0 ? "🎯 Evento gratuito" : `Cada jugador pagará ${form.price}€`}
                  </div>
                </div>
              </div>
            </div>

            {/* UBICACIÓN */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>📍</span>
                Ubicación
              </h3>

              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="location_type"
                    value="predefined"
                    checked={form.location_type === "predefined"}
                    onChange={handleLocationTypeChange}
                    style={styles.radioInput}
                  />
                  <span style={styles.radioCustom}></span>
                  Seleccionar ubicación predefinida
                </label>

                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="location_type"
                    value="custom"
                    checked={form.location_type === "custom"}
                    onChange={handleLocationTypeChange}
                    style={styles.radioInput}
                  />
                  <span style={styles.radioCustom}></span>
                  Escribir dirección manualmente / elegir en el mapa
                </label>
              </div>

              {form.location_type === "predefined" && (
                <div style={styles.inputGroup}>
                  <select
                    name="predefined_location"
                    value={form.predefined_location}
                    onChange={handlePredefinedSelect}
                    style={styles.select}
                    required
                  >
                    <option value="">Selecciona una ubicación</option>
                    {predefinedLocations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form.location_type === "custom" && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Dirección</label>
                  <div style={styles.inputWithButton}>
                    <input
                      type="text"
                      name="custom_address"
                      value={form.custom_address}
                      onChange={handleChange}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleGeocodeAddress())}
                      style={styles.input}
                      placeholder="Escribe la dirección completa o haz clic en el mapa"
                      required
                    />
                    <button
                      type="button"
                      style={styles.geocodeButton}
                      onClick={handleGeocodeAddress}
                      disabled={geocoding}
                    >
                      {geocoding ? (
                        <>
                          <div style={styles.smallSpinner}></div>
                          Buscando...
                        </>
                      ) : (
                        "🗺️ Buscar en mapa"
                      )}
                    </button>
                  </div>
                  <div style={styles.helperText}>
                    💡 También puedes pinchar en el mapa para autocompletar.
                  </div>
                </div>
              )}
            </div>

            {/* MAPA */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>🗺️</span>
                Mapa
              </h3>
              
              {!GOOGLE_KEY ? (
                <div style={styles.warning}>
                  ⚠️ Falta la variable <code>VITE_MAP_GOOGLE</code> en tu .env (Maps no puede cargar).
                </div>
              ) : (
                <div style={styles.mapContainer}>
                  <APIProvider apiKey={GOOGLE_KEY} version="weekly" libraries={['places']}>
                    <div style={styles.mapWrapper}>
                      <Map
                        style={styles.map}
                        center={mapCenter}
                        defaultZoom={12}
                        gestureHandling="greedy"
                        disableDefaultUI={false}
                        onClick={handleMapClick}
                      >
                        {marker && <Marker position={marker} />}
                      </Map>
                    </div>
                  </APIProvider>
                  <div style={styles.mapHelp}>
                    💡 Haz clic en el mapa para seleccionar una ubicación
                    {marker && ` | Marcador en: ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}`}
                  </div>
                </div>
              )}
            </div>

            {/* DESCRIPCIÓN */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📄</span>
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={styles.textarea}
                rows="4"
                placeholder="Describe el evento, nivel requerido, reglas especiales, etc."
              />
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              style={{...styles.submitButton, ...(loading && styles.buttonLoading)}}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={styles.spinner}></div>
                  Creando evento...
                </>
              ) : (
                "🚀 Crear Evento"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Elementos flotantes */}
      <div style={styles.floatingElement1}></div>
      <div style={styles.floatingElement2}></div>
      <div style={styles.floatingElement3}></div>
    </div>
  );
}

/* ESTILOS ESPECTACULARES */
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4ecdc4 100%)',
    position: 'relative',
    overflow: 'hidden',
    color: '#151414ff',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
    `,
    animation: 'float 8s ease-in-out infinite',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 2px, transparent 0),
      radial-gradient(circle at 90% 40%, rgba(255, 255, 255, 0.1) 2px, transparent 0),
      radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.1) 2px, transparent 0)
    `,
    backgroundSize: '100px 100px',
    animation: 'particleFloat 20s linear infinite',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logo: {
    marginBottom: '20px',
  },
  logoIcon: {
    fontSize: '60px',
    background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 20px rgba(78, 205, 196, 0.5))',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff, #a8e6cf)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 10px 0',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '1.3rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    margin: 0,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '25px',
    padding: '40px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  section: {
    padding: '25px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    margin: '0 0 20px 0',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionIcon: {
    fontSize: '24px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  labelIcon: {
    fontSize: '18px',
  },
  input: {
    padding: '16px 18px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#070707ff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  select: {
    padding: '16px 18px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#0b0b0bff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  textarea: {
    padding: '16px 18px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#151212ff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  priceNote: {
    fontSize: '0.9rem',
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: '8px',
    fontWeight: '500',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'rgba(21, 20, 20, 0.9)',
    fontWeight: '500',
  },
  radioInput: {
    display: 'none',
  },
  radioCustom: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(11, 10, 10, 0.3)',
    borderRadius: '50%',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  inputWithButton: {
    display: 'flex',
    gap: '10px',
  },
  geocodeButton: {
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  helperText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '8px',
  },
  warning: {
    padding: '20px',
    background: 'rgba(255, 193, 7, 0.1)',
    border: '1px solid rgba(255, 193, 7, 0.3)',
    borderRadius: '12px',
    color: '#ffc107',
    textAlign: 'center',
  },
  mapContainer: {
    marginTop: '15px',
  },
  mapWrapper: {
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  map: {
    width: '100%',
    height: '300px',
  },
  mapHelp: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '12px',
    textAlign: 'center',
  },
  submitButton: {
    padding: '20px',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    border: 'none',
    borderRadius: '15px',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 30px rgba(78, 205, 196, 0.4)',
  },
  buttonLoading: {
    opacity: 0.8,
    transform: 'scale(0.98)',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  smallSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  floatingElement1: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '120px',
    height: '120px',
    background: 'linear-gradient(135deg, #ff6b6b, transparent)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.3,
    animation: 'floatElement 6s ease-in-out infinite',
  },
  floatingElement2: {
    position: 'absolute',
    bottom: '8%',
    right: '8%',
    width: '150px',
    height: '150px',
    background: 'linear-gradient(135deg, #4ecdc4, transparent)',
    borderRadius: '50%',
    filter: 'blur(50px)',
    opacity: 0.2,
    animation: 'floatElement 8s ease-in-out infinite reverse',
  },
  floatingElement3: {
    position: 'absolute',
    top: '65%',
    left: '80%',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, #a8e6cf, transparent)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.25,
    animation: 'floatElement 10s ease-in-out infinite',
  },
};

// Efectos CSS
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #4ecdc4 !important;
      box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2) !important;
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    input[type="radio"]:checked + span {
      background: #4ecdc4;
      border-color: #4ecdc4;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    input[type="radio"]:checked + span::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    button:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(78, 205, 196, 0.6);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .geocode-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

} catch (e) {
  console.log('Los estilos ya están definidos');
}