import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";

  const [form, setForm] = useState({
    email: "",
    name: "",
    level: 1,
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const token = localStorage.getItem("pick4fun_token");
  const user = localStorage.getItem("user");

  function handleAvatarClick() {
    const url = window.prompt(
      "Introduce la URL de tu foto (https://...)",
      form.avatar_url || ""
    );
    if (!url) return;
    const ok = /^https?:\/\/\S+\.(png|jpe?g|gif|webp|svg)(\?\S*)?$/i.test(url) ||
      /^https?:\/\/\S+$/i.test(url);
    if (!ok) {
      alert("URL invalida. Debe empezar por http...");
      return;
    }
    setForm((prev) => ({ ...prev, avatar_url: url }));
  }

  useEffect(() => {
    if (!token) {
      alert("Debes iniciar sesion.");
      navigate("/login");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        if (user) {
          let parseUser = JSON.parse(user);

          const res = await fetch(`${BASE}api/users/me/${parseUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

          if (mounted) {
            setForm({
              email: data.email || "",
              name: data.name || "",
              level: data.level ?? 1,
              avatar_url: data.avatar_url || "",
            });
          }
        }

      } catch (e) {
        if (mounted) setErr(e.message || "No se pudo cargar el perfil.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [BASE, navigate, token, user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "level" ? Number(value) : value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    const token = localStorage.getItem("pick4fun_token");
    if (!token) {
      alert("Sesion expirada. Vuelve a iniciar sesion.");
      navigate("/login");
      return;
    }
    try {
      setSaving(true);
      let parseUser = JSON.parse(user);

      const res = await fetch(`${BASE}api/users/me/${parseUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          level: form.level,
          avatar_url: form.avatar_url,
        }),
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`)  

      const current = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = {
        ...current,
        name: form.name,
        level: form.level,
        avatar_url: form.avatar_url,
      };
      localStorage.setItem("user", JSON.stringify(updated));
      
      window.dispatchEvent(new Event("user-updated"));

      alert("✅ Perfil actualizado correctamente");
    } catch (e) {
      alert("✗ " + (e.message || "No se pudo actualizar"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const token = localStorage.getItem("pick4fun_token");
    if (!token) {
      alert("sesion expirada. Vuelve a iniciar sesion.");
      navigate("/login");
      return;
    }
    if (!confirm("¿Estas seguro de que quieres eliminar tu cuenta? Esto no se podra deshacer."))
      return;

    try {
      const res = await fetch(`${BASE}api/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      localStorage.removeItem("pick4fun_token");
      localStorage.removeItem("user");
      
      alert("Cuenta eliminada correctamente.");
      navigate("/");
    } catch (e) {
      alert("✗ " + (e.message || "No se pudo eliminar la cuenta"));
    }
  }

  function handleLogout() {
    localStorage.removeItem("pick4fun_token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-updated"));
    navigate("/login");
  }

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Cargando perfil…</p>
    </div>
  );
  
  if (err) return (
    <div style={styles.errorContainer}>
      <div style={styles.errorIcon}>⚠️</div>
      <p style={styles.errorText}>Error: {err}</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Fondo animado */}
      <div style={styles.background}></div>
      <div style={styles.particles}></div>
      
      <div style={styles.content}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>👤</div>
            </div>
            <h1 style={styles.title}>Mi Perfil</h1>
            <p style={styles.subtitle}>Gestiona tu información personal</p>
          </div>

          {/* Avatar */}
          <div style={styles.avatarSection}>
            <label style={styles.avatarLabel}>Foto de perfil</label>
            <div style={styles.avatarContainer}>
              {form.avatar_url ? (
                <img
                  src={form.avatar_url}
                  alt="preview"
                  style={styles.avatar}
                  onClick={handleAvatarClick}
                  title="Cambiar foto"
                />
              ) : (
                <div
                  onClick={handleAvatarClick}
                  style={styles.avatarPlaceholder}
                  title="Añadir URL de tu foto"
                >
                  📷
                </div>
              )}
              <div style={styles.avatarOverlay} onClick={handleAvatarClick}>
                ✏️ Editar
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} style={styles.form}>
            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📧</span>
                Email (no editable)
              </label>
              <input 
                style={styles.inputDisabled} 
                value={form.email} 
                disabled 
              />
            </div>

            {/* Nombre */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>👤</span>
                Nombre
              </label>
              <input
                style={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Nivel */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>⭐</span>
                Nivel (1-5)
              </label>
              <input
                style={styles.input}
                name="level"
                type="number"
                min={1}
                max={5}
                value={form.level}
                onChange={handleChange}
              />
              <div style={styles.levelHelp}>
                {form.level === 1 && "🚀 Principiante"}
                {form.level === 2 && "💪 Intermedio"}
                {form.level === 3 && "🔥 Avanzado"}
                {form.level === 4 && "🏆 Experto"}
                {form.level === 5 && "⚡ Élite"}
              </div>
            </div>

            {/* Botones */}
            <div style={styles.buttonsContainer}>
              <button 
                type="submit" 
                style={{...styles.saveButton, ...(saving && styles.buttonLoading)}}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div style={styles.spinner}></div>
                    Guardando...
                  </>
                ) : (
                  "💾 Guardar cambios"
                )}
              </button>

              <button 
                type="button" 
                style={styles.logoutButton}
                onClick={handleLogout}
              >
                🚪 Cerrar sesión
              </button>

              <button 
                type="button" 
                style={styles.deleteButton}
                onClick={handleDelete}
              >
                🗑️ Eliminar cuenta
              </button>
            </div>
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
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
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
    width: '100%',
    maxWidth: '500px',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4ecdc4 100%)',
    color: '#fff',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid #4ecdc4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4ecdc4 100%)',
    color: '#fff',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  errorText: {
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '25px',
    padding: '40px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
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
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff, #a8e6cf)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    margin: 0,
  },
  avatarSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  avatarLabel: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#fff',
    display: 'block',
  },
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '3px dashed rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    borderBottomLeftRadius: '60px',
    borderBottomRightRadius: '60px',
    opacity: 0,
    transition: 'all 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
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
    color: '#fff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  inputDisabled: {
    padding: '16px 18px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '1rem',
  },
  levelHelp: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginTop: '5px',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  saveButton: {
    padding: '18px',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 30px rgba(78, 205, 196, 0.4)',
  },
  logoutButton: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  deleteButton: {
    padding: '16px',
    background: 'rgba(255, 107, 107, 0.1)',
    border: '2px solid rgba(255, 107, 107, 0.3)',
    borderRadius: '12px',
    color: '#ff6b6b',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonLoading: {
    opacity: 0.8,
    transform: 'scale(0.98)',
  },
  floatingElement1: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, #ff6b6b, transparent)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.3,
    animation: 'floatElement 6s ease-in-out infinite',
  },
  floatingElement2: {
    position: 'absolute',
    bottom: '12%',
    right: '12%',
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
    top: '60%',
    left: '75%',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #a8e6cf, transparent)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.25,
    animation: 'floatElement 10s ease-in-out infinite',
  },
};

// Efectos hover
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    .avatar-container:hover .avatar-overlay {
      opacity: 1;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .avatar-container:hover .avatar, .avatar-container:hover .avatar-placeholder {
      transform: scale(1.05);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    input:focus {
      outline: none;
      border-color: #4ecdc4 !important;
      box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2) !important;
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .save-button:hover:not(:disabled) {
      transform: translateY(-3px);
      boxShadow: 0 15px 40px rgba(78, 205, 196, 0.6);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .logout-button:hover {
      background: rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .delete-button:hover {
      background: rgba(255, 107, 107, 0.2) !important;
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

} catch (e) {
  console.log('Los estilos ya están definidos');
}