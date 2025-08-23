import React, { useEffect, useRef, useState } from "react";
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

  const fileInputRef = useRef(null);
  function openFilePicker() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setForm((prev) => ({ ...prev, avatar_url: String(dataUrl) }));
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    const token = localStorage.getItem("pick4fun_token");
    const user = localStorage.getItem("user");
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
  }, [BASE, navigate]);

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
      const res = await fetch(`${BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          level: form.level,
          avatar_url: form.avatar_url
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`)

      const me = await fetch(`${BASE}/api/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .catch(() => null)
      if (me) localStorage.setItem("user", JSON.stringify(me));
      alert("Perfil actualizado");

    } catch (e) {
      alert("X" + (e.message || "No se pudo actualizar"));
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
    if (!confirm("¿EStas seguro de que quieres elliminar tu cuenta? Esto no se podra deshacer."))
      return;

    try {
      const res = await fetch(`${BASE}/api/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.msg || `HTTP ${res.status}`);

      localStorage.removeItem("pick4fun_token");
      alert("Cuenta eliminada.");
      navigate("/");
    } catch (e) {
      alert("X" + (e.message || "No se pudo eliminar la cuenta"));
    }
  }

  function handleLogout() {
    localStorage.removeItem("pick4fun_token");
    navigate("/login");
  }

  if (loading) return <div style={{ padding: 16 }}><p>Cargando perfil…</p></div>;
  if (err) return <div style={{ padding: 16 }}><p className="text-danger">Error: {err}</p></div>;

  return (

    <div style={{ maxWidth: 520, margin: "24px auto", padding: 16 }}>
      <h2>Mi Perfil</h2>


      <div style={{ marginBottom: 12 }}>
        <label>Foto de perfil</label>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          {form.avatar_url ? (
            <img
              src={form.avatar_url}
              alt="preview"
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #e5e7eb",
                cursor: "pointer",
              }}

              onClick={openFilePicker}
              title="Cambiar foto"
            />
          ) : (
            <div
              onClick={openFilePicker}
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#999",
              }}
            >
              FOTO
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelected}
        />

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 12 }}>
            <label>Email (no editable)</label>
            <input className="form-control" value={form.email} disabled />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Nombre</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Nivel (1-5)</label>
            <input
              className="form-control"
              name="level"
              type="number"
              min={1}
              max={5}
              value={form.level}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button className="btn btn-secondary" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>

            <button className="btn btn-danger" type="button" onClick={handleDelete}>
              Eliminar cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}