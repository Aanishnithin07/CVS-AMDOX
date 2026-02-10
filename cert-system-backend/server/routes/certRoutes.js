const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadCertificates, getCertificateById, getAllCertificates, revokeCertificate } = require('../controllers/certificateController');
const { protect, admin } = require('../middleware/authMiddleware');

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Upload certificates (Post CSV) - Admin only
router.post('/upload', protect, admin, upload.single('file'), uploadCertificates);

// Get all certificates - Admin only
router.get('/', protect, admin, getAllCertificates);

// Revoke certificate - Admin only
router.put('/:id/revoke', protect, admin, revokeCertificate);

// Get certificate by ID - Public
router.get('/:id', getCertificateById);

module.exports = router;
