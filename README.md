# FUTURE_CS_03
File Sharing System
Secure File Sharing System - README
Project Summary
This is a secure file sharing system built with Node.js and Express. It enables users to upload, download, and manage encrypted files via a simple web interface.
All files are encrypted at rest using AES-128-CBC. Encryption keys can be managed using environment variables or through a key file rotation method.

Features
- AES encryption (AES-128-CBC) for all uploaded files
- Files stored encrypted at rest
- Key management via .env or key files
- User-friendly web interface
- Upload / Download / Delete support
- Secure backend using Node.js + Express
Setup Instructions
1. Clone this repository:
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
2. Navigate into the project folder:
   cd secure-file-sharing
3. Install dependencies:
   npm install
4. Create a `.env` file and add your 16-byte key:
   SECRET_KEY=your-16-byte-key-here
5. Run the server:
   node server.js
6. Open your browser at:
   http://localhost:3000

Folder Structure

project-root/
├── server.js            # Main Express server
├── utils/encrypt.js     # AES encryption/decryption logic
├── public/index.html    # Frontend UI
├── uploads/             # Encrypted file storage
├── keys/                # Key management files (for fallback)
├── .env                 # Secret key for encryption
└── README.md

Security Considerations
- Keys are never hardcoded in the code.
- IV is randomly generated per encryption.
- HTTPS should be enabled for deployment.
- `.env`, `keys/`, and `uploads/` should never be committed to GitHub.

Credits
Developed during the Cybersecurity Internship at Future Interns.
