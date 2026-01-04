import { useState } from 'react';
import { usePackages } from '../context/PackagesContext';
import BookingModal from '../components/BookingModal';
import SuccessMessage from '../components/SuccessMessage';
import '../styles.css';

function AllServices() {
  const { packages, loading } = usePackages();
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredPackages = currentFilter === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === currentFilter);

  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setShowSuccess(true);
  };

  return (
    <>
      <div className="mandala-bg"></div>
      <main className="container" style={{paddingTop: '5rem', paddingBottom: '5rem'}}>
        <section className="packages-section">
          <h2 className="section-title">All Services</h2>
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
              <p>Loading services...</p>
            </div>
          ) : (
            <div className="packages-grid">
              {filteredPackages.length === 0 ? (
                <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '3rem'}}>
                  <h3>No services available</h3>
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

export default AllServices;

