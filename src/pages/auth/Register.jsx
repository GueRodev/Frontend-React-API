import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = ['El nombre es requerido'];
    }

    if (!formData.email.trim()) {
      newErrors.email = ['El email es requerido'];
    }

    if (formData.password.length < 8) {
      newErrors.password = ['La contraseña debe tener al menos 8 caracteres'];
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = ['Las contraseñas no coinciden'];
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validación del lado del cliente
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register(formData);
      
      if (result.success) {
        // ✅ Mostrar mensaje de éxito
        setRegistrationSuccess(true);
        
        // ✅ Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Cuenta creada exitosamente. ¡Inicia sesión!' 
            }
          });
        }, 3000);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMatch = formData.password && formData.password_confirmation && 
                        formData.password === formData.password_confirmation;

  // ✅ Pantalla de éxito mejorada
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl shadow-2xl p-8 text-center space-y-6">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                ¡Cuenta Creada!
              </h2>
              <p className="text-gray-300">
                Tu cuenta ha sido creada exitosamente.
              </p>
              <p className="text-sm text-gray-400">
                Serás redirigido al inicio de sesión en unos segundos...
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-gray-900 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                Ir a Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl shadow-2xl p-8 space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-600/40">
              <span className="text-2xl font-bold text-green-400">UTA</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Crear Cuenta
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Únete a nosotros hoy mismo
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{errors.general}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                      errors.name 
                        ? 'border-red-500/60 focus:border-red-400' 
                        : 'border-gray-600/60 focus:border-green-400/60'
                    } placeholder-gray-500 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-200`}
                    placeholder="Tu nombre completo"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400">{errors.name[0]}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                      errors.email 
                        ? 'border-red-500/60 focus:border-red-400' 
                        : 'border-gray-600/60 focus:border-green-400/60'
                    } placeholder-gray-500 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-200`}
                    placeholder="tu@ejemplo.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email[0]}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-12 py-3 border ${
                      errors.password 
                        ? 'border-red-500/60 focus:border-red-400' 
                        : 'border-gray-600/60 focus:border-green-400/60'
                    } placeholder-gray-500 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-200`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">{errors.password[0]}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-16 py-3 border ${
                      errors.password_confirmation 
                        ? 'border-red-500/60 focus:border-red-400' 
                        : passwordsMatch 
                        ? 'border-green-500/60 focus:border-green-400/60' 
                        : 'border-gray-600/60 focus:border-green-400/60'
                    } placeholder-gray-500 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-200`}
                    placeholder="Confirma tu contraseña"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                    {passwordsMatch && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-400">{errors.password_confirmation[0]}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-gray-900 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-700/50">
              <p className="text-sm text-gray-400">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-green-400 hover:text-green-300 transition-colors duration-200"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;