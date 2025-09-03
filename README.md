# Rental Admin Dashboard

A comprehensive React.js admin dashboard for managing rental properties with full CRUD operations, authentication, and responsive design.

## Features

- **Authentication System**: Secure login and signup with form validation
- **Dashboard Overview**: Statistics cards, property performance charts, and recent activity feed
- **Property Management**: Complete CRUD operations for properties with search and filtering
- **Settings Page**: User profile, notifications, security, and appearance preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Styled Components
- **Icons**: React Icons
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.js
│   │   └── Signup.js
│   ├── Dashboard/
│   │   ├── Dashboard.js
│   │   ├── StatsCard.js
│   │   ├── RecentActivity.js
│   │   └── PropertyChart.js
│   ├── Layout/
│   │   ├── Layout.js
│   │   ├── Header.js
│   │   └── Sidebar.js
│   ├── Properties/
│   │   ├── Properties.js
│   │   ├── PropertyCard.js
│   │   └── PropertyModal.js
│   └── Settings/
│       └── Settings.js
├── context/
│   └── AuthContext.js
├── App.js
├── index.js
└── index.css
```

## Usage

### Authentication
- Create a new account using the signup form
- Login with your credentials
- The app uses local storage for session management (demo purposes)

### Dashboard
- View key metrics and statistics
- Monitor property performance with interactive charts
- Track recent activities and updates

### Property Management
- Add new properties with detailed information
- Edit existing property details
- View property information in detail
- Delete properties with confirmation
- Search and filter properties by status

### Settings
- Update your profile information
- Configure notification preferences
- Change security settings and password
- Customize appearance and language preferences

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full sidebar navigation and multi-column layouts
- **Tablet**: Collapsible sidebar and adjusted grid layouts
- **Mobile**: Hamburger menu, single-column layouts, and touch-friendly interfaces

## Demo Data

The application includes mock data for demonstration purposes:
- Sample properties with different statuses
- Mock statistics and charts
- Simulated recent activities

In a production environment, these would be replaced with actual API calls to your backend service.

## Customization

### Styling
- All components use Styled Components for easy customization
- Color scheme and theme can be modified in the component files
- Responsive breakpoints are defined in the styled components

### Adding Features
- The modular structure makes it easy to add new components
- Authentication context can be extended for additional user management
- Property data structure can be modified to include more fields

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for demonstration purposes. Feel free to use and modify as needed for your rental management application.
