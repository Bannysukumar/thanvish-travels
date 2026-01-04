import { useState } from 'react';
import { saveBooking, sendWhatsAppMessage } from '../utils/firebase';
import '../styles.css';

function BookingModal({ pkg, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    email: '',
    numberOfPersons: 1,
    startDate: '',
    endDate: '',
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobileNumber') {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile number
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    const bookingData = {
      id: 'booking_' + Date.now(),
      packageId: pkg._id,
      packageName: pkg.name,
      customerName: formData.customerName,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      numberOfPersons: parseInt(formData.numberOfPersons),
      preferredDates: {
        start: formData.startDate,
        end: formData.endDate
      },
      additionalNotes: formData.additionalNotes,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    try {
      const success = await saveBooking(bookingData);
      
      if (success) {
        // Send WhatsApp message
        const whatsappMessage = `Hi! I've submitted a booking request for "${pkg.name}".

Details:
- Name: ${formData.customerName}
- Mobile: ${formData.mobileNumber}
- Package: ${pkg.name}
- Start Date: ${formData.startDate}
- Number of Persons: ${formData.numberOfPersons}

Please confirm my booking. Thank you!`;
        
        sendWhatsAppMessage(whatsappMessage);
        onSuccess();
      } else {
        alert('Error submitting booking. Please try again.');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error submitting booking:', error);
      }
      alert('Error submitting booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Book Your Package</h2>
        <form id="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer-name">Your Name *</label>
            <input 
              type="text" 
              id="customer-name" 
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input 
              type="tel" 
              id="mobile" 
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              pattern="[0-9]{10}" 
              maxLength="10" 
              placeholder="Enter 10-digit mobile number" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email (Optional)</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="persons">Number of Persons *</label>
            <input 
              type="number" 
              id="persons" 
              name="numberOfPersons"
              value={formData.numberOfPersons}
              onChange={handleChange}
              min="1" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="start-date">Preferred Start Date *</label>
            <input 
              type="date" 
              id="start-date" 
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={today}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="end-date">End Date (Optional)</label>
            <input 
              type="date" 
              id="end-date" 
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={today}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea 
              id="notes" 
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;

