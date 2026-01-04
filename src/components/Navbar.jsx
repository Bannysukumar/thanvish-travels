import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sendWhatsAppMessage } from '../utils/firebase';
import '../styles.css';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-brand">
            <h1 className="logo">
              <Link to="/">Thanvish Travels</Link>
            </h1>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="nav-menu">
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li className="nav-dropdown">
                <a href="#" className="nav-link">
                  Services <span className="dropdown-icon">▼</span>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/travel-packages" className="dropdown-link" onClick={closeMenu}>
                      Travel Packages
                    </Link>
                  </li>
                  <li>
                    <Link to="/cab-services" className="dropdown-link" onClick={closeMenu}>
                      Cab Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/food-delivery" className="dropdown-link" onClick={closeMenu}>
                      Food Delivery
                    </Link>
                  </li>
                  <li>
                    <Link to="/all-services" className="dropdown-link" onClick={closeMenu}>
                      View All
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
            </ul>
            
            <div className="nav-buttons">
              <button 
                className="btn-primary" 
                onClick={() => {
                  sendWhatsAppMessage('general inquiry');
                  closeMenu();
                }}
              >
                Book Now
              </button>
            </div>
          </div>
          
          <div 
            className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} 
            id="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

