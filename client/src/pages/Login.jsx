import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };


    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-140px)]">
            <motion.div
                className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

                <div className="flex justify-center mb-8">
                    <div className="bg-primary-50 p-4 rounded-2xl shadow-inner">
                        <Lock className="h-8 w-8 text-primary-600" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8">Sign in to the admin dashboard</p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-black transition duration-300 shadow-lg transform active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
