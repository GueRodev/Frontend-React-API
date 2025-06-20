import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/apiService';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Settings,
  CheckCircle,
  Clock,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar formulario con datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Navegación al dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Validación de nombre (mismas reglas que Register)
  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']+$/;
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return ['El nombre es requerido'];
    }
    if (trimmedName.length < 2) {
      return ['El nombre debe tener al menos 2 caracteres'];
    }
    if (trimmedName.length > 50) {
      return ['El nombre no puede exceder 50 caracteres'];
    }
    if (!nameRegex.test(trimmedName)) {
      return ['El nombre solo puede contener letras, espacios, acentos y guiones'];
    }
    if (/^\s|\s$/.test(name)) {
      return ['El nombre no puede empezar o terminar con espacios'];
    }
    if (/\s{2,}/.test(trimmedName)) {
      return ['El nombre no puede tener espacios consecutivos'];
    }
    
    return [];
  };

  // Validación de email (mismas reglas que Register)
  const validateEmail = (email) => {
    // Regex que requiere al menos una extensión de dominio válida
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      return ['El email es requerido'];
    }
    if (trimmedEmail.length > 254) {
      return ['El email es demasiado largo'];
    }
    if (!emailRegex.test(trimmedEmail)) {
      return ['Por favor ingresa un email válido (ej: usuario@dominio.com)'];
    }
    
    // Validaciones adicionales
    const [localPart, domain] = trimmedEmail.split('@');
    if (localPart.length > 64) {
      return ['La parte local del email es demasiado larga'];
    }
    if (domain.length > 253) {
      return ['El dominio del email es demasiado largo'];
    }
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return ['El email no puede empezar o terminar con punto'];
    }
    if (localPart.includes('..')) {
      return ['El email no puede tener puntos consecutivos'];
    }
    
    // Verificar que tenga extensión de dominio válida
    if (!domain.includes('.')) {
      return ['El email debe tener una extensión de dominio válida (.com, .org, etc.)'];
    }
    
    // Verificar que la extensión tenga al menos 2 caracteres
    const parts = domain.split('.');
    const extension = parts[parts.length - 1];
    if (extension.length < 2) {
      return ['La extensión del dominio debe tener al menos 2 caracteres'];
    }
    
    return [];
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validación completa del formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    const nameErrors = validateName(formData.name);
    if (nameErrors.length > 0) {
      newErrors.name = nameErrors;
    }

    // Validar email
    const emailErrors = validateEmail(formData.email);
    if (emailErrors.length > 0) {
      newErrors.email = emailErrors;
    }
    
    return newErrors;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});
    
    console.log('🔄 Iniciando actualización de perfil...');
    console.log('📝 Datos del formulario:', formData);
    
    // Validación del formulario
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      console.log('❌ Errores de validación:', formErrors);
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('🚀 Enviando petición de actualización...');
      
      // Limpiar y normalizar datos antes del envío
      const cleanData = {
        name: formData.name.trim().replace(/\s+/g, ' '),
        email: formData.email.trim().toLowerCase()
      };
      
      const result = await updateProfile(cleanData);
      console.log('📨 Respuesta recibida:', result);
      
      if (result.success) {
        console.log('✅ Perfil actualizado correctamente');
        setMessage('Perfil actualizado correctamente');
        setIsEditing(false);
      } else {
        console.log('❌ Error en la actualización:', result);
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setMessage(result.message || 'Error al actualizar el perfil');
        }
      }
    } catch (error) {
      console.error('💥 Error durante la actualización:', error);
      setMessage('Error de conexión. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancelar edición y restaurar datos originales
  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
    setErrors({});
    setMessage('');
    setIsEditing(false);
  };

  // Formatear fecha de miembro
  const formatMemberSince = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para verificar la conexión usando servicios existentes
  const testConnection = async () => {
    try {
      console.log('🔍 Probando conexión con el backend usando authService...');
      setMessage('Probando conexión...');
      
      const response = await authService.getCurrentUser();
      console.log('📡 Respuesta del servidor:', response);
      
      if (response.success) {
        console.log('✅ Conexión exitosa, datos del usuario:', response.data);
        setMessage('Conexión con el servidor: OK - Usuario obtenido correctamente');
      } else {
        console.log('❌ Error en la respuesta:', response.message);
        setMessage(`Error del servidor: ${response.message}`);
      }
    } catch (error) {
      console.error('💥 Error de conexión:', error);
      setMessage(`Error de conexión: ${error.message || 'Error desconocido'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Cargando información del perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Encabezado con navegación */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-2xl mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Configuración del Perfil</h1>
                  <p className="mt-1 text-sm text-gray-400">
                    Gestiona tu información personal con validaciones de seguridad
                  </p>
                </div>
              </div>
              
              {/* Botón de prueba de conexión */}
              <button
                onClick={testConnection}
                className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm rounded-xl hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-200"
              >
                Probar Conexión
              </button>
            </div>
          </div>
        </div>

        {/* Panel de información de debugging (versión reducida para producción) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-300 mb-2">Información de Debugging</h3>
            <div className="text-xs text-yellow-200 space-y-1">
              <p><strong>Usuario cargado:</strong> {user ? 'Sí' : 'No'}</p>
              <p><strong>Token presente:</strong> {authService.getToken() ? 'Sí' : 'No'}</p>
              <p><strong>Estado de edición:</strong> {isEditing ? 'Activo' : 'Inactivo'}</p>
              <p><strong>Validaciones:</strong> Nombre (solo letras), Email (RFC compliant)</p>
            </div>
          </div>
        )}

        {/* Tarjeta principal del perfil */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-2xl">
          <div className="px-6 py-4 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-medium text-white">Información de la Cuenta</h2>
              {isEditing && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Validaciones activas
                </span>
              )}
            </div>
          </div>
          
          <div className="px-6 py-6">
            
            {/* Mensajes de estado */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl border ${
                message.includes('correctamente') || message.includes('OK')
                  ? 'bg-green-500/10 text-green-300 border-green-500/20' 
                  : message.includes('Probando')
                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                  : 'bg-red-500/10 text-red-300 border-red-500/20'
              }`}>
                <div className="flex items-center space-x-2">
                  {message.includes('correctamente') || message.includes('OK') ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : message.includes('Probando') ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span>{message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                
                {/* Campo Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-green-400" />
                      <span>Nombre Completo *</span>
                      {isEditing && (
                        <span className="text-xs text-gray-500">(Solo letras y espacios)</span>
                      )}
                    </div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    maxLength="50"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all ${
                      !isEditing 
                        ? 'bg-gray-700/30 border-gray-600/30 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-700/50 border-gray-600/50 text-white'
                    } ${errors.name ? 'border-red-500/50 focus:ring-red-400/50' : ''}`}
                    placeholder="Solo letras, espacios, acentos y guiones"
                  />
                  {errors.name && (
                    <div className="mt-2 space-y-1">
                      {errors.name.map((error, index) => (
                        <div key={index} className="flex items-center space-x-1 text-sm text-red-400">
                          <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Campo Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <span>Correo Electrónico *</span>
                      {isEditing && (
                        <span className="text-xs text-gray-500">(Formato válido)</span>
                      )}
                    </div>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    maxLength="254"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all ${
                      !isEditing 
                        ? 'bg-gray-700/30 border-gray-600/30 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-700/50 border-gray-600/50 text-white'
                    } ${errors.email ? 'border-red-500/50 focus:ring-red-400/50' : ''}`}
                    placeholder="usuario@dominio.com"
                  />
                  {errors.email && (
                    <div className="mt-2 space-y-1">
                      {errors.email.map((error, index) => (
                        <div key={index} className="flex items-center space-x-1 text-sm text-red-400">
                          <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Información adicional - solo lectura */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span>Miembro desde</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formatMemberSince(user?.created_at)}
                    disabled
                    className="w-full px-4 py-3 border border-gray-600/30 rounded-xl shadow-sm bg-gray-700/30 text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-orange-400" />
                      <span>Estado de verificación</span>
                    </div>
                  </label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border ${
                      user?.email_verified_at 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}>
                      <span className={`w-2 h-2 mr-2 rounded-full ${
                        user?.email_verified_at ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></span>
                      {user?.email_verified_at ? 'Verificado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-8 flex justify-end space-x-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 shadow-lg"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="inline-flex items-center px-6 py-3 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;