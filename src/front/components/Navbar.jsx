import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function logout() {
    localStorage.removeItem("pick4fun_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

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
    <nav style={styles.navbar}>
      <div style={styles.navbarContainer}>
        {/* Logo */}
        <div style={styles.navbarLogo} onClick={handleLogoClick}>
          <span style={styles.logoIcon}>🎯</span>
          <span style={styles.logoText}>Pick4Fun</span>
        </div>

        {/* Menu para desktop */}
        <div style={styles.navbarMenu}>
          {isLogged ? (
            <>
              <div style={styles.userSection}>
                <a href="/profile" style={styles.userAvatar}>
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      style={styles.avatarImage}
                    />
                  ) : (
                    <span style={styles.avatarPlaceholder}>
                      {(user?.name || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </a>
                <button onClick={logout} style={styles.logoutButton}>
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <a href="/register" style={styles.navLink}>Registrarse</a>
              <a href="/login" style={styles.loginButton}>
                Iniciar Sesión
              </a>
            </>
          )}
        </div>

        {/* Menu hamburguesa para mobile */}
        <div style={styles.navbarMobile}>
          <button style={styles.menuToggle} onClick={toggleMenu}>
            <span style={styles.menuBar}></span>
            <span style={styles.menuBar}></span>
            <span style={styles.menuBar}></span>
          </button>
        </div>
      </div>

      {/* Menu desplegable mobile */}
      {isMenuOpen && (
        <div style={styles.mobileMenu}>
          {isLogged ? (
            <>
              <a href="/" style={styles.mobileLink} onClick={toggleMenu}>Inicio</a>
              <a href="/profile" style={styles.mobileLink} onClick={toggleMenu}>Mi Perfil</a>
              <div style={styles.mobileUserInfo}>
                <div style={styles.mobileAvatar}>
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      style={styles.avatarImage}
                    />
                  ) : (
                    <span style={styles.avatarPlaceholder}>
                      {(user?.name || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span style={styles.userName}>{user?.name || "Usuario"}</span>
                </div>
                <button style={styles.mobileLogoutButton} onClick={() => { logout(); toggleMenu(); }}>
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <a href="/" style={styles.mobileLink} onClick={toggleMenu}>Inicio</a>
              <a href="/register" style={styles.mobileLink} onClick={toggleMenu}>Registrarse</a>
              <a href="/login" style={styles.mobileLoginButton} onClick={toggleMenu}>
                Iniciar Sesión
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

/* ESTILOS INTEGRADOS */
const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem 0',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  navbarContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
  },
  navbarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  logoIcon: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  },
  logoText: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'white',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  navbarMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginLeft: '1rem',
  },
  userAvatar: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  avatarImage: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  avatarPlaceholder: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '1.2rem',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  loginButton: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '25px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    textDecoration: 'none',
    display: 'inline-block',
  },
  logoutButton: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(239, 68, 68, 0.2)',
    color: 'white',
    border: '2px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '25px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
  },
  navbarMobile: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  menuToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '0.5rem',
  },
  menuBar: {
    width: '25px',
    height: '3px',
    background: 'white',
    borderRadius: '2px',
    transition: '0.3s',
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '1rem',
    boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  mobileLink: {
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    color: '#333',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    fontSize: '1.1rem',
  },
  mobileUserInfo: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    marginTop: '0.5rem',
  },
  mobileAvatar: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  userName: {
    color: '#333',
    fontWeight: '600',
  },
  mobileLoginButton: {
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '1.1rem',
    marginTop: '0.5rem',
  },
  mobileLogoutButton: {
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    border: 'none',
    background: '#ef4444',
    color: 'white',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '1.1rem',
  },
};

// Efectos hover
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    .navbar-logo:hover {
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .nav-link:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .login-button:hover, .logout-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .login-button:hover {
      background: white;
      color: #667eea;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .logout-button:hover {
      background: #ef4444;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .avatar-image:hover, .avatar-placeholder:hover {
      border-color: rgba(255, 255, 255, 0.6);
      transform: scale(1.05);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .mobile-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      padding-left: 2rem;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .mobile-login-button:hover, .mobile-logout-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `, styleSheet.cssRules.length);

} catch (e) {
  console.log('Los estilos ya están definidos');
}

export default Navbar;