const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { encrypt, decrypt } = require('./utils/encrypt');

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve static files from public/
app.use(express.static('public'));

// Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const originalName = req.file.originalname;
    const encryptedBuffer = encrypt(req.file.buffer);

    const uploadPath = path.join(uploadDir, originalName);
    fs.writeFileSync(uploadPath, encryptedBuffer);

    res.send(`✅ File "${originalName}" uploaded and encrypted successfully.`);
});

// Download Route
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('❌ File not found.');
    }

    const encryptedBuffer = fs.readFileSync(filePath);
    const decryptedBuffer = decrypt(encryptedBuffer);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(decryptedBuffer);
});

// Serve list of uploaded files
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to read files' });
        res.json(files);
    });
});

// Handle file deletion
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete file' });
        res.json({ message: '🗑️ File deleted successfully.' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});