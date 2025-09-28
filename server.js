import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Debug route
app.get('/debug', (req, res) => {
  res.json({
    message: 'Server is running',
    distPath: path.join(__dirname, 'frontend/dist'),
    files: require('fs').readdirSync(path.join(__dirname, 'frontend/dist'))
  });
});

// Specific route for admin
app.get('/admin', (req, res) => {
  console.log('Admin route requested');
  const indexPath = path.join(__dirname, 'frontend/dist/index.html');
  res.sendFile(indexPath);
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  console.log(`Requested path: ${req.path}`);
  const indexPath = path.join(__dirname, 'frontend/dist/index.html');
  console.log(`Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'frontend/dist')}`);
});
