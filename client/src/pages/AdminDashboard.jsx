import { useEffect, useState } from 'react';
import axios from 'axios';
import { Upload, FileText, XCircle, Search, Loader } from 'lucide-react';

const AdminDashboard = () => {
    const [certificates, setCertificates] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCertificates = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5001/api/certificates', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCertificates(data);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5001/api/certificates/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(data.message);
            setFile(null);
            // Reset file input
            document.getElementById('file-upload').value = '';
            fetchCertificates();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleRevoke = async (id) => {
        if (!window.confirm('Are you sure you want to revoke this certificate?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/certificates/${id}/revoke`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCertificates();
        } catch (error) {
            alert(error.response?.data?.message || 'Revocation failed');
        }
    };

    const filteredCertificates = certificates.filter(cert =>
        cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Certificates</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{certificates.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Active</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {certificates.filter(c => !c.isRevoked).length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Revoked</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                        {certificates.filter(c => c.isRevoked).length}
                    </p>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Upload size={20} />
                    Upload Certificates (CSV)
                </h2>
                <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className={`px-6 py-2 rounded-lg font-semibold text-white transition duration-300 ${uploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 text-sm font-medium ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
                        {message}
                    </p>
                )}
            </div>

            {/* Certificate List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={20} />
                        Recent Certificates
                    </h2>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 flex justify-center">
                        <Loader className="animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Domain</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCertificates.map((cert) => (
                                    <tr key={cert._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-sm">{cert.certificateId}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{cert.studentName}</td>
                                        <td className="px-6 py-4 text-gray-600">{cert.internshipDomain}</td>
                                        <td className="px-6 py-4 text-gray-600">{new Date(cert.startDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            {cert.isRevoked ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Revoked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Valid
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {!cert.isRevoked && (
                                                <button
                                                    onClick={() => handleRevoke(cert.certificateId)}
                                                    className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition"
                                                >
                                                    <XCircle size={14} /> Revoke
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredCertificates.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No certificates found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
