# Backend Deployment Link Update Design

## Overview

This design document outlines the systematic update of backend API endpoint URLs throughout the Mahidhar Portfolio application from the local development URL (`http://localhost:4000`) to the production deployment URL (`https://portfoliomahidhar-backend.onrender.com/`).

The portfolio application is a full-stack web application with separate frontend (React) and backend (Express.js) components that need to be updated to point to the deployed backend service.

## Architecture

### Current Architecture
```mermaid
graph TB
    A[React Frontend] --> B[Local Backend API]
    B --> C[MongoDB Atlas]
    
    subgraph "Current URLs"
        D["http://localhost:4000"]
    end
    
    A -.->|API Calls| D
```

### Target Architecture
```mermaid
graph TB
    A[React Frontend] --> B[Deployed Backend API]
    B --> C[MongoDB Atlas]
    
    subgraph "Production URLs"
        D["https://portfoliomahidhar-backend.onrender.com/"]
    end
    
    A -.->|API Calls| D
```

## API Endpoints Configuration

### Core API Configuration Files

| File Path | Current URL | Target URL | Purpose |
|-----------|-------------|------------|---------|
| `/frontend/src/lib/api.ts` | `http://localhost:4000` | `https://portfoliomahidhar-backend.onrender.com` | Central API configuration |

### Component Files Requiring Updates

| Component File | Current URL | API Endpoints Used |
|----------------|-------------|-------------------|
| `/frontend/src/pages/admin/ExperienceAdmin.tsx` | `http://localhost:4000` | `/experiences` |
| `/frontend/src/pages/admin/SkillsAdmin.tsx` | `http://localhost:4000` | `/skills` |
| `/frontend/src/pages/admin/ContactAdmin.tsx` | `http://localhost:4000` | `/contact-info` |
| `/frontend/src/pages/admin/CertificationsAdmin.tsx` | `http://localhost:4000` | `/certifications` |
| `/frontend/src/pages/admin/ProjectsAdmin.tsx` | `http://localhost:4000` | `/projects` |
| `/frontend/src/components/Contact.tsx` | `http://localhost:4000` | `/contact-info` |
| `/frontend/src/components/Certifications.tsx` | `http://localhost:4000` | `/certifications` |
| `/frontend/src/components/Skills.tsx` | `http://localhost:4000` | `/skills` |
| `/frontend/src/components/Hero.tsx` | `http://localhost:4000` | `/contact-info` |
| `/frontend/src/components/Experience.tsx` | `http://localhost:4000` | `/experiences` |
| `/frontend/src/components/Projects.tsx` | `http://localhost:4000` | `/projects` |

### API Endpoints Reference

The backend provides the following REST API endpoints:

| Endpoint | HTTP Method | Purpose | Authentication |
|----------|-------------|---------|----------------|
| `/skills` | GET | Fetch skills data | No |
| `/skills` | PUT | Update skills data | Yes (`mahi@123`) |
| `/certifications` | GET | Fetch certifications | No |
| `/certifications` | PUT | Update certifications | Yes (`mahi@123`) |
| `/projects` | GET | Fetch projects | No |
| `/projects` | PUT | Update projects | Yes (`mahi@123`) |
| `/experiences` | GET | Fetch experiences | No |
| `/experiences` | PUT | Update experiences | Yes (`mahi@123`) |
| `/contact-info` | GET | Fetch contact information | No |
| `/contact-info` | PUT | Update contact information | Yes (`mahi@123`) |
| `/about` | GET | Fetch about information | No |
| `/about` | PUT | Update about information | Yes (`mahi@123`) |
| `/upload` | POST | Upload images | Yes (`mahi@123`) |

## Update Strategy

### Centralized Configuration Approach

```mermaid
flowchart TD
    A[Update Central API Config] --> B[Update Individual Components]
    B --> C[Verify All Endpoints]
    C --> D[Test Production Connectivity]
    D --> E[Deploy Changes]
    
    subgraph "Files to Update"
        F[api.ts - Central Config]
        G[Admin Components]
        H[Public Components]
    end
    
    A --> F
    B --> G
    B --> H
```

### Update Sequence

1. **Primary Configuration Update**
   - Update `API_BASE` constant in `/frontend/src/lib/api.ts`
   - This handles the centralized API configuration

2. **Component-Level Updates**
   - Update `API_BASE` constants in individual admin components
   - Update `API_URL` constants in public components
   - Ensure consistency across all components

3. **Verification Points**
   - Confirm all hardcoded localhost references are updated
   - Verify CORS configuration on backend supports the new domain
   - Test API connectivity from frontend to production backend

## Configuration Changes

### Central API Configuration (`/frontend/src/lib/api.ts`)

```typescript
// Before
const API_BASE = 'http://localhost:4000';

// After  
const API_BASE = 'https://portfoliomahidhar-backend.onrender.com';
```

### Admin Component Pattern

```typescript
// Before
const API_BASE = "http://localhost:4000"

// After
const API_BASE = "https://portfoliomahidhar-backend.onrender.com"
```

### Public Component Pattern

```typescript
// Before
const API_URL = 'http://localhost:4000';

// After
const API_URL = 'https://portfoliomahidhar-backend.onrender.com';
```

## Backend Compatibility

### CORS Configuration Verification

The backend must support requests from the frontend domain. Ensure the backend's CORS configuration includes appropriate origins:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',  // Development
    'https://your-frontend-domain.com',  // Production frontend
    // Other allowed origins
  ]
}));
```

### MongoDB Connection

The backend is already configured with MongoDB Atlas connection string, which should remain functional:
```javascript
mongoose.connect('mongodb+srv://nallapanenimahidhar2004:LpmwoYdr4euwYEyX@cluster0.oclfqi3.mongodb.net/portfolio?retryWrites=true&w=majority')
```

### Authentication Token

The authentication system uses a simple bearer token (`mahi@123`) which will continue to work with the production deployment.

## Testing Strategy

### API Connectivity Testing

```mermaid
graph LR
    A[Frontend] --> B[GET /skills]
    A --> C[GET /projects]  
    A --> D[GET /experiences]
    A --> E[GET /certifications]
    A --> F[GET /contact-info]
    
    B --> G[Verify Response]
    C --> G
    D --> G
    E --> G
    F --> G
```

### Admin Functionality Testing

1. **Authentication Flow**
   - Verify admin login with token `mahi@123`
   - Test unauthorized access handling

2. **CRUD Operations**
   - Test data fetching in admin panels
   - Test data updates through PUT requests
   - Verify file upload functionality

3. **Public Data Display**
   - Confirm public pages load data correctly
   - Verify responsive design maintains functionality

## Implementation Checklist

- [x] Update `/frontend/src/lib/api.ts` - Central API configuration
- [x] Update `/frontend/src/pages/admin/ExperienceAdmin.tsx`
- [x] Update `/frontend/src/pages/admin/SkillsAdmin.tsx`
- [x] Update `/frontend/src/pages/admin/ContactAdmin.tsx`
- [x] Update `/frontend/src/pages/admin/CertificationsAdmin.tsx`
- [x] Update `/frontend/src/pages/admin/ProjectsAdmin.tsx`
- [x] Update `/frontend/src/components/Contact.tsx`
- [x] Update `/frontend/src/components/Certifications.tsx`
- [x] Update `/frontend/src/components/Skills.tsx`
- [x] Update `/frontend/src/components/Hero.tsx`
- [x] Update `/frontend/src/components/Experience.tsx`
- [x] Update `/frontend/src/components/Projects.tsx`
- [ ] Test all API endpoints connectivity
- [ ] Verify admin panel functionality
- [ ] Confirm public pages load correctly
- [ ] Deploy frontend with updated configuration

## Risk Mitigation

### Potential Issues

1. **CORS Errors**
   - Ensure backend allows requests from frontend domain
   - Verify proper headers are set

2. **SSL/HTTPS Issues**
   - Confirm backend deployment supports HTTPS
   - Update any mixed content warnings

3. **Authentication Failures**
   - Verify token-based authentication works across domains
   - Test admin functionality post-deployment

### Rollback Strategy

1. Keep backup of current configuration files
2. Document current working localhost URLs
3. Prepare quick revert process if production issues arise
4. Test rollback procedure in development environment

## Environment-Specific Configuration

### Development vs Production

Consider implementing environment-based configuration for future flexibility:

```typescript
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://portfoliomahidhar-backend.onrender.com'
  : 'http://localhost:4000';
```

This approach would allow seamless switching between development and production environments.