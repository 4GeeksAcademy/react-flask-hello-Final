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
    <div style={{ maxWidth: 420, margin: "32px auto" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            placeholder="tucorreo@ejemplo.com"
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Contraseña</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Tu contraseña"
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}