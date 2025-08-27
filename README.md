# Mahidhar Portfolio Forge

A modern, responsive portfolio website built with React and Node.js, organized in a monorepo structure with separate frontend and backend folders.

## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   ├── index.html    # Main HTML file
│   ├── package.json  # Frontend dependencies
│   └── vite.config.ts # Vite configuration
├── backend/          # Express.js backend API
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── uploads/      # File uploads directory
├── package.json      # Root package.json for scripts
└── README.md         # This file
```

## Quick Start

### Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install individually
npm run install:frontend
npm run install:backend
```

### Development
```bash
# Run both frontend and backend concurrently
npm run dev:all

# Or run individually
npm run dev:frontend  # Starts React dev server
npm run dev:backend   # Starts Express server
```

### Build
```bash
# Build frontend for production
npm run build:frontend
```

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **UI Library**: shadcn-ui (Radix UI components)
- **Styling**: Tailwind CSS 3.4.11
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Query
- **Email Service**: EmailJS

### Backend
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose
- **File Uploads**: Multer

## Features

- **Responsive Design**: Works on all device sizes
- **Modern UI**: Built with shadcn-ui components
- **Contact Form**: Integrated email functionality
- **Admin Panel**: Content management interface
- **Project Showcase**: Dynamic project portfolio
- **Skills & Experience**: Professional background display

## Development Notes

- Frontend runs on `http://localhost:5173` (Vite default)
- Backend runs on `http://localhost:3000` (Express default)
- The project uses TypeScript for type safety
- ESLint is configured for code quality
- Tailwind CSS for styling with custom configurations

## Deployment

### Using Lovable
1. Click "Share" in the top right
2. Click "Publish"
3. Your site will be deployed with a lovable.app domain
4. Optionally, configure a custom domain

### Manual Deployment
1. Build the project: `npm run build:frontend`
2. Deploy the `frontend/dist/` folder to your hosting service
3. Set up the backend on a server (Node.js hosting required)
