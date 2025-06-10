import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  User, 
  Mail, 
  Calendar,
  BookOpen,
  GraduationCap,
  Building2,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNotifications, setActiveNotifications] = useState(3);

  const handleLogout = async () => {
    await logout();
  };

  // Datos de módulos
  const modules = [
    {
      id: 'materias',
      title: 'Materias',
      description: 'Gestión de materias y asignaturas',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      stats: '45 materias',
      path: '/materias'
    },
    {
      id: 'estudiantes',
      title: 'Estudiantes',
      description: 'Registro y gestión de estudiantes',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      stats: '1,240 estudiantes',
      path: '/estudiantes'
    },
    {
      id: 'carreras',
      title: 'Carreras',
      description: 'Gestión de carreras universitarias',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      stats: '8 carreras',
      path: '/carreras'
    },
    {
      id: 'matricula',
      title: 'Matrícula',
      description: 'Proceso de matrícula y asignaciones',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      stats: 'Período activo',
      path: '/matricula'
    },
    {
      id: 'expediente',
      title: 'Expediente Académico',
      description: 'Record y progreso académico',
      icon: BarChart3,
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      stats: 'Vista completa',
      path: '/expediente'
    },
    {
      id: 'perfil',
      title: 'Perfil',
      description: 'Configuración y datos personales',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700',
      stats: 'Configurar',
      path: '/perfil'
    }
  ];

  const handleModuleClick = (modulePath) => {
    // Por ahora solo mostramos un mensaje, después navegaremos
    console.log(`Navegando a: ${modulePath}`);
    // navigate(modulePath); // Activar cuando tengamos las rutas
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header Mejorado */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo y Navegación */}
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">UTA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Sistema Universitario</h1>
                <p className="text-sm text-gray-400">Panel de Administración</p>
              </div>
            </div>

            {/* Barra de búsqueda central */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar estudiantes, materias..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                />
              </div>
            </div>

            {/* Menu Usuario */}
            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50">
                  <Bell className="h-5 w-5" />
                  {activeNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {activeNotifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Info Usuario */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">Administrador</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-green-400" />
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-red-600/50 text-sm font-medium rounded-xl text-red-400 hover:bg-red-600/10 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    ¡Bienvenido, {user?.name}!
                  </h2>
                  <p className="text-green-200 mt-1">
                    Gestiona el sistema universitario desde aquí
                  </p>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-green-200 text-sm">Último acceso</p>
                <p className="text-white font-medium">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Estudiantes</p>
                  <p className="text-2xl font-bold text-white">1,240</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Materias Activas</p>
                  <p className="text-2xl font-bold text-white">45</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Carreras</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Módulos Principales */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Módulos del Sistema</h3>
              <p className="text-gray-400 text-sm">Selecciona un módulo para comenzar</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <div
                    key={module.id}
                    onClick={() => handleModuleClick(module.path)}
                    className="group bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-gray-500/50 hover:shadow-2xl hover:shadow-gray-900/50 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-14 w-14 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                        {module.title}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {module.description}
                      </p>
                      <div className="pt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 group-hover:bg-green-500/20 group-hover:text-green-300 transition-all">
                          {module.stats}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Información de la Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                  <User className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Nombre completo</p>
                    <p className="text-white font-medium">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Correo electrónico</p>
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Miembro desde</p>
                    <p className="text-white font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                  <div className="h-5 w-5 flex items-center justify-center">
                    <div className={`h-3 w-3 rounded-full ${user?.email_verified_at ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Estado de verificación</p>
                    <p className="text-white font-medium">
                      {user?.email_verified_at ? 'Verificado' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;