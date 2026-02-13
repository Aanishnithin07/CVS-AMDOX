import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, AlertTriangle, Loader, ShieldCheck } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center py-10 px-4">
            <motion.div
                className="w-full max-w-3xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {error ? (
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-lg mx-auto">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
                            {error.includes('revoked') ? (
                                <XCircle className="h-10 w-10 text-red-500" />
                            ) : (
                                <AlertTriangle className="h-10 w-10 text-yellow-500" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-lg text-red-600 font-medium mb-8">{error}</p>
                        <Link
                            to="/"
                            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                        >
                            <span className="mr-2">←</span> Verify another certificate
                        </Link>
                    </div>
                ) : (
                    <div className="relative bg-white p-1 md:p-2 shadow-2xl rounded-xl overflow-hidden">
                        {/* Certificate Border Container */}
                        <div className="border-[10px] border-double border-gray-200 p-8 md:p-12 text-center relative">

                            {/* Watermark/Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                                <ShieldCheck size={400} />
                            </div>

                            {/* Verified Badge */}
                            <div className="absolute top-6 right-6 flex flex-col items-center animate-pulse">
                                <div className="bg-green-100 text-green-700 p-2 rounded-full border-2 border-green-200 shadow-sm">
                                    <CheckCircle size={32} />
                                </div>
                                <span className="text-xs font-bold text-green-700 mt-1 uppercase tracking-wider">Verified</span>
                            </div>

                            {/* Header */}
                            <div className="mb-10">
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-wide">
                                    Certificate of Completion
                                </h1>
                                <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold">
                                    This certifies that
                                </p>
                            </div>

                            {/* Student Name */}
                            <div className="mb-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary-800 border-b-2 border-gray-100 inline-block pb-2 px-10">
                                    {certificate.studentName}
                                </h2>
                            </div>

                            {/* Details */}
                            <div className="mb-12">
                                <p className="text-xl text-gray-600 mb-2">
                                    has successfully completed the internship in
                                </p>
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                    {certificate.internshipDomain}
                                </h3>
                                <p className="text-gray-500">
                                    from <span className="font-semibold text-gray-900">{new Date(certificate.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span> to <span className="font-semibold text-gray-900">{new Date(certificate.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                </p>
                            </div>

                            {/* Footer/ID */}
                            <div className="flex justify-between items-end mt-12 border-t pt-8">
                                <div className="text-left">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Certificate ID</p>
                                    <p className="font-mono text-sm text-gray-600 font-medium">{certificate.certificateId}</p>
                                </div>
                                <div className="text-right">
                                    <div className="h-12 w-32 border-b border-gray-400 mb-2"></div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Authorized Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!error && (
                    <div className="mt-8 text-center">
                        <Link
                            to="/"
                            className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-all"
                        >
                            Verify another certificate
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerificationResult;
