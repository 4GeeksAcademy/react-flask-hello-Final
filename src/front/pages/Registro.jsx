import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
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
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }

    function validate(values) {
        const newErrors = { name: "", email: "", password: "" };

        if(!values.name.trim()) newErrors.name = "El nombre es obligatorio.";
        else if (values.name.trim().length < 2) newErrors.name = "Mínimo 2 caracteres.";

        if (!values.email.trim()) newErrors.email = "El email es obligatorio.";
        else if (!/^\S+@\S+\.\S+$/.test(values.email))
            newErrors.email = "Formato de email inválido.";

        if (!values.password) newErrors.password = "La contraseña es obligatoria.";
        else if (values.password.length < 8)
            newErrors.password = "Mínimo 8 caracteres.";

        return newErrors;
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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });
            
            const data = await res.json().catch(() => ({}));
            
            if (!res.ok) {
                if (res.status === 409) {
                    alert("Ese email ya está registrado. Inicia sesión o usa otro email.");
                    return;
                }
                throw new Error(data.message || data.msg || `HTTP ${res.status}`);
            }

            alert("Usuario creado. Ahora inicia sesión.");
            navigate("/login");
        } catch (err) {
            const msg = err?.message || "Error al registrar";
            alert("✗ " + msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            {/* Fondo animado */}
            <div style={styles.background}></div>
            <div style={styles.particles}></div>
            
            {/* Tarjeta de registro */}
            <div style={styles.card}>
                {/* Header con efecto neón */}
                <div style={styles.header}>
                    <div style={styles.logo}>
                        <div style={styles.logoIcon}>🎯</div>
                    </div>
                    <h1 style={styles.title}>Crear Cuenta</h1>
                    <p style={styles.subtitle}>Únete a la comunidad deportiva</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Campo Nombre */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>👤</span>
                            Nombre
                        </label>
                        <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Tu nombre"
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <div style={styles.error}>{errors.name}</div>}
                    </div>

                    {/* Campo Email */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>📧</span>
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="tucorreo@ejemplo.com"
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <div style={styles.error}>{errors.email}</div>}
                    </div>

                    {/* Campo Contraseña */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>🔒</span>
                            Contraseña
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Mínimo 8 caracteres"
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <div style={styles.error}>{errors.password}</div>}
                    </div>

                    {/* Botón de registro */}
                    <button 
                        type="submit" 
                        style={{...styles.submitButton, ...(loading && styles.buttonLoading)}}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div style={styles.spinner}></div>
                                Creando cuenta...
                            </>
                        ) : (
                            "🚀 Crear Cuenta"
                        )}
                    </button>
                </form>

                {/* Enlace a login */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        ¿Ya tienes cuenta?{' '}
                        <a 
                            href="/login" 
                            style={styles.link}
                        >
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </div>

            {/* Efectos de decoración */}
            <div style={styles.floatingElement1}></div>
            <div style={styles.floatingElement2}></div>
            <div style={styles.floatingElement3}></div>
        </div>
    );
}

/* ESTILOS IDÉNTICOS AL LOGIN */
const styles = {
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