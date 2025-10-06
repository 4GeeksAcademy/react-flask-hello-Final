import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }

  function validate(v) {
    const out = { email: "", password: "" };
    if (!v.email.trim()) out.email = "El email es obligatorio.";
    else if (!/^\S+@\S+\.\S+$/.test(v.email)) out.email = "Formato de email inválido.";
    if (!v.password) out.password = "La contraseña es obligatoria.";
    return out;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const check = validate(form);
    setErrors(check);
    if (Object.values(check).some(Boolean)) return;

    try {
      setLoading(true);
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      localStorage.setItem("pick4fun_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";

    } catch (err) {
      alert("✖ " + (err?.message || "No se pudo iniciar sesión"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={loginStyles.container}>
      {/* Fondo animado */}
      <div style={loginStyles.background}></div>
      <div style={loginStyles.particles}></div>
      
      {/* Tarjeta de login */}
      <div style={loginStyles.card}>
        {/* Header con efecto neón */}
        <div style={loginStyles.header}>
          <div style={loginStyles.logo}>
            <div style={loginStyles.logoIcon}>🎯</div>
          </div>
          <h1 style={loginStyles.title}>Bienvenido de Nuevo</h1>
          <p style={loginStyles.subtitle}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} style={loginStyles.form}>
          {/* Campo Email */}
          <div style={loginStyles.inputGroup}>
            <label style={loginStyles.label}>
              <span style={loginStyles.labelIcon}>📧</span>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={loginStyles.input}
              placeholder="tucorreo@ejemplo.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <div style={loginStyles.error}>{errors.email}</div>}
          </div>

          {/* Campo Contraseña */}
          <div style={loginStyles.inputGroup}>
            <label style={loginStyles.label}>
              <span style={loginStyles.labelIcon}>🔒</span>
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={loginStyles.input}
              placeholder="Tu contraseña"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <div style={loginStyles.error}>{errors.password}</div>}
          </div>

          {/* Botón de login */}
          <button 
            type="submit" 
            style={{...loginStyles.submitButton, ...(loading && loginStyles.buttonLoading)}}
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={loginStyles.spinner}></div>
                Iniciando sesión...
              </>
            ) : (
              "🎮 Entrar al Juego"
            )}
          </button>
        </form>

        {/* Enlace a registro */}
        <div style={loginStyles.footer}>
          <p style={loginStyles.footerText}>
            ¿No tienes cuenta?{' '}
            <a 
              href="/register" 
              style={loginStyles.link}
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>

      {/* Efectos de decoración */}
      <div style={loginStyles.floatingElement1}></div>
      <div style={loginStyles.floatingElement2}></div>
      <div style={loginStyles.floatingElement3}></div>
    </div>
  );
}

/* ESTILOS IDÉNTICOS AL REGISTRO */
const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4ecdc4 100%)',
    position: 'relative',
    overflow: 'hidden',
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
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '30px',
    padding: '50px 40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 2,
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
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.1rem',
    fontWeight: '500',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  labelIcon: {
    fontSize: '18px',
  },
  input: {
    padding: '18px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    color: '#fff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '5px',
    textShadow: '0 0 10px rgba(255, 107, 107, 0.5)',
  },
  submitButton: {
    padding: '20px',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    border: 'none',
    borderRadius: '15px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
    boxShadow: '0 8px 30px rgba(78, 205, 196, 0.4)',
    position: 'relative',
    overflow: 'hidden',
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
  footer: {
    textAlign: 'center',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '15px',
    margin: 0,
  },
  link: {
    color: '#4ecdc4',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textShadow: '0 0 10px rgba(78, 205, 196, 0.5)',
  },
  floatingElement1: {
    position: 'absolute',
    top: '20%',
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
    bottom: '15%',
    right: '15%',
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
    left: '70%',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #a8e6cf, transparent)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.25,
    animation: 'floatElement 10s ease-in-out infinite',
  },
};

// Animaciones CSS
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    .input-error {
      border-color: #ff6b6b !important;
      box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2) !important;
      animation: shake 0.5s ease-in-out !important;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    @keyframes particleFloat {
      0% { transform: translateY(0px) translateX(0px); }
      100% { transform: translateY(-100px) translateX(50px); }
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    @keyframes floatElement {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-20px) scale(1.1); }
    }
  `, styleSheet.cssRules.length);

  // Efectos hover
  styleSheet.insertRule(`
    input:focus {
      outline: none;
      border-color: #4ecdc4 !important;
      box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2) !important;
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    button:hover:not(:disabled) {
      transform: translateY(-3px) !important;
      box-shadow: 0 15px 40px rgba(78, 205, 196, 0.6) !important;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    a:hover {
      color: #a8e6cf !important;
      text-shadow: 0 0 15px rgba(168, 230, 207, 0.7) !important;
    }
  `, styleSheet.cssRules.length);

} catch (e) {
  console.log('Las animaciones ya están definidas');
}