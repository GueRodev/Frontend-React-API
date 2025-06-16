import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react';

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
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  // Contraseñas comunes a evitar
  const commonPasswords = [
    'password', '123456789', '12345678', 'qwerty123', 'abc123456', 
    'password123', '123456abc', 'admin123', 'user123', 'test123'
  ];

  // Validación de nombre (solo letras, espacios, acentos y guiones)
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

  // Validación de email mejorada
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

  // Análisis de fortaleza de contraseña
  const analyzePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];
    
    // Longitud
    if (password.length >= 8) score += 1;
    else feedback.push('Mínimo 8 caracteres');
    
    if (password.length >= 12) score += 1;
    
    // Mayúsculas
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Al menos una mayúscula');
    
    // Minúsculas
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Al menos una minúscula');
    
    // Números
    if (/\d/.test(password)) score += 1;
    else feedback.push('Al menos un número');
    
    // Caracteres especiales
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) score += 1;
    else feedback.push('Al menos un carácter especial');
    
    // Penalizaciones
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score -= 2;
      feedback.push('Evita contraseñas comunes');
    }
    
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push('Evita caracteres repetidos');
    }
    
    if (/123|abc|qwe/i.test(password)) {
      score -= 1;
      feedback.push('Evita secuencias simples');
    }
    
    return { score: Math.max(0, Math.min(6, score)), feedback };
  };

  // Validación de contraseña completa
  const validatePassword = (password, name = '', email = '') => {
    const errors = [];
    
    if (!password) {
      return ['La contraseña es requerida'];
    }
    
    if (password.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
    }
    
    if (password.length > 128) {
      errors.push('No puede exceder 128 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial (!@#$%^&*...)');
    }
    
    // Verificar que no contenga información personal
    if (name && password.toLowerCase().includes(name.toLowerCase().split(' ')[0])) {
      errors.push('No debe contener tu nombre');
    }
    
    if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
      errors.push('No debe contener tu email');
    }
    
    // Verificar contraseñas comunes
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      errors.push('No uses contraseñas comunes');
    }
    
    // Verificar patrones simples
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Evita repetir el mismo carácter 3+ veces');
    }
    
    if (/123|abc|qwe|asd|zxc/i.test(password)) {
      errors.push('Evita secuencias del teclado');
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Actualizar fortaleza de contraseña en tiempo real
    if (name === 'password') {
      setPasswordStrength(analyzePasswordStrength(value));
    }
    
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

    // Validar contraseña
    const passwordErrors = validatePassword(formData.password, formData.name, formData.email);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    // Validar confirmación de contraseña
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = ['Debes confirmar tu contraseña'];
    } else if (formData.password !== formData.password_confirmation) {
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

    // Verificar fortaleza mínima de contraseña
    if (passwordStrength.score < 4) {
      setErrors({ password: ['La contraseña no es lo suficientemente segura'] });
      setIsSubmitting(false);
      return;
    }

    try {
      // Limpiar y normalizar datos antes de enviar
      const cleanData = {
        name: formData.name.trim().replace(/\s+/g, ' '),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      const result = await register(cleanData);
      
      if (result.success) {
        setRegistrationSuccess(true);
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

  // Componente para mostrar fortaleza de contraseña
  const PasswordStrengthIndicator = () => {
    if (!formData.password) return null;
    
    const getStrengthColor = (score) => {
      if (score < 2) return 'bg-red-500';
      if (score < 4) return 'bg-yellow-500';
      if (score < 5) return 'bg-blue-500';
      return 'bg-green-500';
    };
    
    const getStrengthText = (score) => {
      if (score < 2) return 'Muy débil';
      if (score < 4) return 'Débil';
      if (score < 5) return 'Buena';
      return 'Excelente';
    };
    
    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">Fortaleza:</span>
          <span className={`text-xs font-medium ${
            passwordStrength.score < 2 ? 'text-red-400' :
            passwordStrength.score < 4 ? 'text-yellow-400' :
            passwordStrength.score < 5 ? 'text-blue-400' : 'text-green-400'
          }`}>
            {getStrengthText(passwordStrength.score)}
          </span>
        </div>
        <div className="w-full bg-gray-600/50 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
            style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
          />
        </div>
        {passwordStrength.feedback.length > 0 && (
          <div className="text-xs text-gray-400">
            Mejoras: {passwordStrength.feedback.join(', ')}
          </div>
        )}
      </div>
    );
  };

  const passwordsMatch = formData.password && formData.password_confirmation && 
                        formData.password === formData.password_confirmation;

  // Pantalla de éxito
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
                Tu cuenta ha sido creada exitosamente con máxima seguridad.
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
              Únete a nosotros con seguridad máxima
            </p>
            <div className="flex items-center justify-center mt-2 text-xs text-green-400">
              <Shield className="h-4 w-4 mr-1" />
              Validaciones de seguridad activadas
            </div>
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
                  Nombre completo *
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
                    maxLength="50"
                    value={formData.name}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                      errors.name 
                        ? 'border-red-500/60 focus:border-red-400' 
                        : 'border-gray-600/60 focus:border-green-400/60'
                    } placeholder-gray-500 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-200`}
                    placeholder="Solo letras y espacios"
                  />
                </div>
                {errors.name && (
                  <div className="mt-2 space-y-1">
                    {errors.name.map((error, index) => (
                      <p key={index} className="text-sm text-red-400">{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Correo electrónico *
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
                    maxLength="254"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                      errors.email 
                        ? 'border-red-500/60 focus:border-red-400' 
                        : 'border-gray-600/60 focus:border-green-400/60'
                    } placeholder-gray-500 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-200`}
                    placeholder="usuario@dominio.com"
                  />
                </div>
                {errors.email && (
                  <div className="mt-2 space-y-1">
                    {errors.email.map((error, index) => (
                      <p key={index} className="text-sm text-red-400">{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña *
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
                    maxLength="128"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-12 py-3 border ${
                      errors.password 
                        ? 'border-red-500/60 focus:border-red-400' 
                        : 'border-gray-600/60 focus:border-green-400/60'
                    } placeholder-gray-500 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-200`}
                    placeholder="8+ caracteres, mayús., núm., símbolos"
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
                
                <PasswordStrengthIndicator />
                
                {errors.password && (
                  <div className="mt-2 space-y-1">
                    {errors.password.map((error, index) => (
                      <p key={index} className="text-sm text-red-400">{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar contraseña *
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
                    maxLength="128"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-16 py-3 border ${
                      errors.password_confirmation 
                        ? 'border-red-500/60 focus:border-red-400' 
                        : passwordsMatch 
                        ? 'border-green-500/60 focus:border-green-400/60' 
                        : 'border-gray-600/60 focus:border-green-400/60'
                    } placeholder-gray-500 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-200`}
                    placeholder="Repite tu contraseña"
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
                  <div className="mt-2 space-y-1">
                    {errors.password_confirmation.map((error, index) => (
                      <p key={index} className="text-sm text-red-400">{error}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || loading || passwordStrength.score < 4}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-gray-900 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span>Creando cuenta segura...</span>
                  </div>
                ) : (
                  'Crear Cuenta Segura'
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