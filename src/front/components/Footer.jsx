import React from "react";

export const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        
        {/* Sección principal */}
        <div style={styles.footerMain}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>
              <span style={styles.logoIcon}>🎯</span>
              <span style={styles.logoText}>Pick4Fun</span>
            </div>
            <p style={styles.footerDescription}>
              Conectando amantes del deporte a través de eventos increíbles. 
              Encuentra, crea y únete a experiencias deportivas únicas.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink} aria-label="Facebook">
                <span style={styles.socialIcon}>📘</span>
              </a>
              <a href="#" style={styles.socialLink} aria-label="Instagram">
                <span style={styles.socialIcon}>📷</span>
              </a>
              <a href="#" style={styles.socialLink} aria-label="Twitter">
                <span style={styles.socialIcon}>🐦</span>
              </a>
              <a href="#" style={styles.socialLink} aria-label="LinkedIn">
                <span style={styles.socialIcon}>💼</span>
              </a>
            </div>
          </div>

          <div style={styles.footerLinks}>
            <div style={styles.linkColumn}>
              <h4 style={styles.columnTitle}>Explorar</h4>
              <a href="/" style={styles.footerLink}>Eventos Destacados</a>
              <a href="/" style={styles.footerLink}>Deportes</a>
              <a href="/" style={styles.footerLink}>Ubicaciones</a>
              <a href="/events/new" style={styles.footerLink}>Crear Evento</a>
            </div>
            
            <div style={styles.linkColumn}>
              <h4 style={styles.columnTitle}>Recursos</h4>
              <a href="/how-it-works" style={styles.footerLink}>Cómo Funciona</a>
              <a href="/faq" style={styles.footerLink}>Preguntas Frecuentes</a>
              <a href="/safety" style={styles.footerLink}>Guías de Seguridad</a>
              <a href="/policies" style={styles.footerLink}>Políticas</a>
            </div>
            
            <div style={styles.linkColumn}>
              <h4 style={styles.columnTitle}>Compañía</h4>
              <a href="/about" style={styles.footerLink}>Sobre Nosotros</a>
              <a href="/contact" style={styles.footerLink}>Contacto</a>
              <a href="/careers" style={styles.footerLink}>Trabaja con Nosotros</a>
              <a href="/blog" style={styles.footerLink}>Blog</a>
            </div>
          </div>
        </div>

        {/* Línea divisoria con efecto */}
        <div style={styles.footerDivider}>
          <div style={styles.dividerWave}></div>
        </div>

        {/* Sección inferior */}
        <div style={styles.footerBottom}>
          <div style={styles.footerCopyright}>
            <p style={styles.copyrightText}>
              &copy; 2025 <span style={styles.brandHighlight}>Pick4Fun</span>. Todos los derechos reservados.
            </p>
          </div>
          
          <div style={styles.footerCredits}>
            <p style={styles.creditsText}>
              Hecho con <span style={styles.heart}>💙</span> por{" "}
              <span style={styles.academy}>Carlos Aguayo</span>
            </p>
          </div>
          
          <div style={styles.footerLegal}>
            <a href="/privacy" style={styles.legalLink}>Privacidad</a>
            <a href="/terms" style={styles.legalLink}>Términos</a>
            <a href="/cookies" style={styles.legalLink}>Cookies</a>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div style={styles.footerDecoration}>
          <div style={styles.decorationBall1}></div>
          <div style={styles.decorationBall2}></div>
          <div style={styles.decorationBall3}></div>
        </div>
      </div>
    </footer>
  );
};

/* ESTILOS ESPECTACULARES PARA EL FOOTER */
const styles = {
  footer: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    padding: '4rem 0 2rem',
    marginTop: 'auto',
    position: 'relative',
    overflow: 'hidden',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    position: 'relative',
    zIndex: 2,
  },
  footerMain: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '4rem',
    marginBottom: '3rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '3rem',
    },
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
  },
  logoText: {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff, #a8e6cf)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  footerDescription: {
    color: '#bdc3c7',
    lineHeight: '1.6',
    fontSize: '1rem',
    margin: 0,
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  socialLink: {
    display: 'inline-block',
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    fontSize: '1.3rem',
  },
  socialIcon: {
    display: 'block',
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem',
    },
  },
  linkColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  columnTitle: {
    color: 'white',
    marginBottom: '1rem',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  footerLink: {
    display: 'block',
    color: '#bdc3c7',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
  },
  footerDivider: {
    margin: '2rem 0',
    position: 'relative',
  },
  dividerWave: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    position: 'relative',
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      textAlign: 'center',
    },
  },
  footerCopyright: {
    flex: 1,
  },
  copyrightText: {
    color: '#bdc3c7',
    fontSize: '0.9rem',
    margin: 0,
  },
  brandHighlight: {
    color: '#4ecdc4',
    fontWeight: '600',
  },
  footerCredits: {
    flex: 1,
    textAlign: 'center',
  },
  creditsText: {
    color: '#bdc3c7',
    fontSize: '0.9rem',
    margin: 0,
  },
  heart: {
    color: '#e74c3c',
    margin: '0 0.25rem',
  },
  academy: {
    color: '#4ecdc4',
    fontWeight: '600',
  },
  footerLegal: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1.5rem',
    '@media (max-width: 768px)': {
      justifyContent: 'center',
    },
  },
  legalLink: {
    color: '#bdc3c7',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  footerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  decorationBall1: {
    position: 'absolute',
    top: '20%',
    left: '5%',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #ff6b6b, transparent)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    opacity: 0.1,
    animation: 'floatElement 8s ease-in-out infinite',
  },
  decorationBall2: {
    position: 'absolute',
    bottom: '15%',
    right: '10%',
    width: '120px',
    height: '120px',
    background: 'linear-gradient(135deg, #4ecdc4, transparent)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.1,
    animation: 'floatElement 12s ease-in-out infinite reverse',
  },
  decorationBall3: {
    position: 'absolute',
    top: '60%',
    left: '80%',
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #a8e6cf, transparent)',
    borderRadius: '50%',
    filter: 'blur(25px)',
    opacity: 0.1,
    animation: 'floatElement 10s ease-in-out infinite',
  },
};

// Efectos hover y animaciones para el footer
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    .footer-link:hover {
      color: #4ecdc4;
      transform: translateX(5px);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .social-link:hover {
      background: #4ecdc4;
      transform: translateY(-3px) scale(1.1);
      box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .legal-link:hover {
      color: #4ecdc4;
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    @keyframes floatElement {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-15px) scale(1.05); }
    }
  `, styleSheet.cssRules.length);

} catch (e) {
  console.log('Los estilos ya están definidos');
}

export default Footer;