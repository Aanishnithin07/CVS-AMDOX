import { useEffect, useState } from 'react';
import axios from 'axios';
import { Upload, FileText, XCircle, Search, Loader, ShieldCheck, CheckCircle } from 'lucide-react';

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
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage certificates and view system statistics</p>
                </div>
                <div className="text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Certificates</p>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2">{certificates.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active</p>
                            <h3 className="text-4xl font-bold text-green-600 mt-2">
                                {certificates.filter(c => !c.isRevoked).length}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl">
                            <ShieldCheck className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Revoked</p>
                            <h3 className="text-4xl font-bold text-red-600 mt-2">
                                {certificates.filter(c => c.isRevoked).length}
                            </h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl">
                            <XCircle className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-50 rounded-lg">
                        <Upload size={20} className="text-primary-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Upload Certificates</h2>
                </div>

                <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-grow w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
                        <div className="relative">
                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-3 file:px-6
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-50 file:text-primary-700
                                    hover:file:bg-primary-100
                                    border border-gray-200 rounded-xl bg-gray-50 cursor-pointer"
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">Supported format: .csv (with headers: certificateId, studentName, ...)</p>
                    </div>
                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className={`px-8 py-3 rounded-xl font-semibold text-white transition-all shadow-lg active:scale-95 ${uploading || !file
                            ? 'bg-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-gray-900 hover:bg-black hover:shadow-xl'
                            }`}
                    >
                        {uploading ? (
                            <span className="flex items-center gap-2">
                                <Loader className="animate-spin" size={16} /> Uploading...
                            </span>
                        ) : 'Upload CSV'}
                    </button>
                </form>
                {message && (
                    <div className={`mt-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.includes('failed') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                        }`}>
                        {message.includes('failed') ? <XCircle size={18} /> : <CheckCircle size={18} />}
                        {message}
                    </div>
                )}
            </div>

            {/* Certificate List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText size={20} className="text-gray-400" />
                        Recent Certificates
                    </h2>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader className="animate-spin text-primary-600 h-8 w-8" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Certificate ID</th>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Domain</th>
                                    <th className="px-6 py-4">Date Issued</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCertificates.map((cert) => (
                                    <tr key={cert._id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs font-medium text-gray-600">
                                            {cert.certificateId}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{cert.studentName}</div>
                                            <div className="text-xs text-gray-500">{cert.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="inline-block px-2 py-1 rounded-md bg-gray-100 text-xs font-medium">
                                                {cert.internshipDomain}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(cert.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {cert.isRevoked ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                    Revoked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Valid
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!cert.isRevoked && (
                                                <button
                                                    onClick={() => handleRevoke(cert.certificateId)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                    title="Revoke Certificate"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredCertificates.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="h-8 w-8 text-gray-300" />
                                                <p>No certificates found matching your search</p>
                                            </div>
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
