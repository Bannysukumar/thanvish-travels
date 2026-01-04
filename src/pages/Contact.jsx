import { useState } from 'react';
import '../themes.css';
import '../styles.css';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    
    const contactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    
    try {
      const response = await fetch('https://travaling-76f20-default-rtdb.firebaseio.com/contacts.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });
      
      if (response.ok) {
        alert('Thank you for your message! We will get back to you within 2 hours.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error sending contact form:', error);
      }
      alert('Sorry, there was an error sending your message. Please try calling us directly at +91 80999 96622');
    }
  };

  return (
    <>
      {/* Mandala Background */}
      <div className="mandala-bg"></div>
      
      {/* Cultural Pattern Elements */}
      <div className="cultural-pattern" style={{top: '10%', left: '5%'}}></div>
      <div className="cultural-pattern" style={{top: '20%', right: '10%'}}></div>
      <div className="cultural-pattern" style={{bottom: '30%', left: '15%'}}></div>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p>We're here to help you plan your perfect journey. Contact our travel experts for personalized assistance and recommendations with Indian hospitality.</p>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="contact-main">
        <div className="container">
          {/* Contact Information and Form */}
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info-section">
              <h2>Multiple Ways to Reach Us</h2>
              <p className="section-intro">Choose the most convenient way to connect with our travel experts</p>
              
              <div className="contact-method">
                <div className="contact-method-icon">📞</div>
                <div className="contact-method-details">
                  <h3>Call Our Hotline</h3>
                  <p><strong>+91 80999 96622</strong></p>
                  <p>Toll-Free: 1800-123-TRAVEL</p>
                  <span>Available 24/7 for emergencies • Regular hours: 6 AM - 11 PM IST</span>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-method-icon">✉️</div>
                <div className="contact-method-details">
                  <h3>Email Support</h3>
                  <p><strong>info@thanvishtravels.com</strong></p>
                  <p>bookings@thanvishtravels.com</p>
                  <span>Response time: Within 2-4 hours during business hours</span>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-method-icon">📍</div>
                <div className="contact-method-details">
                  <h3>Visit Our Head Office</h3>
                  <p><strong>Thanvish Travels Headquarters</strong></p>
                  <p>123 Travel Plaza, Lokhandwala Complex</p>
                  <p>Andheri West, Mumbai - 400058</p>
                  <p>Maharashtra, India</p>
                  <span>Free parking available • Near Andheri Metro Station</span>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-method-icon">💬</div>
                <div className="contact-method-details">
                  <h3>Instant Messaging</h3>
                  <p><strong>WhatsApp Business</strong></p>
                  <p>+91 80999 96622</p>
                  <span>Quick replies • Share documents • Voice messages welcome</span>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      pattern="[0-9]{10}" 
                      maxLength="10" 
                      placeholder="Enter 10-digit mobile number" 
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Assistance</option>
                    <option value="travel">Travel Packages</option>
                    <option value="cab">Cab Services</option>
                    <option value="food">Food Delivery</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="6" 
                    placeholder="Tell us how we can help you..." 
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
          
          {/* Business Hours */}
          <div className="business-hours">
            <div className="container">
              <h2>When We're Available</h2>
              <p className="section-intro">We're here to serve you at your convenience</p>
              <div className="hours-grid">
                <div className="hours-card">
                  <div className="hours-icon">🌟</div>
                  <h3>24/7 Emergency Support</h3>
                  <p><strong>Round the Clock</strong></p>
                  <p>For urgent travel assistance</p>
                  <p>Immediate response guaranteed</p>
                  <p className="highlight">Call: +91 80999 96622</p>
                </div>
                
                <div className="hours-card">
                  <div className="hours-icon">🏢</div>
                  <h3>Office Walk-ins</h3>
                  <p><strong>Monday - Friday</strong></p>
                  <p>9:00 AM - 8:00 PM IST</p>
                  <p><strong>Saturday</strong></p>
                  <p>10:00 AM - 6:00 PM IST</p>
                  <p><strong>Sunday & Holidays</strong></p>
                  <p>11:00 AM - 4:00 PM IST</p>
                </div>
                
                <div className="hours-card">
                  <div className="hours-icon">💻</div>
                  <h3>Online Services</h3>
                  <p><strong>Website Booking</strong></p>
                  <p>Available 24/7</p>
                  <p><strong>Live Chat Support</strong></p>
                  <p>6:00 AM - 11:00 PM IST</p>
                  <p><strong>Email Response</strong></p>
                  <p>Within 2-4 hours</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Location Section */}
          <div className="location-section">
            <h2>Find Us Easily</h2>
            <p className="section-intro">Conveniently located in the heart of Mumbai with easy access from all major areas</p>
            
            <div className="location-features">
              <div className="location-feature">
                <span className="feature-icon">🚇</span>
                <p>5 min walk from Andheri Metro Station</p>
              </div>
              <div className="location-feature">
                <span className="feature-icon">🚗</span>
                <p>Free parking available for customers</p>
              </div>
              <div className="location-feature">
                <span className="feature-icon">🚌</span>
                <p>Multiple bus routes nearby</p>
              </div>
              <div className="location-feature">
                <span className="feature-icon">☕</span>
                <p>Refreshment lounge for visitors</p>
              </div>
            </div>
            
            <div className="map-container">
              <img src="https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800" alt="Mumbai Office Location" className="office-image" />
              <div className="map-overlay">
                <h3>Thanvish Travels Head Office</h3>
                <p>123 Travel Plaza, Lokhandwala Complex<br />
                Andheri West, Mumbai - 400058</p>
                <a href="https://maps.google.com/?q=Andheri+West+Mumbai" target="_blank" rel="noopener noreferrer" className="directions-btn">
                  Get Directions
                </a>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="faq-section">
            <div className="container">
              <h2>Frequently Asked Questions</h2>
              <p className="section-intro">Quick answers to common queries</p>
              
              <div className="faq-grid">
                <div className="faq-item">
                  <h3>What are your payment options?</h3>
                  <p>We accept all major credit/debit cards, UPI, net banking, and cash payments at our office. EMI options available on select packages.</p>
                </div>
                
                <div className="faq-item">
                  <h3>How quickly can I get a response?</h3>
                  <p>Email responses within 2-4 hours during business hours. WhatsApp and phone support available instantly during operating hours.</p>
                </div>
                
                <div className="faq-item">
                  <h3>Do you offer customized packages?</h3>
                  <p>Yes! All our packages can be customized according to your preferences, budget, and travel dates. Just let us know your requirements.</p>
                </div>
                
                <div className="faq-item">
                  <h3>What about cancellation policies?</h3>
                  <p>Cancellation policies vary by package. Generally, free cancellation up to 7 days before travel. Check specific package terms for details.</p>
                </div>
                
                <div className="faq-item">
                  <h3>Do you provide travel insurance?</h3>
                  <p>Yes, we offer comprehensive travel insurance options covering medical emergencies, trip cancellations, and baggage loss.</p>
                </div>
                
                <div className="faq-item">
                  <h3>Can I book for a large group?</h3>
                  <p>Absolutely! We specialize in group bookings with special discounts for groups of 10 or more. Contact us for exclusive group rates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
