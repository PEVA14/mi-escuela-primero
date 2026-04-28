# Mi Escuela Primero - School Management Platform

> A comprehensive web application for discovering, managing, and supporting educational institutions through donations and engagement.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

**Mi Escuela Primero** is a full-stack web application designed to connect donors with schools in need of resources. The platform provides:

- A comprehensive catalog of schools with detailed information
- An interactive map for school location discovery
- Admin dashboard for school management
- User authentication and authorization system
- Donation tracking and management
- FAQ and trust-building features
- Responsive design for desktop and mobile devices

This project is part of the "Mexicanos Primeros" initiative to support primary education in Mexico.

## Features

### For Users
- **School Catalog**: Browse and search for schools by name and location
- **School Details**: View comprehensive information about each school, including needs and current projects
- **Interactive Map**: Discover schools geographically using Leaflet maps
- **Donation System**: Contribute to schools' needs and track donations
- **FAQ Section**: Find answers to common questions
- **User Authentication**: Secure login and registration system

### For Administrators
- **School Management**: Add, edit, and delete school information
- **Needs Management**: Create and manage school needs/requirements
- **Donor Responses**: Track and manage donor responses
- **Dashboard**: Comprehensive admin panel for system oversight
- **Data Export**: Export school data using XLSX format
- **Image Upload**: Upload and manage school images

## Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.3.1** - Lightning-fast build tool
- **React Router DOM 7.13.1** - Client-side routing
- **Tailwind CSS 4.2.1** - Utility-first CSS framework
- **Leaflet 1.9.4** - Interactive map library
- **Leaflet GeoSearch 4.4.0** - Geolocation search
- **Axios 1.13.6** - HTTP client
- **XLSX 0.18.5** - Excel file handling
- **ESLint 9.39.1** - Code linting

### Backend
- **Node.js + Express 5.2.1** - Server framework
- **MySQL2 3.22.0** - Database driver
- **JWT 9.0.3** - Authentication token management
- **Bcryptjs 3.0.3** - Password hashing
- **Multer 1.4.5** - File upload handling
- **CORS 2.8.6** - Cross-origin resource sharing
- **Dotenv 17.4.2** - Environment variable management
- **Nodemon 3.1.14** - Development server auto-reload

## Project Structure

```
mi-escuela-primero/
├── backend/
│   ├── db/
│   │   ├── connection.js    # Database connection setup
│   │   ├── init.js          # Database initialization
│   │   ├── queries.js       # Database queries
│   │   └── seed.js          # Database seeding
│   ├── index.js             # Server entry point
│   ├── crear-admin.js       # Admin user creation utility
│   └── package.json         # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── admin/       # Admin-specific components
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── GestionEscuelas.jsx
│   │   │   │   ├── ModalEscuela.jsx
│   │   │   │   ├── ModalNecesidad.jsx
│   │   │   │   └── RespuestasDonadores.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Buscador.jsx         # Search component
│   │   │   ├── Explainer.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ListaTarjeta.jsx    # School list component
│   │   │   ├── Lobby.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── Mapa.jsx            # Map component
│   │   │   ├── MuestraCatalogo.jsx # Catalog display
│   │   │   ├── NavBar.jsx          # Navigation bar
│   │   │   ├── PopUp.jsx
│   │   │   ├── PopUpDonativos.jsx  # Donations popup
│   │   │   ├── PopUpFAQ.jsx        # FAQ popup
│   │   │   ├── Pre_footer.jsx
│   │   │   ├── Tarjeta.jsx         # School card component
│   │   │   ├── Testimonies.jsx
│   │   │   └── TrustBuilding.jsx
│   │   │
│   │   ├── pages/           # Page components
│   │   │   ├── Admin.jsx           # Admin dashboard
│   │   │   ├── AgregarEscuela.jsx  # Add school page
│   │   │   ├── Catalogo.jsx        # Schools catalog page
│   │   │   ├── Detalles.jsx        # School details page
│   │   │   ├── EditEscuela.jsx     # Edit school page
│   │   │   ├── Home.jsx            # Home page
│   │   │   └── Login.jsx           # Login page
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # API client configuration
│   │   │
│   │   ├── utils/
│   │   │   └── formValidation.js   # Form validation utilities
│   │   │
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main App component
│   │   ├── App.css
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   │
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── eslint.config.js    # ESLint configuration
│   └── package.json        # Frontend dependencies
│
├── package.json            # Root package configuration
└── README.md              # This file
```

## Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MySQL** (v5.7 or higher)

### Step 1: Clone the Repository

```bash
git clone https://github.com/MexicanosPrimeros/mi-escuela-primero.git
cd mi-escuela-primero
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

## Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mi_escuela_primero
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_secret_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Frontend Configuration

The frontend API endpoint is configured in `frontend/src/services/api.js`:

```javascript
const API_URL = 'http://localhost:3000/api';
```

Adjust this if your backend runs on a different port or domain.

### Database Configuration

Ensure MySQL is running and create a database:

```bash
mysql -u root -p
CREATE DATABASE mi_escuela_primero;
```

The database will be initialized with the schema and seed data when you first run the backend.

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend development server will start on `http://localhost:5173`

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Schools
- `GET /api/escuelas` - Get all schools
- `GET /api/escuelas/:id` - Get school details
- `POST /api/escuelas` - Create new school (Admin)
- `PUT /api/escuelas/:id` - Update school (Admin)
- `DELETE /api/escuelas/:id` - Delete school (Admin)

### Needs/Donations
- `GET /api/necesidades` - Get all needs
- `POST /api/necesidades` - Create need (Admin)
- `PUT /api/necesidades/:id` - Update need (Admin)
- `DELETE /api/necesidades/:id` - Delete need (Admin)

### Donor Responses
- `GET /api/respuestas` - Get donor responses
- `POST /api/respuestas` - Create donor response
- `GET /api/respuestas/:id` - Get response details

## Database

The application uses MySQL with the following main tables:

- **usuarios** - User accounts and admin accounts
- **escuelas** - School information and details
- **necesidades** - School needs and donation targets
- **respuestas_donadores** - Donation responses and tracking

Database initialization and seed data are handled by `/backend/db/init.js`.

To create an admin user, run:

```bash
cd backend
node crear-admin.js correo@ejemplo.com contraseña123
```

Follow the prompts to add an admin account.

## Development

### Code Style
The project uses ESLint for code quality. Run the linter:

```bash
cd frontend
npm run lint
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (not yet implemented)
