import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [certId, setCertId] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (certId.trim()) {
            navigate(`/verify/${certId}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                    Verify Your Certificate
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                    Ensure the authenticity of your achievements. Enter your unique certificate ID below to verify its validity instantly.
                </p>
            </motion.div>

            <motion.form
                onSubmit={handleSearch}
                className="w-full max-w-md flex flex-col md:flex-row gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder="Certificate ID (e.g., CERT-12345)"
                        value={certId}
                        onChange={(e) => setCertId(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                >
                    Verify
                </button>
            </motion.form>
        </div>
    );
};

export default Home;
