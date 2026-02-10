const Certificate = require('../models/Certificate');
const fs = require('fs');
const csv = require('csv-parser');

// @desc    Upload Certificates via CSV
// @route   POST /api/certificates/upload
// @access  Private (Admin)
const uploadCertificates = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Map CSV data to matches Schema model if keys match, otherwise map manually
                // Assuming CSV headers match: certificateId, studentName, internshipDomain, startDate, endDate, email

                const certificates = results.map(row => ({
                    certificateId: row.certificateId,
                    studentName: row.studentName,
                    internshipDomain: row.internshipDomain,
                    startDate: new Date(row.startDate),
                    endDate: new Date(row.endDate),
                    email: row.email,
                    isRevoked: false
                }));

                await Certificate.insertMany(certificates);

                // Delete file after processing
                fs.unlinkSync(filePath);

                res.status(201).json({ message: `Successfully added ${certificates.length} certificates` });
            } catch (error) {
                // Clean up file if error occurs
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                res.status(500).json({ message: error.message });
            }
        })
        .on('error', (error) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            res.status(500).json({ message: error.message });
        });
};

// @desc    Get Certificate by ID
// @route   GET /api/certificates/:id
// @access  Public
const getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.id });

        if (certificate) {
            // Check if revoked
            if (certificate.isRevoked) {
                return res.status(403).json({ message: 'This certificate has been revoked.' });
            }
            res.json(certificate);
        } else {
            res.status(404).json({ message: 'Certificate not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
// @access  Private (Admin)
const getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({}).sort({ _id: -1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Revoke a certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private (Admin)
const revokeCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.id });

        if (certificate) {
            certificate.isRevoked = true;
            await certificate.save();
            res.json({ message: 'Certificate revoked successfully' });
        } else {
            res.status(404).json({ message: 'Certificate not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadCertificates, getCertificateById, getAllCertificates, revokeCertificate };
