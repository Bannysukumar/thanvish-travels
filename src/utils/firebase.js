// Firebase URL from environment variable or fallback to default
export const FIREBASE_URL = import.meta.env.VITE_FIREBASE_URL || 'https://travaling-76f20-default-rtdb.firebaseio.com';

// Fetch packages from Firebase
export async function fetchPackages() {
  try {
    const response = await fetch(`${FIREBASE_URL}/packages.json`);
    const data = await response.json();
    
    if (data && Object.keys(data).length > 0) {
      return Object.values(data);
    }
    return [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

// Save booking to Firebase
export async function saveBooking(bookingData) {
  try {
    const response = await fetch(`${FIREBASE_URL}/bookings/${bookingData.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    return response.ok;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving booking:', error);
    }
    return false;
  }
}

// Fetch bookings from Firebase
export async function fetchBookings() {
  try {
    const response = await fetch(`${FIREBASE_URL}/bookings.json`);
    const data = await response.json();
    
    if (data && Object.keys(data).length > 0) {
      return Object.values(data);
    }
    return [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching bookings:', error);
    }
    return [];
  }
}

// Save package to Firebase (admin)
export async function savePackage(packageData) {
  try {
    const response = await fetch(`${FIREBASE_URL}/packages/${packageData._id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(packageData)
    });

    return response.ok;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving package:', error);
    }
    return false;
  }
}

// Delete package from Firebase (admin)
export async function deletePackage(packageId) {
  try {
    const response = await fetch(`${FIREBASE_URL}/packages/${packageId}.json`, {
      method: 'DELETE'
    });

    return response.ok;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error deleting package:', error);
    }
    return false;
  }
}

// Update booking status in Firebase (admin)
export async function updateBookingStatus(bookingId, status) {
  try {
    // First get the current booking data
    const bookingResponse = await fetch(`${FIREBASE_URL}/bookings/${bookingId}.json`);
    if (!bookingResponse.ok) {
      return false;
    }
    
    const currentBooking = await bookingResponse.json();
    if (!currentBooking) {
      return false;
    }
    
    // Update the status
    const updatedBooking = {
      ...currentBooking,
      status: status
    };
    
    // Save the updated booking
    const response = await fetch(`${FIREBASE_URL}/bookings/${bookingId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedBooking)
    });

    return response.ok;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error updating booking status:', error);
    }
    return false;
  }
}

// Delete booking from Firebase (admin)
export async function deleteBooking(bookingId) {
  try {
    const response = await fetch(`${FIREBASE_URL}/bookings/${bookingId}.json`, {
      method: 'DELETE'
    });

    return response.ok;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error deleting booking:', error);
    }
    return false;
  }
}

// WhatsApp helper
export function sendWhatsAppMessage(message) {
  const phoneNumber = '918099996622';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

