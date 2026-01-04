import '../styles.css';

function SuccessMessage({ onClose }) {
  return (
    <div className="success-message" onClick={onClose}>
      <div className="success-content" onClick={(e) => e.stopPropagation()}>
        <h3>Booking Successful!</h3>
        <p>Thank you for your booking request. Our admin will contact you soon with Indian hospitality and care.</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default SuccessMessage;

