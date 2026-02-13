import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, LogOut } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="bg-primary-50 p-2 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <ShieldCheck size={28} className="text-primary-600" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                        CertVerifier
                    </span>
                </Link>
                <nav>
                    {token ? (
                        <div className="flex items-center space-x-6">
                            <Link
                                to="/admin"
                                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all hover:scale-[1.02]"
                        >
                            <LogIn size={16} />
                            <span>Admin Login</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
