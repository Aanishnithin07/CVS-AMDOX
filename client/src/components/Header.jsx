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
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                    <ShieldCheck size={32} />
                    <span className="text-xl font-bold">CertVerifier</span>
                </Link>
                <nav>
                    {token ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 text-red-500 hover:text-red-700 font-medium"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium"
                        >
                            <LogIn size={18} />
                            <span>Admin Login</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
