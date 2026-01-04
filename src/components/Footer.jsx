import { Link } from 'react-router-dom';
import '../styles.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section scroll-reveal from-left">
            <h3>Thanvish Travels</h3>
            <p>Your trusted partner for amazing travel experiences, comfortable cab rides, and delicious food delivery with Indian hospitality.</p>
          </div>
          <div className="footer-section scroll-reveal">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/all-services">All Packages</Link></li>
              <li><Link to="/travel-packages">Travel Packages</Link></li>
              <li><Link to="/cab-services">Cab Services</Link></li>
              <li><Link to="/food-delivery">Food Delivery</Link></li>
            </ul>
          </div>
          <div className="footer-section scroll-reveal">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p><span className="icon-phone"></span> +91 80999 96622</p>
              <p><span className="icon-email"></span> info@thanvishtravels.com</p>
              <p><span className="icon-location"></span> Mumbai, Maharashtra, India</p>
            </div>
          </div>
          <div className="footer-section scroll-reveal from-right">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><span className="icon-facebook"></span></a>
              <a href="#" aria-label="Twitter"><span className="icon-twitter"></span></a>
              <a href="#" aria-label="Instagram"><span className="icon-instagram"></span></a>
              <a href="#" aria-label="LinkedIn"><span className="icon-linkedin"></span></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom scroll-reveal scale-up">
          <p>&copy; 2024 Thanvish Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

