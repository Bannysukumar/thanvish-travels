import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPackages, savePackage, deletePackage as deletePackageAPI, updateBookingStatus, deleteBooking, FIREBASE_URL } from '../utils/firebase';
import '../styles.css';
import '../admin.css';

function Dashboard() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentSection, setCurrentSection] = useState('overview');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    price: '',
    location: '',
    duration: '',
    imageUrl: '',
    highlights: ''
  });

  useEffect(() => {
    // Check authentication
    const adminPassword = localStorage.getItem('adminPassword');
    if (!adminPassword || adminPassword !== 'admin123') {
      navigate('/login');
      return;
    }

    loadPackages();
    loadBookings();
  }, [navigate]);

  const loadPackages = async () => {
    const data = await fetchPackages();
    setPackages(data);
  };

  const loadBookings = async () => {
    try {
      const travelResponse = await fetch(`${FIREBASE_URL}/bookings.json`);
      let allBookings = [];
      
      if (travelResponse.ok) {
        const travelData = await travelResponse.json();
        if (travelData && typeof travelData === 'object' && travelData !== null) {
          allBookings = Object.entries(travelData).map(([key, value]) => {
            return {
              ...value,
              _id: key || value.id
            };
          });
        }
      }
      
      // Sort by booking date (newest first)
      const sortedBookings = allBookings.sort((a, b) => {
        const timeA = new Date(a.bookingDate || 0).getTime();
        const timeB = new Date(b.bookingDate || 0).getTime();
        return timeB - timeA;
      });
      
      if (import.meta.env.DEV) {
        console.log('Loaded bookings:', sortedBookings.length, sortedBookings);
      }
      
      setBookings(sortedBookings);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading bookings:', error);
      }
      setBookings([]);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const success = await updateBookingStatus(bookingId, newStatus);
    if (success) {
      // Reload bookings to show updated status
      loadBookings();
      alert('Booking status updated successfully!');
    } else {
      alert('Error updating booking status. Please try again.');
    }
  };

  const handleDeleteBooking = async (bookingId, customerName) => {
    if (!window.confirm(`Are you sure you want to delete the booking for ${customerName || 'this customer'}?`)) return;
    
    const success = await deleteBooking(bookingId);
    if (success) {
      loadBookings();
      alert('Booking deleted successfully!');
    } else {
      alert('Error deleting booking. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    navigate('/login');
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      type: '',
      description: '',
      price: '',
      location: '',
      duration: '',
      imageUrl: '',
      highlights: ''
    });
    setShowModal(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name || '',
      type: pkg.type || '',
      description: pkg.description || '',
      price: pkg.price || '',
      location: pkg.location || '',
      duration: pkg.duration || '',
      imageUrl: pkg.imageUrl || '',
      highlights: pkg.highlights ? pkg.highlights.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    const success = await deletePackageAPI(id);
    if (success) {
      loadPackages();
      alert('Package deleted successfully!');
    } else {
      alert('Error deleting package. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const packageData = {
      _id: editingPackage?._id || 'pkg_' + Date.now(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      price: parseFloat(formData.price),
      location: formData.location,
      duration: formData.duration,
      imageUrl: formData.imageUrl || 'https://via.placeholder.com/400x300',
      highlights: formData.highlights ? formData.highlights.split(',').map(h => h.trim()) : [],
      updatedAt: new Date().toISOString()
    };

    if (!editingPackage) {
      packageData.createdAt = new Date().toISOString();
    }

    const success = await savePackage(packageData);
    if (success) {
      setShowModal(false);
      loadPackages();
      alert(`Package ${editingPackage ? 'updated' : 'added'} successfully!`);
    } else {
      alert('Error saving package. Please try again.');
    }
  };

  const filteredPackages = currentFilter === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === currentFilter);

  // Calculate statistics
  const totalPackages = packages.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => {
      // Try to get price from package or use a default
      const packagePrice = packages.find(p => p.name === b.packageName)?.price || 0;
      return sum + (packagePrice * (b.numberOfPersons || 1));
    }, 0);

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !bookingSearchTerm || 
      booking.customerName?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
      booking.packageName?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
      booking.mobileNumber?.includes(bookingSearchTerm) ||
      booking.email?.toLowerCase().includes(bookingSearchTerm.toLowerCase());
    
    const matchesStatus = bookingStatusFilter === 'all' || booking.status === bookingStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <a 
                href="#" 
                className={currentSection === 'overview' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setCurrentSection('overview'); }}
              >
                Dashboard Overview
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={currentSection === 'packages' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setCurrentSection('packages'); }}
              >
                Manage Packages
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={currentSection === 'bookings' ? 'active' : ''}
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentSection('bookings'); 
                  loadBookings();
                }}
              >
                View Bookings
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {currentSection === 'overview' && (
          <section id="overview-section" className="section active">
            <div className="section-header">
              <h1>Dashboard Overview</h1>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
              <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3 style={{margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'normal'}}>Total Packages</h3>
                <p style={{margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#3498db'}}>{totalPackages}</p>
              </div>
              
              <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3 style={{margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'normal'}}>Total Bookings</h3>
                <p style={{margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#27ae60'}}>{totalBookings}</p>
              </div>
              
              <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3 style={{margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'normal'}}>Pending Bookings</h3>
                <p style={{margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#f39c12'}}>{pendingBookings}</p>
              </div>
              
              <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3 style={{margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'normal'}}>Confirmed Bookings</h3>
                <p style={{margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#27ae60'}}>{confirmedBookings}</p>
              </div>
              
              <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3 style={{margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'normal'}}>Total Revenue (Est.)</h3>
                <p style={{margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#27ae60'}}>₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
              <h2 style={{marginTop: 0}}>Quick Actions</h2>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                <button 
                  className="btn-primary" 
                  onClick={() => setCurrentSection('packages')}
                  style={{padding: '0.75rem 1.5rem'}}
                >
                  Manage Packages
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => { setCurrentSection('bookings'); loadBookings(); }}
                  style={{padding: '0.75rem 1.5rem'}}
                >
                  View All Bookings
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleAddPackage}
                  style={{padding: '0.75rem 1.5rem'}}
                >
                  Add New Package
                </button>
              </div>
            </div>
          </section>
        )}

        {currentSection === 'packages' && (
          <section id="packages-section" className="section active">
            <div className="section-header">
              <h1>Manage Packages</h1>
              <button className="btn-primary" onClick={handleAddPackage}>Add New Package</button>
            </div>

            <div className="filters">
              <button 
                className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCurrentFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${currentFilter === 'trip' ? 'active' : ''}`}
                onClick={() => setCurrentFilter('trip')}
              >
                Trips
              </button>
              <button 
                className={`filter-btn ${currentFilter === 'cab' ? 'active' : ''}`}
                onClick={() => setCurrentFilter('cab')}
              >
                Cabs
              </button>
              <button 
                className={`filter-btn ${currentFilter === 'food' ? 'active' : ''}`}
                onClick={() => setCurrentFilter('food')}
              >
                Food
              </button>
            </div>

            <div className="packages-list">
              {filteredPackages.length === 0 ? (
                <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
                  <h3>No packages yet</h3>
                  <p>Start by adding your first travel package!</p>
                  <button onClick={handleAddPackage} style={{marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                    Add First Package
                  </button>
                </div>
              ) : (
                filteredPackages.map(pkg => (
                  <div key={pkg._id} className="package-item">
                    <div className="package-header">
                      <div>
                        <h3>{pkg.name || 'Unnamed Package'}</h3>
                        <span className={`package-type-badge ${pkg.type || 'other'}`}>
                          {(pkg.type || 'other').toUpperCase()}
                        </span>
                      </div>
                      <div className="package-actions">
                        <button className="btn-edit" onClick={() => handleEditPackage(pkg)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeletePackage(pkg._id)}>Delete</button>
                      </div>
                    </div>
                    <p>{pkg.description || 'No description'}</p>
                    <p><strong>Price:</strong> ₹{(pkg.price || 0).toLocaleString()}</p>
                    {pkg.location && <p><strong>Location:</strong> {pkg.location}</p>}
                    {pkg.duration && <p><strong>Duration:</strong> {pkg.duration}</p>}
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {currentSection === 'bookings' && (
          <section id="bookings-section" className="section active">
            <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h1>Booking Requests</h1>
              <button 
                className="btn-primary" 
                onClick={loadBookings}
                style={{padding: '0.5rem 1.5rem', fontSize: '0.9rem'}}
              >
                Refresh
              </button>
            </div>
            <div className="bookings-list">
              {(() => {
                if (import.meta.env.DEV) {
                  console.log('Rendering bookings section. Bookings count:', filteredBookings.length, 'Bookings:', filteredBookings);
                }
                if (!filteredBookings || filteredBookings.length === 0) {
                  return (
                    <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
                      <h3>No bookings found</h3>
                      <p>{bookingSearchTerm || bookingStatusFilter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Bookings will appear here when customers make reservations.'}</p>
                    </div>
                  );
                }
                return filteredBookings.map((booking, index) => (
                  <div key={booking._id || booking.id || `booking-${index}`} className="booking-item">
                    <div className="booking-header">
                      <div>
                        <h3>{booking.customerName || 'Unknown Customer'}</h3>
                        <span className={`booking-status ${booking.status || 'pending'}`}>
                          {(booking.status || 'pending').toUpperCase()}
                        </span>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <select
                          value={booking.status || 'pending'}
                          onChange={(e) => handleUpdateBookingStatus(booking._id || booking.id, e.target.value)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            backgroundColor: 'white'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteBooking(booking._id || booking.id, booking.customerName)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            border: 'none',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            backgroundColor: '#e74c3c',
                            color: 'white'
                          }}
                          title="Delete Booking"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p><strong>Package:</strong> {booking.packageName || 'N/A'}</p>
                    <p><strong>Mobile:</strong> {booking.mobileNumber || 'N/A'}</p>
                    {booking.email && <p><strong>Email:</strong> {booking.email}</p>}
                    {booking.numberOfPersons && <p><strong>Persons:</strong> {booking.numberOfPersons}</p>}
                    {booking.preferredDates?.start && <p><strong>Start Date:</strong> {new Date(booking.preferredDates.start).toLocaleDateString()}</p>}
                    {booking.additionalNotes && <p><strong>Notes:</strong> {booking.additionalNotes}</p>}
                    <p><small>Booked on: {booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : 'N/A'}</small></p>
                  </div>
                ));
              })()}
            </div>
          </section>
        )}
      </main>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{editingPackage ? 'Edit Package' : 'Add New Package'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Package Name *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="trip">Trip</option>
                  <option value="cab">Cab</option>
                  <option value="food">Food</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  min="0"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input 
                  type="text" 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g., 3 Days 2 Nights"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="url" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label>Highlights (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.highlights}
                  onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                  placeholder="Breakfast included, AC transport"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save Package</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

