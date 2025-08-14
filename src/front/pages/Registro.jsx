import React, {useState} from "react";
import {UNSAFE_ErrorResponseImpl, useNavigate} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
}

const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
});

const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
});

const [loading, setLoading] = useState(false);

function handleChange(e) {
    const {name, value} = e.target;
    setForm(prev => ({ ...prev, [name]: value}));
    setErrors(prev => ({ ...prev, [name]: ""}));
}

function validate(values) {
    const newErrors = { name: "", email: "", password: ""};

    if(!values.name.trim()) newErrors.name = "El nombre es obligatorio.";
    else if (!values.name.trim().lenght < 2) newErrors.name = "Minimo 2 caracteres.";

    if (!values.email.trim()) newErrors.email = "El email es obligatorio.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email))
        newErrors.email = "Formato de email invalido.";

    if (!values.password) newErrors.password = "La contraseña es obligatoria.";
    else if (values.password.lenght < 8)
        newErrors.password ="Minimo 8 caracteres.";

    return newErrors
}

async function handleSubmit(e) {
    e.preventDefault();
    const check = validate(form);
    setErrors(check);

    const hasErrors = Object.values(check).some(msg => msg);
    if (hasErrors) return;

    try {
        setLoading(true);
        
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
            method: "POST",
            headers: {"content-Type": "application/json"},
            body: JSON.stringify(form),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
    }

    alert("Usuario Creado. Ahora inicia sesion.");
    navigate("/login");
    } catch (err) {
        const msg = 
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "Error al registrar";
        alert("X" + msg);
    } finally {
        setLoading(false);
    }
}

return (
    <div style= {{maxWidth: 420, margin: "32px auto" }}>
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit} noValidate>
            <div style={{marginBottom: 12}}>
                <label>Nombre</label>
                <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Tu nombre"
                />
                {errors.name && <div className= "text-danger">{errors.name}</div>}
            </div>

            <div style= {{ marginBottom: 12 }}>
                <label>Email</label>
                <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className= "form-control"
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
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
