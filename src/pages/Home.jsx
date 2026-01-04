import { useState, useEffect } from 'react';
import { usePackages } from '../context/PackagesContext';
import BookingModal from '../components/BookingModal';
import SuccessMessage from '../components/SuccessMessage';
import { sendWhatsAppMessage } from '../utils/firebase';
import '../styles.css';

function Home() {
  const { packages, loading } = usePackages();
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = currentFilter === 'all' || pkg.type === currentFilter;
    const matchesSearch = !searchTerm || 
      pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setShowSuccess(true);
  };

  const handleSearch = () => {
    // Search is handled by filteredPackages
  };

  return (
    <>
      {/* Mandala Background */}
      <div className="mandala-bg"></div>
      
      {/* Cultural Pattern Elements */}
      <div className="cultural-pattern" style={{top: '10%', left: '5%'}}></div>
      <div className="cultural-pattern" style={{top: '20%', right: '10%'}}></div>
      <div className="cultural-pattern" style={{bottom: '30%', left: '15%'}}></div>

      <section className="hero parallax">
        <div className="hero-content">
          <h2>Discover Amazing Destinations</h2>
          <p>Book your perfect trip, cab, or food experience with Thanvish Travels. Experience the beauty of India and beyond with our comprehensive travel services.</p>
          <div className="hero-search">
            <input 
              type="text" 
              placeholder="Search destinations, cabs, or food..." 
              className="search-box"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-search" onClick={handleSearch}>Search</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Happy Travelers</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Destinations</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Support</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container">
        <section className="packages-section">
          <h2 className="section-title">Available Packages</h2>
          <div className="filter-badges">
            <span 
              className={`badge ${currentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('all')}
            >
              All
            </span>
            <span 
              className={`badge ${currentFilter === 'trip' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('trip')}
            >
              🏖️ Trips
            </span>
            <span 
              className={`badge ${currentFilter === 'cab' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('cab')}
            >
              🚗 Cabs
            </span>
            <span 
              className={`badge ${currentFilter === 'food' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('food')}
            >
              🍽️ Food
            </span>
          </div>
          
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <p>Loading amazing experiences...</p>
            </div>
          ) : (
            <div className="packages-grid">
              {filteredPackages.length === 0 ? (
                <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '3rem'}}>
                  <h3>No packages available</h3>
                  <p>Please add packages through the admin dashboard first.</p>
                </div>
              ) : (
                filteredPackages.map((pkg, index) => (
                  <div 
                    key={pkg._id} 
                    className={`package-card ${pkg.type}-package stagger-item`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <img src={pkg.imageUrl || 'https://via.placeholder.com/400x300'} alt={pkg.name} className="package-image" />
                    <div className="package-content">
                      <span className={`package-type ${pkg.type}`}>{pkg.type?.toUpperCase()}</span>
                      <h3 className="package-title">{pkg.name}</h3>
                      <p className="package-description">{pkg.description}</p>
                      {pkg.location && <p><strong>Location:</strong> {pkg.location}</p>}
                      {pkg.duration && <p><strong>Duration:</strong> {pkg.duration}</p>}
                      <div className="package-footer">
                        <div className="package-price">₹{pkg.price?.toLocaleString()}</div>
                        <button 
                          type="button"
                          className="book-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBookNow(pkg);
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Amazing experience! The Goa trip was perfectly organized. Thanvish Travels took care of everything with Indian hospitality and excellence."</p>
                <div className="testimonial-author">
                  <strong>Priya Sharma</strong>
                  <span>Goa Trip</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Reliable cab service with professional drivers. Always on time and comfortable vehicles. Great service across India."</p>
                <div className="testimonial-author">
                  <strong>Rahul Patel</strong>
                  <span>Cab Services</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The food tour was incredible! Got to taste authentic local cuisine at the best spots. Love the Indian flavors and variety."</p>
                <div className="testimonial-author">
                  <strong>Anita Desai</strong>
                  <span>Food Tour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showBookingModal && selectedPackage && (
        <BookingModal
          pkg={selectedPackage}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {showSuccess && (
        <SuccessMessage onClose={() => setShowSuccess(false)} />
      )}
    </>
  );
}

export default Home;

