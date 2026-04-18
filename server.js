const express = require('express');
const fileupload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Use fileupload middleware
app.use(fileupload());

// Serve static files from current directory
app.use(express.static('.'));

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// File upload endpoint
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.files.file;
  const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.name);
  const filepath = path.join('uploads', filename);

  file.mv(filepath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }
    // Return the URL of the uploaded file
    const fileUrl = `http://localhost:${PORT}/${filepath}`;
    res.json({ url: fileUrl });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});