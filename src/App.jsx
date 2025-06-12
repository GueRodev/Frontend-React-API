import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';

// 👤 Profile Pages
import UserProfile from './pages/profile/UserProfile';

// Materias Pages
import MateriasList from './pages/materias/MateriasList';
// import MateriaDetail from './pages/materias/MateriaDetail';
// import MateriaForm from './pages/materias/MateriaForm';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Ruta raíz - redirige al dashboard si está autenticado, sino al login */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />

          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* 👤 Ruta de Perfil - Protegida */}
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />

          {/* 📚 Rutas de Materias - Todas protegidas */}
          <Route 
            path="/materias" 
            element={
              <ProtectedRoute>
                <MateriasList />
              </ProtectedRoute>
            } 
          />

          {/* Comentadas hasta que tengas los componentes creados */}
          {/* 
          <Route 
            path="/materias/nueva" 
            element={
              <ProtectedRoute>
                <MateriaForm />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/materias/:codigo" 
            element={
              <ProtectedRoute>
                <MateriaDetail />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/materias/:codigo/editar" 
            element={
              <ProtectedRoute>
                <MateriaForm />
              </ProtectedRoute>
            } 
          />
          */}

          {/* Ruta 404 - redirige al dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;