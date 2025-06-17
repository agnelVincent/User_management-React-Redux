import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {

    const {isAuthenticated , isAdmin} = useSelector(state=>state.auth)

    if(!isAuthenticated){
        return <Navigate to='/login' replace/>
    }

    const location = window.location.pathname
    if(isAdmin && !location.startsWith('/admin')){
        return <Navigate to="/admin" replace/>
    }

    return children
}

export default ProtectedRoute