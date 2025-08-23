import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(null)

  function logout() {
    localStorage.removeItem("pick4fun_token");
    window.location.assign("/");
  }

  useEffect(() => {
    setIsLogged(localStorage.getItem("pick4fun_token"))

    try {
      const u = localStorage.getItem("pick4fun_token");
      setUser(u ? JSON.parse(u) : null);
    } catch {
      setUser(null);
    }
    }, [location])

  return (
    <nav style={bar}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <a href="/" style={brand}>Pick4Fun</a>
        {isLogged && <a href="/events/new" style={link}>Crear evento</a>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!isLogged && <a href="/register" style={link}>Registrarse</a>}
        {!isLogged && <a href="/login" style={btnPrimary}>Iniciar sesión</a>}
        {isLogged && <a href="/" style={link}>Inicio</a>}
        {isLogged &&(
        <a href="/profile" style={{ ...link,padding: 0 }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="avatar" style={{width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }}
            />
          ) : (
            <span style={{
                display: "inline-flex",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#e5e7eb",
                color: "#111",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700
            }}
          >
            {(user?.name || "?").charAt(0).toUpperCase()}
          </span>
          )}
          </a>
        )}
        {isLogged && <button onClick={logout} style={btnDanger}>Salir</button>}
      </div>
    </nav>
  );
}

const bar = { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom:"1px solid #eee", position:"sticky", top:0, background:"#fff", zIndex:50 };
const brand = { fontWeight:800, textDecoration:"none", color:"#111", fontSize:18 };
const link = { textDecoration:"none", color:"#333", padding:"6px 8px", borderRadius:8 };
const btnPrimary = { textDecoration:"none", color:"white", background:"#2563eb", padding:"8px 12px", borderRadius:10 };
const btnDanger = { color:"white", background:"#ef4444", padding:"8px 12px", border:"none", borderRadius:10, cursor:"pointer" };