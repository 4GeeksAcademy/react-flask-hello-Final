import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  function logout() {
    localStorage.removeItem("pick4fun_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  // Cargar estado desde localStorage
  function loadAuthFromStorage() {
    const token = localStorage.getItem("pick4fun_token");
    const storedUser = localStorage.getItem("user");
    setIsLogged(!!token);
    try {
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    loadAuthFromStorage();
  }, [location]);

  useEffect(() => {
    function handleUserUpdated() {
      loadAuthFromStorage();
    }
    window.addEventListener("user-updated", handleUserUpdated);
    return () => window.removeEventListener("user-updated", handleUserUpdated);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm" style={{zIndex: 1050}}>
      <div className="container">
        
        <a className="navbar-brand fw-bold fs-4" href="/">
          Pick4Fun
        </a>
        
     
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
      
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto"></div>
          
          <div className="d-flex align-items-center gap-2">
            {!isLogged ? (
              <>
                <a className="nav-link" href="/register">
                  Registrarse
                </a>
                <a className="btn btn-primary" href="/login">
                  Iniciar sesión
                </a>
              </>
            ) : (
              <>
                <a className="nav-link" href="/">
                  Inicio
                </a>
                <a href="/profile" className="nav-link p-0">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="rounded-circle"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                        border: "1px solid #eee"
                      }}
                    />
                  ) : (
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-dark fw-bold"
                      style={{
                        width: "32px",
                        height: "32px"
                      }}
                    >
                      {(user?.name || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </a>
                <button 
                  onClick={logout} 
                  className="btn btn-danger"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;