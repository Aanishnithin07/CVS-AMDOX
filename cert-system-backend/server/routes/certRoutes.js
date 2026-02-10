const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadCertificates, getCertificateById } = require('../controllers/certificateController');

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Upload certificates (Post CSV)
router.post('/upload', upload.single('file'), uploadCertificates);

// Get certificate by ID
router.get('/:id', getCertificateById);

module.exports = router;
