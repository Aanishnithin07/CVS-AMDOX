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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-300/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mx-auto px-4"
            >
                <div className="inline-block mb-4 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full shadow-sm">
                    <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                        Official Verification Portal
                    </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                    Verify Certificates with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                        Confidence & Speed
                    </span>
                </h1>

                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Instantly validate academic and professional achievements. Our secure system ensures authenticity for every credential.
                </p>
            </motion.div>

            <motion.form
                onSubmit={handleSearch}
                className="w-full max-w-lg px-4 relative z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex shadow-2xl rounded-2xl bg-white overflow-hidden p-2">
                        <div className="flex-grow relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 text-lg border-none focus:ring-0 text-gray-900 placeholder-gray-400 bg-transparent"
                                placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
                                value={certId}
                                onChange={(e) => setCertId(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="ml-2 px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </motion.form>

            <motion.div
                className="mt-12 grid grid-cols-3 gap-8 text-center text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-1 bg-primary-500/20 rounded-full mb-1"></div>
                    <span className="font-medium">Instant Verification</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-1 bg-secondary-500/20 rounded-full mb-1"></div>
                    <span className="font-medium">Secure Database</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-1 bg-blue-500/20 rounded-full mb-1"></div>
                    <span className="font-medium">Global Access</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
