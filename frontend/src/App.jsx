import React from "react";
import {BrowserRouter as Router , Routes , Route , Navigate} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminCreateUser from './pages/AdminCreateUser'
import AdminEditUser from './pages/AdminEditUser'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage />} />
        

        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
        } 
        />
        <Route path="/admin" element={<AdminRoute><AdminDashboard/></AdminRoute>} />
        <Route
          path="/admin/create"
          element={
            <AdminRoute>
              <AdminCreateUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <AdminRoute>
              <AdminEditUser />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App