import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// API routes should be handled by the backend service
// For now, we'll proxy API requests to the backend service
app.use('/api', (req, res) => {
  // In a production environment, this should proxy to your backend service
  res.status(501).json({ error: 'API routes should be handled by the backend service' });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  console.log(`Serving index.html for route: ${req.path}`);
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'frontend/dist')}`);
});