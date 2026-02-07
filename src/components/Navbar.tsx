export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/30">
                            S
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            SIPERU
                        </span>
                    </div>


                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-800">Admin</p>
                                <p className="text-xs text-gray-500">Petugas Lab</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gray-200 border border-white" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
