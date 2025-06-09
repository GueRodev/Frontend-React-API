import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Mail, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-green-400">UTA</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-white">Dashboard</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Hola, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-white">
                  ¡Bienvenido de vuelta, {user?.name}!
                </h2>
                <p className="text-green-100">
                  Has iniciado sesión exitosamente en tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Perfil</h3>
                  <p className="text-gray-400 text-sm">{user?.name}</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Email</h3>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Account Created Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-purple-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Miembro desde</h3>
                  <p className="text-gray-400 text-sm">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Información de la cuenta</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">ID de usuario:</span>
                <span className="text-white">{user?.id}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Email verificado:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  user?.email_verified_at 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {user?.email_verified_at ? 'Verificado' : 'Pendiente'}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-400">Última actualización:</span>
                <span className="text-white">
                  {user?.updated_at ? new Date(user.updated_at).toLocaleString('es-ES') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;