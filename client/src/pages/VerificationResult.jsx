import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const VerificationResult = () => {
    const { id } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5001/api/certificates/${id}`);
                setCertificate(data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Certificate not found or invalid');
                setCertificate(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {error ? (
                    <div className="text-center">
                        {error.includes('revoked') ? (
                            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                        ) : (
                            <AlertTriangle className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                        <p className="text-lg text-red-600 font-medium">{error}</p>
                        <div className="mt-8">
                            <Link to="/" className="text-blue-600 hover:underline">Verify another certificate</Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse opacity-50"></div>
                            <CheckCircle className="relative h-20 w-20 text-green-500 mx-auto mb-6" />
                        </div>

                        <h2 className="text-3xl font-bold text-green-600 mb-2">Verified Successfully</h2>
                        <p className="text-gray-500 mb-8">This certificate is valid and authentic.</p>

                        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">Student Name</label>
                                    <p className="text-xl font-semibold text-gray-900">{certificate.studentName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">Certificate ID</label>
                                    <p className="text-xl font-mono text-gray-900">{certificate.certificateId}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">Internship Domain</label>
                                    <p className="text-lg text-gray-900">{certificate.internshipDomain}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</label>
                                    <p className="text-lg text-gray-900">
                                        {new Date(certificate.startDate).toLocaleDateString()} - {new Date(certificate.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Link to="/" className="text-blue-600 hover:underline font-medium">Verify another certificate</Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerificationResult;
