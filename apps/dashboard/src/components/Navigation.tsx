import React from 'react';

const Navigation: React.FC = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="text-lg font-bold">Catering Marketplace</div>
            <ul className="flex space-x-4">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="/caterers" className="hover:underline">Caterers</a></li>
                <li><a href="/menus" className="hover:underline">Menus</a></li>
                <li><a href="/about" className="hover:underline">About Us</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
            <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Navigation;