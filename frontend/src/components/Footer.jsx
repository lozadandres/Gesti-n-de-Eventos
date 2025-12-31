
function Footer() {
  return (
    <footer className="footer" style={{ marginTop: 'auto', width: '100%' }}>
      <div className="container" style={{ padding: '20px 0' }}>
        <div className="footer-bottom" style={{ borderRadius: '20px 20px 0 0', margin: '0 20px' }}>
          <p className="copyright" style={{ textAlign: 'center', margin: '10px 0' }}>
            Todos los derechos reservados &copy; 2025 | sitio web creado por <a href="#" style={{ color: '#b4ff46', fontWeight: 'bold' }}> Andrés Felipe Lozada Manzano</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;