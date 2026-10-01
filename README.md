# Thanvish Travels - React Application

This is the React version of the Thanvish Travels website, converted from vanilla HTML/CSS/JavaScript to a modern React application.

## Features

- **React 18** with modern hooks and context API
- **React Router** for client-side routing
- **Firebase Realtime Database** integration
- **Responsive design** with modern UI
- **Admin dashboard** for managing packages and bookings
- **Real-time updates** for packages

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory. This creates an optimized production build with:
- Code minification and tree-shaking
- Asset optimization
- Code splitting for better performance
- Console.log removal in production

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally on `http://localhost:4173` for testing.

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for various platforms:
- Vercel (Recommended)
- Netlify
- Firebase Hosting
- GitHub Pages
- Traditional Web Hosting

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── BookingModal.jsx
│   └── SuccessMessage.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TravelPackages.jsx
│   ├── CabServices.jsx
│   ├── FoodDelivery.jsx
│   └── AllServices.jsx
├── context/            # React Context providers
│   └── PackagesContext.jsx
├── utils/              # Utility functions
│   └── firebase.js
├── App.jsx             # Main App component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Firebase Configuration

The app uses Firebase Realtime Database. The Firebase URL is configured in `src/utils/firebase.js`:

```javascript
export const FIREBASE_URL = 'https://travaling-76f20-default-rtdb.firebaseio.com';
```

Make sure your Firebase database is set up with the following structure:
- `/packages` - Travel packages data
- `/bookings` - Booking requests

## Admin Access

- **Login URL**: `/login`
- **Default Password**: `admin123`
- **Dashboard URL**: `/dashboard`

## Routes

- `/` - Home page
- `/contact` - Contact page
- `/travel-packages` - Travel packages listing
- `/cab-services` - Cab services listing
- `/food-delivery` - Food delivery options
- `/all-services` - All services with filters
- `/login` - Admin login
- `/dashboard` - Admin dashboard

## Technologies Used

- React 18
- React Router DOM 6
- Vite (build tool)
- Firebase Realtime Database
- CSS3 (original styles preserved)

## Development

The original HTML/CSS/JavaScript files are preserved in the root directory for reference. The React conversion maintains the same functionality and styling.

## License

Copyright © 2024 Thanvish Travels. All rights reserved.

<!-- readme-seo: bannysukumar -->

## Open source

This repository is open source and maintained by [Banny Sukumar](https://github.com/Bannysukumar). Thanvish Travels is published so other developers can study the code and contribute.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Banny Sukumar. See [CONTRIBUTING.md](CONTRIBUTING.md) if you want to help.
