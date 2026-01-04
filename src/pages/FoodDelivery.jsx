import { useState } from 'react';
import { usePackages } from '../context/PackagesContext';
import BookingModal from '../components/BookingModal';
import SuccessMessage from '../components/SuccessMessage';
import '../styles.css';

function FoodDelivery() {
  const { packages, loading } = usePackages();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const foodPackages = packages.filter(pkg => pkg.type === 'food');

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
          <h2 className="section-title">Food Delivery</h2>
          
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <p>Loading food delivery options...</p>
            </div>
          ) : (
            <div className="packages-grid">
              {foodPackages.length === 0 ? (
                <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '3rem'}}>
                  <h3>No food delivery options available</h3>
                  <p>Check back soon for new food delivery options!</p>
                </div>
              ) : (
                foodPackages.map((pkg, index) => (
                  <div 
                    key={pkg._id} 
                    className="package-card food-package stagger-item"
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

export default FoodDelivery;

